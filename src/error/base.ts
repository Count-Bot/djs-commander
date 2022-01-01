import { BaseExceptionData } from '../typings/error.js';
import { readFileSync, writeFile } from 'fs';

export abstract class BaseException<Errors extends { [K in string]: (...args: never[]) => BaseExceptionData }, K extends keyof Errors> extends Error {
	private static readonly errorLogData: Record<string, number> = JSON.parse(readFileSync('./logs/errors.json', 'utf8'));

	public readonly code: string;

	constructor(name: K, ...args: Parameters<Errors[K]>) {
		super();
		const data = this.getErrorFunc(name)(...args);
		this.message = data.message;
		this.name = `CommanderError [${name}] (${data.code})`;
		this.code = data.code;
		
		if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);

		this.register();
	}

	private register(): void {
		BaseException.errorLogData[this.code] ??= 0;
		BaseException.errorLogData[this.code]++;

		writeFile(
			'./logs/errors.json', 
			JSON.stringify(BaseException.errorLogData), 
			(err) => { if (err) throw err;}
		);
	}

	protected abstract getErrorFunc(name: K): Errors[K];
}