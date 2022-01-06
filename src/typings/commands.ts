import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';
import { Awaitable, CommandInteraction, PermissionString } from 'discord.js';
import { CommanderCommand } from '../commands/index.js';
import { CommanderClient } from '../index.js';

export interface CommanderCommandHandlerCallbacks {
	onNoPermissions: (command: CommanderCommand, interaction: CommandInteraction) => Awaitable<void>,
	onNoSuperuser: (command: CommanderCommand, interaction: CommandInteraction) => Awaitable<void>,
	onNoStaging: (command: CommanderCommand, interaction: CommandInteraction) => Awaitable<void>,
}

export interface CommanderCommandHandlerOptions {
	client: CommanderClient,
	callbacks: CommanderCommandHandlerCallbacks
}

export type CommanderCommanderExecuteFn = (interaction: CommandInteraction) =>  Awaitable<void>; 

export enum CommanderCommandMode {
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

export interface CommanderCommandPermissionOptions {
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

export interface CommanderCommandOptions {
	category: string,
	data: RESTPostAPIApplicationCommandsJSONBody,
	mode: CommanderCommandMode,
	permissions: CommanderCommandPermissionOptions,
	ephemeral: boolean, 
	execute: CommanderCommanderExecuteFn,
}

export enum PermissionResponse {
	ALLOWED,
	NO_SUPERUSER,
	NO_PERMISSION,
	NO_STAGING,
}

export interface CommanderCommandHandlerCommandData {
	release: Readonly<RESTPostAPIApplicationCommandsJSONBody>[];
	staging: Readonly<RESTPostAPIApplicationCommandsJSONBody>[];
	private: Readonly<RESTPostAPIApplicationCommandsJSONBody>[];
}