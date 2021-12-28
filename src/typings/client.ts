import { PresenceData, Snowflake } from 'discord.js';

export interface CommanderClientOptions {
	superusers: Snowflake[],
	status?: PresenceData,
}
