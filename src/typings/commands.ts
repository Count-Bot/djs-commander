import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { Awaitable, ChatInputCommandInteraction, PermissionResolvable } from 'discord.js';
import { Logger } from 'loggage';
import { Command } from '../commands/index.js';
import { CommanderClient } from '../index.js';

export interface CommandHandlerCallbacks {
	/**
	 * Callback when the user's permissions do not meet the minimum permissions of the command
	 * @param {Command} command - The DJS-Commander Command
	 * @param {ChatInputCommandInteraction} interaction - The Command Interaction from Discord
	 */
	onNoPermissions: (command: Command, interaction: ChatInputCommandInteraction) => Awaitable<void>;
	/**
	 * Callback when the user running the command is not a super user
	 * @param {Command} command - The DJS-Commander Command
	 * @param {ChatInputCommandInteraction} interaction - The Command Interaction from Discord
	 */
	onNoSuperuser: (command: Command, interaction: ChatInputCommandInteraction) => Awaitable<void>;
	/**
	 * Callback when the user running the command is not in a staging server
	 * @param {Command} command - The DJS-Commander Command
	 * @param {ChatInputCommandInteraction} interaction - The Command Interaction from Discord
	 */
	onNoStaging: (command: Command, interaction: ChatInputCommandInteraction) => Awaitable<void>;
	/**
	 * Callback when the Command.run() function fails
	 * @param {Command} command - The DJS-Commander Command
	 * @param {ChatInputCommandInteraction} interaction - The Command Interaction from Discord
	 * @param {unknown} err 
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
	logger: Logger;
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

export interface CommandPermissionOptions {
	/**
	 * The permissions required to execute the command.
	 * Highest level array operator is OR and lowest level array operator is AND.
	 */
	permissions: [PermissionResolvable, ...PermissionResolvable[]][];
	/**
	 * Only available to superusers.
	 */
	superuserOnly: boolean;
}

export interface CommandOptions {
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
	 * Permissions
	 */
	permissions: CommandPermissionOptions;
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
	 * User does not have sufficient Discord permissions to run command and returns error
	 */
	NO_PERMISSION,
	/**
	 * User is not running command in a staging server and returns error
	 */
	NO_STAGING,
}

export interface CommandHandlerCommandData {
	release: Readonly<RESTPostAPIApplicationCommandsJSONBody>[];
	staging: Readonly<RESTPostAPIApplicationCommandsJSONBody>[];
	private: Readonly<RESTPostAPIApplicationCommandsJSONBody>[];
}