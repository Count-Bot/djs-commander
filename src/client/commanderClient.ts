import { Client, ClientOptions, Snowflake } from 'discord.js';

import { Loggage } from '@countbot/loggage';

import { CommanderError } from '../error/index.js';
import { CommanderClientOptions } from '../typings/index.js';

export class CommanderClient extends Client {
  public readonly stagingGuilds: readonly Snowflake[];
  public readonly privateGuilds: readonly Snowflake[];

  private readonly superUsers: Set<Snowflake>;
  private readonly activeSuperusers: Set<Snowflake>;
  private readonly logger: Loggage;

  constructor ({ superUsers, stagingGuilds, privateGuilds, logger }: CommanderClientOptions, clientOptions: ClientOptions) {
    super(clientOptions);

    this.superUsers = new Set(superUsers);
    this.activeSuperusers = new Set();

    this.stagingGuilds = stagingGuilds;
    this.privateGuilds = privateGuilds;

    this.logger = logger;
  }

  /**
   * Check if user is a super user
   * @param {Snowflake} id User ID
   * @returns {boolean} `true` or `false`
   */
  public isSuperuser(id: Snowflake): boolean {
    return this.superUsers.has(id);
  }

  /**
   * Enable super user for user
   * @param {Snowflake} id User ID
   */
  public enableSuperUser(id: Snowflake): void {
    if (!this.superUsers.has(id)) {
      this.logger.warning(new CommanderError('NO_SUPERUSER', id));

      return;
    }

    this.activeSuperusers.add(id);

    this.logger.info(`Superuser with Discord ID '${id}' enabled`);
  }

  /**
   * Disable super user for user
   * @param {Snowflake} id User ID
   */
  public disableSuperuser(id: Snowflake): void {
    if (!this.superUsers.has(id)) {
      this.logger.warning(new CommanderError('NO_SUPERUSER', id));
      return;
    }

    this.activeSuperusers.delete(id);

    this.logger.info(`Superuser with Discord ID '${id}' disabled`);
  }

  /**
   * Check if user has super user enabled
   * @param {Snowflake} id User ID
   * @returns {boolean} `true` or `false`
   */
  public isActiveSuperuser(id: Snowflake): boolean {
    return this.activeSuperusers.has(id);
  }

  /**
   * Check if guild is staging
   * @param {Snowflake} guildId Guild ID
   * @returns {boolean} `true` or `false`
   */
  public isStagingGuild(guildId: Snowflake): boolean {
    return this.stagingGuilds.includes(guildId) || this.privateGuilds.includes(guildId);
  }

  /**
 * Check if guild is staging
 * @param {Snowflake} guildId Guild ID
 * @returns {boolean} `true` or `false`
 */
  public isPrivateGuild(guildId: Snowflake): boolean {
    return this.stagingGuilds.includes(guildId) || this.privateGuilds.includes(guildId);
  }

  /**
   * Better Client.login method
   * @param {string} [token] 
   * @returns {Promise<string> | never}
   */
  public login(token?: string): Promise<string> | never {
    try {
      const res = super.login(token);

      return res;
    } catch (err) {
      this.logger.fatal_error(err);

      throw err;
    }
  }
}