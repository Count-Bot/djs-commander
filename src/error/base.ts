import { BaseExceptionData } from '../typings/error.js';

export abstract class BaseException<Errors extends { [K in string]: (...args: never[]) => BaseExceptionData }, K extends keyof Errors> extends Error {
  public readonly code: string;

  constructor (name: K, ...args: Parameters<Errors[K]>) {
    super();
    const data = this.getErrorFunc(name)(...args);

    this.message = data.message;
    this.name = `CommanderError [${String(name)}] (${data.code})`;
    this.code = data.code;


    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  protected abstract getErrorFunc(name: K): Errors[K];
}