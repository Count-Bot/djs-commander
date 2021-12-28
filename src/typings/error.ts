import { errors } from '../index.js';

export type Errors = typeof errors;

export type CommanderErrorCodes = ReturnType<Errors[keyof Errors]>['code'];

export interface CommanderErrorData {
	code: CommanderErrorCodes,
	message: string,
}