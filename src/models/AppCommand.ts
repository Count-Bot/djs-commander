import { AppCommandShape } from './AppCommandShape.js';
import { Awaitable } from '../typings.js';

export abstract class AppCommand<R = void> {
  private readonly shape: AppCommandShape;

  constructor({
    shape,
  }: AppCommandParams) {
    this.shape = shape;
  }

  public get name(): string {
    return this.shape.name;
  }

  public abstract run(...args: unknown[]): Awaitable<R>;
}

export interface AppCommandParams {
  shape: AppCommandShape;
}
