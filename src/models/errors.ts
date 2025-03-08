export abstract class CommanderError extends Error {
  public abstract readonly code: string;
}

export class InvalidAppCommandError extends CommanderError {
  public readonly code = 'INVALID_APP_COMMAND';

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class CommandUpdateError extends CommanderError {
  public readonly code: string = 'COMMAND_UPDATE_ERROR';

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
