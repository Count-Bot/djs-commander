import { SlashCommandBuilder } from '@discordjs/builders';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';
import { Awaitable, BaseCommandInteraction, PermissionString } from 'discord.js';
import { CommanderCommand } from '../commands/index.js';
import { CommanderClient } from '../index.js';

export interface CommanderCommandHandlerCallbacks {
	onNoPermissions: (command: CommanderCommand, interaction: BaseCommandInteraction) => Awaitable<void>,
	onNoSuperuser: (command: CommanderCommand, interaction: BaseCommandInteraction) => Awaitable<void>,
	onNoStaging: (command: CommanderCommand, interaction: BaseCommandInteraction) => Awaitable<void>,
}

export interface CommanderCommandHandlerOptions {
	client: CommanderClient,
	callbacks: CommanderCommandHandlerCallbacks
}

export type CommanderCommanderExecuteFn = (interaction: BaseCommandInteraction) =>  Awaitable<void>; 

export enum CommanderCommandMode {
	/**
	 * The command is only available in the development guild and is only available to superusers.
	 */
	PRIVATE,
	/**
	 * The command is only available in the development guild.
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
	data: SlashCommandBuilder,
	mode: CommanderCommandMode,
	permissions: CommanderCommandPermissionOptions, 
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