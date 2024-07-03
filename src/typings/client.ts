import type { Snowflake } from 'discord.js';
import type { Loggage } from '@countbot/loggage';

export interface CommanderClientOptions {
  /**
   * Array of user IDs to be super users
   */
  superUsers: Snowflake[],
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
  logger: Loggage,
}
