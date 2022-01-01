import { errors } from '../index.js';

export type CommanderErrors = typeof errors;

export interface BaseExceptionData {
	code: string,
	message: string,
}