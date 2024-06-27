import type { Snowflake } from 'discord.js';
import type { Logger } from 'loggage';

export interface CommanderClientOptions {
  /**
   * Array of user IDs to be super users
   */
  superusers: Snowflake[],
  /**
   * Array of server IDs to be staging guilds
   */
  stagingGuilds: Snowflake[],
  /**
   * Array of server IDs to be private guilds
   */
  privateGuilds: Snowflake[],
  /**
   * Logger client
   */
  logger: Logger,
}
