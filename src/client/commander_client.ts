import { Client, ClientOptions, Snowflake } from 'discord.js';
import { Logger } from 'loggage';
import { CommanderError } from '../error/index.js';
import { CommanderClientOptions } from '../typings/index.js';

export class CommanderClient extends Client {
  public readonly stagingGuilds: readonly Snowflake[];
  public readonly privateGuilds: readonly Snowflake[];
  private readonly superusers: Set<Snowflake>;
  private readonly activeSuperusers: Set<Snowflake>;
  private readonly logger: Logger;

  constructor ({ superusers, stagingGuilds, privateGuilds, logger }: CommanderClientOptions, clientOptions: ClientOptions) {
    super(clientOptions);

    this.superusers = new Set(superusers);
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
    return this.superusers.has(id);
  }

  /**
   * Enable super user for user
   * @param {Snowflake} id User ID
   */
  public enableSuperuser(id: Snowflake): void {
    if (!this.superusers.has(id)) {
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
    if (!this.superusers.has(id)) {
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
   * @param {Snowflake} id Guild ID
   * @returns {boolean} `true` or `false`
   */
  public isStagingGuild(id: Snowflake): boolean {
    return this.stagingGuilds.includes(id) || this.privateGuilds.includes(id);
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