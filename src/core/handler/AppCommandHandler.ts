import { Dirent, readdirSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import ky from 'ky';
import { AppCommand } from '../models/AppCommand.js';
import { InvalidAppCommandError, InvalidHookPath } from '../models/errors.js';
import { Awaitable } from '../util.js';

export enum MiddlewareEvent {
  BeforeCommand,
  AfterCommand,
}

export class AppCommandHandler {
  public readonly commands: Map<string, [string, AppCommand]>;
  private readonly clientId: string;
  private readonly token: string;
  private readonly hooks: Map<MiddlewareEvent, [string, () => Awaitable<unknown>][]>;

  constructor({ clientId, token }: { clientId: string, token: string; }) {
    this.commands = new Map();
    this.clientId = clientId;
    this.token = token;
    this.hooks = new Map();
  }

  public async load(directory: string): Promise<void> {
    const entries = readdirSync(directory, { withFileTypes: true });

    for (const dirent of entries) {
      await this.processEntry(directory, dirent);
    }

    if (this.commands.size < 1) {
      throw new InvalidAppCommandError(`No commands found in specified path ${directory}.`, 'NO_COMMANDS_FOUND');
    }
  }

  private async processEntry(directory: string, dirent: Dirent): Promise<void> {
    const path = `${directory}/${dirent.name}`;

    if (dirent.isDirectory()) {
      await this.load(path);
    } else if (dirent.name.endsWith('.js')) {
      await this.loadCommand(path);
    }
  }

  private async loadCommand(path: string): Promise<void> {
    const { default: command } = await import(join(import.meta.url.slice(0, process.cwd().length + 8), path));

    console.log('Command:', command);
    console.log('AppCommand:', AppCommand);
    console.log('Command prototype:', command.prototype instanceof AppCommand);
    console.log('AppCommand prototype:', AppCommand.prototype);
    // eslint-disable-next-line no-prototype-builtins
    console.log('Is prototype of:', AppCommand.prototype.isPrototypeOf(command.prototype));

    // eslint-disable-next-line no-prototype-builtins
    console.log(command);
    // eslint-disable-next-line no-prototype-builtins
    console.log(AppCommand.prototype.isPrototypeOf(command.prototype));

    if (!(command instanceof AppCommand)) {
      throw new InvalidAppCommandError(`Command at ${path} is not an instance of AppCommand.`, 'COMMAND_NOT_FOUND');
    }

    this.commands.set(command.name, [path, command]);
  }

  public async overwriteCommands(): Promise<void> {
    try {
      await ky.put(`https://discord.com/api/v10/applications/${this.clientId}/commands`, {
        headers: { 'Authorization': `Bot ${this.token}` },
      });

      console.log('Successfully updated Global Commands.');
    } catch (error) {
      console.error(error);
    }
  }

  public async addHook(event: MiddlewareEvent, path: string, callBack: () => void): Promise<void> {
    if (!this.hooks.has(event)) {
      this.hooks.set(event, []);
    }

    const dirent = await stat(path);

    if (!dirent.isDirectory() && !dirent.isFile()) {
      throw new InvalidHookPath(`Path ${path} is neither a file nor a directory.`, 'INVALID_PATH');
    }

    this.hooks.get(event)!.push([path, callBack]);
  }

  public async run(commandName: string, ...args: unknown[]): Promise<void> {
    this.validateCommand(commandName);

    const [commandPath, command] = this.getCommand(commandName);

    await this.executeHooks(commandPath, MiddlewareEvent.BeforeCommand);

    await command.run(args);

    await this.executeHooks(commandPath, MiddlewareEvent.AfterCommand);
  }

  private validateCommand(commandName: string): void {
    if (!this.commands.has(commandName)) {
      throw new InvalidAppCommandError('Command not found', 'COMMAND_NOT_FOUND');
    }
  }

  private getCommand(commandName: string): [string, AppCommand] {
    return this.commands.get(commandName)!;
  }

  private async executeHooks(commandPath: string, event: MiddlewareEvent): Promise<void> {
    if (this.hooks.has(event)) {
      for (const [path, callback] of this.hooks.get(event)!) {
        if (commandPath.startsWith(path)) {
          await callback();
        }
      }
    }
  }

}
