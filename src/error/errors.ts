import { Snowflake } from 'discord.js';

export const errors = {
	'NO_SUPERUSER': (id: Snowflake) => { return { 
		code: 'P001' as const, 
		message: `User with id '${id}' is not a superuser.` 
	}; },
	'COMMAND_DOESNT_EXIST': (commandName: string) => { return {
		code: 'C001' as const,
		message: `Command '${commandName}' doesn't exist.`
	}; },
	'NOT_A_COMMAND': (path: string) => { return {
		code: 'C002' as const,
		message: `Command at '${path}' is not a command.`
	}; },
};

