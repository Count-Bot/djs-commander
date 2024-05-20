import { ChatInputCommandInteraction } from 'discord.js';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { CommanderClient, CommandExecuteFn, CommandMode, CommandOptions, PermissionResponse } from '../index.js';

export class Command {
  public readonly category: string;
  public readonly data: Readonly<RESTPostAPIApplicationCommandsJSONBody>;
  public readonly mode: CommandMode;
  public readonly superUserOnly: boolean;
  public readonly ephemeral: boolean;
  private readonly execute: CommandExecuteFn;

  constructor ({ category, data, mode, superUserOnly, ephemeral, execute }: CommandOptions) {
    this.category = category;
    this.data = data;
    this.mode = mode;
    this.superUserOnly = superUserOnly;
    this.ephemeral = ephemeral;
    this.execute = execute;
  }

  /**
   * Run the command. Be sure to evaluate the command type in client.on('interactionCreate')
   * @param {ChatInputCommandInteraction} interaction 
   */
  public async run(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({
      ephemeral: this.ephemeral,
    });

    await this.execute(interaction);
  }

  /**
   * Get the PermissionResponse evaluation of the user and command
   * @param {ChatInputCommandInteraction} interaction 
   * @param {CommanderClient} client 
   */
  public getPermission(interaction: ChatInputCommandInteraction, client: CommanderClient): PermissionResponse {
    if (client.isActiveSuperuser(interaction.user.id)) {
      return PermissionResponse.ALLOWED;
    }

    if (this.superUserOnly || this.mode === CommandMode.PRIVATE) {
      return PermissionResponse.NO_SUPERUSER;
    }

    if (this.mode === CommandMode.STAGING && !client.isStagingGuild(interaction.guildId!)) {
      return PermissionResponse.NO_STAGING;
    }

    return PermissionResponse.ALLOWED;
  }
}