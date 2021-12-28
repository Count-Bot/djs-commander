import { Client, ClientOptions, Snowflake } from 'discord.js';
import { CommanderError } from '../index.js';
import { CommanderClientOptions } from '../typings/client.js';
import { logger } from '../logging/index.js';

export class CommanderClient extends Client {
	private readonly superusers: Set<Snowflake>;
	private readonly activeSuperusers: Set<Snowflake>

	constructor({ superusers }: CommanderClientOptions, clientOptions: ClientOptions) {
		super(clientOptions);

		this.superusers = new Set(superusers);
		this.activeSuperusers = new Set();

		logger.info('CommanderClient initialised');
	}

	public enableSuperuser(id: Snowflake): void {
		if (!this.superusers.has(id)) {
			logger.error(new CommanderError('NO_SUPERUSER', id));
			return;
		}

		this.activeSuperusers.add(id);
		logger.info(`Superuser with id '${id}' enabled.`);
	}

	public disableSuperuser(id: Snowflake): void {
		if (!this.superusers.has(id)) {
			logger.error(new CommanderError('NO_SUPERUSER', id));
			return;
		}

		this.activeSuperusers.delete(id);
		logger.info(`Superuser with id '${id}' disabled.`);
	}

	public login(token?: string): Promise<string> | never {
		try {
			const res = super.login(token);

			logger.info('Client logged in.');

			return res;
		} catch (e) {
			logger.fatal_error(e);

			throw e;
		}
	}
}