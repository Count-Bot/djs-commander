import {
  ChatInputCommandInteraction, DiscordAPIError, RESTPostAPIApplicationCommandsJSONBody, Snowflake,
} from 'discord.js';
import { readdirSync } from 'fs';
import { Loggage } from '@countbot/loggage';

import { CommanderError } from '../error/index.js';
import {
  CommandHandlerCallbacks, CommandHandlerCommandData, CommandHandlerOptions, CommandMode,
  PermissionResponse,
} from '../typings/index.js';
import { Command } from './command.js';

import type { CommanderClient } from '../client/index.js';

export class CommandHandler {
  private readonly client: CommanderClient;
  private readonly commands: Map<string, Command>;
  private readonly _categories: Map<string, Command[]>;
  private readonly commandData: CommandHandlerCommandData;
  private readonly callbacks: Readonly<CommandHandlerCallbacks>;
  private readonly logger: Loggage;

  constructor ({ client, callbacks, logger }: CommandHandlerOptions) {
    this.client = client;

    this.commands = new Map();
    this._categories = new Map();

    this.commandData = {
      release: [],
      staging: [],
      private: [],
    };

    this.callbacks = callbacks;

    this.logger = logger;
  }

  /**
   * Get command data of release, staging or private
   * @param {string} type - `release`, `staging` or `private`
   * @returns {Readonly<CommandHandlerCommandData[T]>} Command data
   */
  public getCommandData<T extends keyof CommandHandlerCommandData>(type: T): Readonly<CommandHandlerCommandData[T]> {
    return this.commandData[type];
  }

  public get categories(): Map<string, readonly Command[]> {
    return this._categories;
  }

  /**
   * Attempt to run the command
   * @param {string} commandName - The name of the command to run
   * @param {ChatInputCommandInteraction} interaction - The interaction from the interactionCreate event 
   */
  public async run(commandName: string, interaction: ChatInputCommandInteraction): Promise<void> {
    const command = this.commands.get(commandName);

    if (!command) {
      this.logger.error(new CommanderError('COMMAND_DOESNT_EXIST', commandName));
      return;
    }

    const isAllowed = command.getPermission({ guildId: interaction.guildId ?? undefined, userId: interaction.user.id }, this.client);

    switch (isAllowed) {
      case PermissionResponse.NO_SUPERUSER: {
        this.callbacks.onNoSuperuser(command, interaction);
      } break;
      case PermissionResponse.NO_STAGING: {
        this.callbacks.onNoStaging(command, interaction);
      } break;
      case PermissionResponse.ALLOWED:
        try {
          await command.run(interaction);
        } catch (err) {
          this.logger.error(err);
          this.callbacks.onCommandError(command, interaction, err);
        }
        break;
    }
  }

  /**
   * Update `CommandMode.Release` commands
   */
  public updateReleaseCommands(): Promise<void> {
    return this.updateCommands(
      this.commandData.release,
    );
  }

  /**
   * Update `CommandMode.Staging` commands
   */
  public async updateStagingCommands(): Promise<void> {
    for (const guildId of this.client.stagingGuilds) {
      await this.updateCommands(
        this.commandData.staging,
        guildId,
      );
    }
  }

  /**
   * Update `CommandMode.Private` commands
   */
  public async updatePrivateCommands(): Promise<void> {
    for (const guildId of this.client.privateGuilds) {
      await this.updateCommands(
        this.commandData.private,
        guildId,
      );
    }
  }

  private async updateCommands(commands: RESTPostAPIApplicationCommandsJSONBody[], id?: Snowflake): Promise<void> {
    try {
      this.logger.info('Started updating commands for: ' + (id ? id : 'global'));

      await this.client.application!.commands.set(commands, id!);

      this.logger.info('Succesfully updated commands for: ' + (id ? id : 'global'));
    } catch (err) {
      if ((err as DiscordAPIError)?.code === 50001) {
        this.logger.debug(`Didn't update commands for ${id ? id : 'global'} probably because this shard doesn't have access to that guild`);
        return;
      }

      this.logger.error(err);
    }
  }

  private addCommand(command: Command): void {
    this.commands.set(command.data.name, command);

    if (!this._categories.has(command.category)) { this._categories.set(command.category, []); }
    this._categories.get(command.category)!.push(command);

    switch (command.mode) {
      case CommandMode.RELEASE:
        this.commandData.release.push(command.data);
        break;
      case CommandMode.STAGING:
        this.commandData.staging.push(command.data);
        this.commandData.private.push(command.data);
        break;
      case CommandMode.PRIVATE_NO_SUPERUSER:
      case CommandMode.PRIVATE:
        this.commandData.private.push(command.data);
        break;
    }
  }

  /**
   * Load commands. Run this on startup.
   * Allows for sub-directories e.g. `/commands/admin/config.js`
   * @param directory - Directory path. Use build path e.g. `./build/commands/`
   */
  public async loadCommands(directory: string): Promise<void> {
    for (const dirent of readdirSync(directory, { withFileTypes: true })) {
      const path = `${directory}/${dirent.name}`;

      if (dirent.isDirectory()) {
        await this.loadCommands(path);
      } else if (dirent.isFile() && dirent.name.endsWith('.js')) {
        const command = (await import('../../../../' + path)).default;

        if (!(command instanceof Command)) {
          throw new CommanderError('NOT_A_COMMAND', path);
        }

        this.addCommand(command);
      }
    }
  }
}
