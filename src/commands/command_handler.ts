import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types';
import { BaseCommandInteraction } from 'discord.js';
import { CommanderClient } from '../client/index.js';
import { CommanderError } from '../error/index.js';
import { logger } from '../logging/index.js';
import { CommanderCommandHandlerCallbacks, CommanderCommandHandlerCommandData, CommanderCommandHandlerOptions, CommanderCommandMode, PermissionResponse } from '../typings/index.js';
import { CommanderCommand } from './command.js';
import { readdirSync } from 'fs';
import { REST } from '@discordjs/rest';

export class CommanderCommandHandler {
	private readonly client: CommanderClient;
	private readonly commands: Map<string, CommanderCommand>;
	private readonly commandData: CommanderCommandHandlerCommandData;
	private readonly callbacks: Readonly<CommanderCommandHandlerCallbacks>;
	private readonly rest: REST;

	constructor({ client, callbacks }: CommanderCommandHandlerOptions) {
		this.client = client;

		this.commands = new Map();

		this.commandData = {
			release: [],
			staging: [],
			private: [],
		};

		this.callbacks = callbacks;

		this.rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);
	}

	private addCommand(command: CommanderCommand): void {
		this.commands.set(command.data.name, command);

		switch (command.mode) {
			case CommanderCommandMode.RELEASE:
				this.commandData.release.push(command.data);
				break;
			case CommanderCommandMode.STAGING:
				this.commandData.staging.push(command.data);
				break;
			case CommanderCommandMode.PRIVATE:
				this.commandData.private.push(command.data);
				break;
		}

		logger.info(`Loaded command: ${command.data.name}`);
	}

	public async loadCommands(directory: string): Promise<void> {
		for (const dirent of readdirSync(directory, { withFileTypes: true })) {
			const path = `${directory}/${dirent.name}`;

			if (dirent.isDirectory()) {
				this.loadCommands(path);
			} else if (dirent.isFile() && dirent.name.endsWith('.js')) {
				const command = (await import(path)).default;

				if (!(command instanceof CommanderCommand)) {
					throw new CommanderError('NOT_A_COMMAND', path);
				}

				this.addCommand(command);
			}
		}
	}
	
	public run(commandName: string, interaction: BaseCommandInteraction): void {
		const command = this.commands.get(commandName);

		if (!command) {
			logger.error(new CommanderError('COMMAND_DOESNT_EXIST', commandName));
			return;
		}
		
		const isAllowed = command.isAllowed(interaction, this.client);

		switch (isAllowed) {
			case PermissionResponse.NO_PERMISSION:
				this.callbacks.onNoPermissions(command, interaction);
				return;
			case PermissionResponse.NO_SUPERUSER:
				this.callbacks.onNoSuperuser(command, interaction);
				return;
			case PermissionResponse.NO_STAGING:
				this.callbacks.onNoStaging(command, interaction);
				return;
			default:
				command.run(interaction);
				break;
		}
	}

	public updateReleaseCommands(): void {
		this.updateCommands(
			Routes.applicationCommands(this.client.user!.id), 
			this.commandData.release
		);
	}

	public updateStagingCommands(): void {
		for (const guildID of this.client.stagingGuilds) {
			this.updateCommands(
				Routes.applicationGuildCommands(this.client.user!.id, guildID), 
				this.commandData.staging
			);
		}
	}

	public updatePrivateCommands(): void {
		for (const guildID of this.client.privateGuilds) {
			this.updateCommands(
				Routes.applicationGuildCommands(this.client.user!.id, guildID), 
				this.commandData.private
			);
		}
	}

	private updateCommands(route: `/${string}`, commands: RESTPostAPIApplicationCommandsJSONBody[]): void {
		(async () => {
			try {
				logger.info('Started updating commands for route: ' + route);

				await this.rest.put(
					route,
					{ body: commands },
				);

				logger.info('Succesfully updated commands for route: ' + route);
			} catch (err) {
				logger.error(err);
			}
		})();
	}
}
