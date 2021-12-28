import { Client, ClientOptions, Snowflake } from 'discord.js';
import { CommanderError } from '../index.js';
import { CommanderClientOptions } from '../typings/client.js';

export class CommanderClient extends Client {
	private readonly superusers: Set<Snowflake>;
	private readonly activeSuperusers: Set<Snowflake>

	constructor({ superusers }: CommanderClientOptions, clientOptions: ClientOptions) {
		super(clientOptions);

		this.superusers = new Set(superusers);
		this.activeSuperusers = new Set();
	}

	public enableSuperuser(id: Snowflake) {
		if (!this.superusers.has(id)) {
			throw new CommanderError('NO_SUPERUSER', id);
		}

		
	}
}