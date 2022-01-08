import { Snowflake } from 'discord.js';
import { Logger } from 'loggage';

export interface CommanderClientOptions {
	superusers: Snowflake[],
	stagingGuilds: Snowflake[],
	privateGuilds: Snowflake[],
	logger: Logger,
}
