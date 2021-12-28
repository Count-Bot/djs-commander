import { CommanderErrorCodes, CommanderErrorData } from '../typings/error.js';
import { errors } from './errors.js';
import { registerError } from './register_error.js';

export class CommanderError<E extends keyof (typeof errors) = keyof (typeof errors)> extends Error {
	public readonly code: CommanderErrorCodes;

	constructor(name: E, ...args: Parameters<typeof errors[E]>) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data = (errors[name] as (...args: any[]) => CommanderErrorData)(...args);
		super(data.message);
		this.name = `CommanderError [${name}] (${data.code})`;
		this.code = data.code;
		
		if (Error.captureStackTrace) Error.captureStackTrace(this, CommanderError);

		registerError(this);
	}
}