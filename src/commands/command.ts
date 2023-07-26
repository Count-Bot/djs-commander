import { ChatInputCommandInteraction } from 'discord.js';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { CommanderClient, CommandExecuteFn, CommandMode, CommandOptions, CommandPermissionOptions, PermissionResponse } from '../index.js';

export class Command {
	public readonly category: string;
	public readonly data: Readonly<RESTPostAPIApplicationCommandsJSONBody>;
	public readonly mode: CommandMode;
	public readonly permissions: Readonly<CommandPermissionOptions>;
	/**
	 * Whether or not command is ephemeral (user only).
	 */
	public readonly ephemeral: boolean;
	/**
	 * Command functionality. Put command code here.
	 */
	private readonly execute: CommandExecuteFn;

	constructor({ category, data, mode, permissions, ephemeral, execute }: CommandOptions) {
		this.category = category;
		this.data = data;
		this.mode = mode;
		this.permissions = permissions;
		this.ephemeral = ephemeral;
		this.execute = execute;
	}

	/**
	 * Run the command. Be sure to evaluate the command type in client.on('interactionCreate')
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	public async run(interaction: ChatInputCommandInteraction): Promise<void> {
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

		if (this.permissions.superuserOnly || this.mode === CommandMode.PRIVATE) {
			return PermissionResponse.NO_SUPERUSER;
		}

		if (this.permissions.permissions.length > 0 && !this.permissions.permissions.some(permissions => permissions.every(permission => interaction.memberPermissions?.has(permission)))) {
			return PermissionResponse.NO_PERMISSION;
		}

		if (this.mode === CommandMode.STAGING && !client.isStagingGuild(interaction.guildId!)) {
			return PermissionResponse.NO_STAGING;
		}

		return PermissionResponse.ALLOWED;
	}
}