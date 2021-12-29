import { Snowflake } from 'discord.js';

export interface CommanderClientOptions {
	superusers: Snowflake[],
	stagingGuilds: Snowflake[],
	privateGuilds: Snowflake[],
}
