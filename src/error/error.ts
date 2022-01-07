import { Errors } from '../typings/error.js';
import { BaseException } from './base.js';
import { errors } from './errors.js';

export class CommanderError<K extends keyof Errors> extends BaseException<Errors, K> {
	protected getErrorFunc(name: K): Errors[K] {
		return errors[name];
	}
}