import { Dirent, readdirSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import ky from 'ky';
import { AppCommand } from '../models/AppCommand.js';
import { InvalidAppCommandError, InvalidHookPath } from '../models/errors.js';
import { Awaitable } from '../typings.js';
import { Router } from '../router/Router.js';
import { AppCommandType } from '../models/AppCommandShape.js';

export class AppCommandHandler<Args extends unknown[]> {
  private readonly router: Router<Args>;
  private readonly clientId: string;
  private readonly token: string;

  constructor(router: Router<Args>, { clientId, token }: { clientId: string, token: string; }) {
    this.router = router;
    this.clientId = clientId;
    this.token = token;
  }

  public async overwriteCommands(): Promise<void> {
    try {
      await ky.put(`https://discord.com/api/v10/applications/${this.clientId}/commands`, {
        headers: { 'Authorization': `Bot ${this.token}` },
        json: this.router.commandData,
      });
    } catch (error) {
      throw new Error('Failed to update Global Commands.');
    }
  }

  public async run(commandName: string, commandType: AppCommandType, ...args: Args): Promise<void> {
    const commandFn = this.router.get(commandName, commandType);

    if (!commandFn) {
      throw new InvalidAppCommandError(`Command ${commandName} does not exist.`, 'INVALID_COMMAND');
    }

    await commandFn(...args);
  }
}
