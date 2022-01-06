import { Client, ClientOptions, Snowflake } from 'discord.js';
import { CommanderError } from '../error/index.js';
import { CommanderClientOptions } from '../typings/index.js';
import { logger } from '../logging/index.js';

export class CommanderClient extends Client {
	public readonly stagingGuilds: readonly Snowflake[];
	public readonly privateGuilds: readonly Snowflake[];
	private readonly superusers: Set<Snowflake>;
	private readonly activeSuperusers: Set<Snowflake>;

	constructor({ superusers, stagingGuilds, privateGuilds }: CommanderClientOptions, clientOptions: ClientOptions) {
		super(clientOptions);

		this.superusers = new Set(superusers);
		this.activeSuperusers = new Set();

		this.stagingGuilds = stagingGuilds;
		this.privateGuilds = privateGuilds;

		logger.info('CommanderClient initialised');
	}

	public enableSuperuser(id: Snowflake): void {
		if (!this.superusers.has(id)) {
			logger.warning(new CommanderError('NO_SUPERUSER', id));
			return;
		}

		this.activeSuperusers.add(id);

		logger.info(`Superuser with id '${id}' enabled`);
	}

	public disableSuperuser(id: Snowflake): void {
		if (!this.superusers.has(id)) {
			logger.warning(new CommanderError('NO_SUPERUSER', id));
			return;
		}

		this.activeSuperusers.delete(id);
		
		logger.info(`Superuser with id '${id}' disabled`);
	}
	
	public isActiveSuperuser(id: Snowflake): boolean {
		return this.activeSuperusers.has(id);
	}

	public isStagingGuild(id: Snowflake): boolean {
		return this.stagingGuilds.includes(id) || this.privateGuilds.includes(id);
	}

	public login(token?: string): Promise<string> | never {
		try {
			const res = super.login(token);

			logger.info('Client logged in');

			return res;
		} catch (err) {
			logger.fatal_error(err);

			throw err;
		}
	}
}