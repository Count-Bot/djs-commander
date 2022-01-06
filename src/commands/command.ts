import { CommandInteraction } from 'discord.js';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';
import { CommanderClient, CommanderCommanderExecuteFn, CommanderCommandMode, CommanderCommandOptions, CommanderCommandPermissionOptions, PermissionResponse } from '../index.js';
import { logger } from '../logging/index.js';

export class CommanderCommand {
	public readonly category: string;
	public readonly data: Readonly<RESTPostAPIApplicationCommandsJSONBody>;
	public readonly mode: CommanderCommandMode;
	public readonly permissions: Readonly<CommanderCommandPermissionOptions>;
	public readonly ephemeral: boolean;
	private readonly execute: CommanderCommanderExecuteFn;

	constructor({ category, data, mode, permissions, ephemeral, execute  }: CommanderCommandOptions) {
		this.category = category;
		this.data = data;
		this.mode = mode;
		this.permissions = permissions;
		this.ephemeral = ephemeral;
		this.execute = execute;
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		try {
			await interaction.deferReply({
				ephemeral: this.ephemeral,
			});

			await this.execute(interaction);
		} catch (err) {
			logger.error(err);
		}
	}

	public getPermission(interaction: CommandInteraction, client: CommanderClient): PermissionResponse {
		if (client.isActiveSuperuser(interaction.user.id)) return PermissionResponse.ALLOWED;

		if (this.permissions.superuserOnly || this.mode === CommanderCommandMode.PRIVATE) return PermissionResponse.NO_SUPERUSER;

		if (this.permissions.permissions.length > 0 && !this.permissions.permissions.some(
			permissions => permissions.every(
				permission => interaction.memberPermissions?.has(permission)
			)
		)) return PermissionResponse.NO_PERMISSION;

		if (this.mode === CommanderCommandMode.STAGING && !client.isStagingGuild(interaction.guildId!)) 
			return PermissionResponse.NO_STAGING;

		return PermissionResponse.ALLOWED;
	}
}