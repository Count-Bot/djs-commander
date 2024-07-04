import type { ChatInputCommandInteraction, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';

import {
  CommanderClient,
  CommandExecuteFn,
  CommandMode,
  CommandOptions,
  GetPermissionOptions,
  PermissionResponse,
} from '../index.js';

export class Command {
  public readonly category: string;
  public readonly data: Readonly<RESTPostAPIApplicationCommandsJSONBody>;
  public readonly mode: CommandMode;
  public readonly superUserOnly: boolean;
  public readonly ephemeral: boolean;
  private readonly execute: CommandExecuteFn;

  constructor({ category, data, mode, superUserOnly, ephemeral, execute }: CommandOptions) {
    this.category = category;
    this.data = data;
    this.mode = mode;
    this.superUserOnly = superUserOnly;
    this.ephemeral = ephemeral;
    this.execute = execute;
  }

  /**
   * Run the command. Be sure to evaluate the command type in client.on('interactionCreate')
   * @param {ChatInputCommandInteraction} interaction - The interaction from the interactionCreate event
   */
  public async run(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({
      ephemeral: this.ephemeral,
    });

    await this.execute(interaction);
  }

  /**
   * Get the PermissionResponse evaluation of the user and command
   * @param {GetPermissionOptions} options  - The interaction from the interactionCreate event
   * @param {CommanderClient} client - The client
   * @returns {PermissionResponse} The permission response
   */
  public getPermission(options: GetPermissionOptions, client: CommanderClient): PermissionResponse {
    if (client.isActiveSuperuser(options.userId)) {
      return PermissionResponse.ALLOWED;
    }

    if (this.superUserOnly || this.mode === CommandMode.PRIVATE) {
      return PermissionResponse.NO_SUPERUSER;
    }

    if (options.guildId) {
      if (this.mode === CommandMode.STAGING && !client.isStagingGuild(options.guildId)) {
        return PermissionResponse.NO_STAGING;
      }
    }

    return PermissionResponse.ALLOWED;
  }
}
