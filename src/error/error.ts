import { CommanderErrors } from '../typings/error.js';
import { BaseException } from './base.js';
import { errors } from './errors.js';

export class CommanderError<K extends keyof CommanderErrors> extends BaseException<CommanderErrors, K> {
	protected getErrorFunc(name: K): CommanderErrors[K] {
		return errors[name];
	}
}