import { ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { CommanderClient, CommandExecuteFn, CommandMode, CommandOptions, CommandPermissionOptions, PermissionResponse } from '../index.js';

export class Command {
	public readonly category: string;
	public readonly data: Readonly<RESTPostAPIApplicationCommandsJSONBody>;
	public readonly mode: CommandMode;
	public readonly permissions: Readonly<CommandPermissionOptions>;
	public readonly ephemeral: boolean;
	private readonly execute: CommandExecuteFn;

	constructor({ category, data, mode, permissions, ephemeral, execute }: CommandOptions) {
		this.category = category;
		this.data = data;
		this.mode = mode;
		this.permissions = permissions;
		this.ephemeral = ephemeral;
		this.execute = execute;
	}

	public async run(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.deferReply({
			ephemeral: this.ephemeral,
		});

		await this.execute(interaction);
	}

	public getPermission(interaction: CommandInteraction, client: CommanderClient): PermissionResponse {
		if (client.isActiveSuperuser(interaction.user.id)) return PermissionResponse.ALLOWED;

		if (this.permissions.superuserOnly || this.mode === CommandMode.PRIVATE) return PermissionResponse.NO_SUPERUSER;

		if (this.permissions.permissions.length > 0 && !this.permissions.permissions.some(
			permissions => permissions.every(
				permission => interaction.memberPermissions?.has(permission)
			)
		)) return PermissionResponse.NO_PERMISSION;

		if (this.mode === CommandMode.STAGING && !client.isStagingGuild(interaction.guildId!))
			return PermissionResponse.NO_STAGING;

		return PermissionResponse.ALLOWED;
	}
}