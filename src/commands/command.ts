import { BaseCommandInteraction } from 'discord.js';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';
import { CommanderClient, CommanderCommanderExecuteFn, CommanderCommandMode, CommanderCommandOptions, CommanderCommandPermissionOptions, PermissionResponse } from '../index.js';
import { logger } from '../logging/index.js';

export class CommanderCommand {
	public readonly category: string;
	public readonly data: Readonly<RESTPostAPIApplicationCommandsJSONBody>;
	public readonly mode: CommanderCommandMode;
	private readonly permissions: CommanderCommandPermissionOptions;
	private readonly execute: CommanderCommanderExecuteFn;

	constructor({ category, data, mode, permissions, execute  }: CommanderCommandOptions) {
		this.category = category;
		this.data = data.toJSON();
		this.mode = mode;
		this.permissions = permissions;
		this.execute = execute;
	}

	public async run(interaction: BaseCommandInteraction): Promise<void> {
		try {
			await this.execute(interaction);
		} catch (err) {
			logger.error(err);
		}
	}

	public isAllowed(interaction: BaseCommandInteraction, client: CommanderClient): PermissionResponse {
		const isSuperuser = client.isActiveSuperuser(interaction.user.id);
		
		if (isSuperuser) return PermissionResponse.ALLOWED;

		if (this.permissions.superuserOnly || this.mode === CommanderCommandMode.PRIVATE) return PermissionResponse.NO_SUPERUSER;

		if (!this.permissions.permissions.some(
			permissions => permissions.every(
				permission => interaction.memberPermissions?.has(permission)
			)
		)) return PermissionResponse.NO_PERMISSION;

		if (this.mode === CommanderCommandMode.STAGING && !client.isStagingGuild(interaction.guildId!)) 
			return PermissionResponse.NO_STAGING;

		return PermissionResponse.ALLOWED;
	}
}