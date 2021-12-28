import { Snowflake } from 'discord.js';

export const errors = {
	'NO_SUPERUSER': (id: Snowflake) => { return { code: 'IP001', message: `User with id '${id}' is not a superuser.` }; },
};