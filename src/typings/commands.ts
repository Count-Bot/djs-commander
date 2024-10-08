import type { Loggage } from '@countbot/loggage';
import { Awaitable, ChatInputCommandInteraction, RESTPostAPIApplicationCommandsJSONBody, Snowflake } from 'discord.js';

import type { Command } from '../commands/index.js';
import type { CommanderClient } from '../index.js';

export interface CommandHandlerCallbacks {
  /**
   * Callback when the user running the command is not a super user
   * @param command - The DJS-Commander Command
   * @param interaction - The Command Interaction from Discord
   */
  onNoSuperuser: (command: Command, interaction: ChatInputCommandInteraction) => Awaitable<void>;
  /**
   * Callback when the user running the command is not in a staging server
   * @param command - The DJS-Commander Command
   * @param interaction - The Command Interaction from Discord
   */
  onNoStaging: (command: Command, interaction: ChatInputCommandInteraction) => Awaitable<void>;
  /**
   * Callback when the Command.run() function fails
   * @param command - The DJS-Commander Command
   * @param  interaction - The Command Interaction from Discord
   * @param err - The error that was thrown
   */
  onCommandError: (command: Command, interaction: ChatInputCommandInteraction, err: unknown) => Awaitable<void>;
}

export interface CommandHandlerOptions {
  /**
   * The Commander (DJS) Client
   */
  client: CommanderClient;
  /**
   * The callbacks for command errors
   */
  callbacks: CommandHandlerCallbacks;
  /**
   * Logging client
   */
  logger: Loggage;
}

export type CommandExecuteFn = (interaction: ChatInputCommandInteraction) => Awaitable<void>;

export enum CommandMode {
  /**
   * The command is only available in the development guild but is available to anyone.
   */
  PRIVATE_NO_SUPERUSER,
  /**
   * The command is only available in the development guild and is only available to superusers.
   */
  PRIVATE,
  /**
   * The command is only available in the staging guilds.
   */
  STAGING,
  /**
   * The command is available in all guilds.
   */
  RELEASE,
}

export interface CommandOptions {
  /**
   * Command category
   */
  category: string;
  /**
   * Slash command data
   */
  data: RESTPostAPIApplicationCommandsJSONBody;
  /**
   * Command usage mode
   */
  mode: CommandMode;
  /**
   * If the command is super user only
   */
  superUserOnly: boolean;
  /**
   * If command is ephemeral (only user can see it)
   */
  ephemeral: boolean;
  /**
   * Command functionality. Put command code here.
   */
  execute: CommandExecuteFn;
}

export enum PermissionResponse {
  /**
   * Command is allowed and executes
   */
  ALLOWED,
  /**
   * Command is not allowed for non-super users and returns error
   */
  NO_SUPERUSER,
  /**
   * User is not running command in a staging server and returns error
   */
  NO_STAGING,
}

export interface GetPermissionOptions {
  /**
   * Check a User ID's ability to run a command
   */
  userId: Snowflake;
  /**
   * Check a Guild ID's ability to run a command
   */
  guildId?: Snowflake;
}

export interface CommandHandlerCommandData {
  release: Readonly<RESTPostAPIApplicationCommandsJSONBody>[];
  staging: Readonly<RESTPostAPIApplicationCommandsJSONBody>[];
  private: Readonly<RESTPostAPIApplicationCommandsJSONBody>[];
}
