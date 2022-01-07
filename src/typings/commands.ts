import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';
import { Awaitable, CommandInteraction, PermissionString } from 'discord.js';
import { Command } from '../commands/index.js';
import { CommanderClient } from '../index.js';

export interface CommandHandlerCallbacks {
	onNoPermissions: (command: Command, interaction: CommandInteraction) => Awaitable<void>,
	onNoSuperuser: (command: Command, interaction: CommandInteraction) => Awaitable<void>,
	onNoStaging: (command: Command, interaction: CommandInteraction) => Awaitable<void>,
}

export interface CommandHandlerOptions {
	client: CommanderClient,
	callbacks: CommandHandlerCallbacks
}

export type CommandExecuteFn = (interaction: CommandInteraction) =>  Awaitable<void>; 

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
	permissions: [PermissionString, ...PermissionString[]][],
	/**
	 * Only available to superusers.
	 */
	superuserOnly: boolean,
}

export interface CommandOptions {
	category: string,
	data: RESTPostAPIApplicationCommandsJSONBody,
	mode: CommandMode,
	permissions: CommandPermissionOptions,
	ephemeral: boolean, 
	execute: CommandExecuteFn,
}

export enum PermissionResponse {
	ALLOWED,
	NO_SUPERUSER,
	NO_PERMISSION,
	NO_STAGING,
}

export interface CommandHandlerCommandData {
	release: Readonly<RESTPostAPIApplicationCommandsJSONBody>[];
	staging: Readonly<RESTPostAPIApplicationCommandsJSONBody>[];
	private: Readonly<RESTPostAPIApplicationCommandsJSONBody>[];
}