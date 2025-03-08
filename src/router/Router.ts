import { AppCommandShape, AppCommandType } from '../models/AppCommandShape.js';
import { CommandFn } from '../typings.js';

export class Router<Args extends unknown[]> {
  private readonly _commands: [AppCommandShape, CommandFn<Args>][] = [];

  /**
   * TODO: JAREN
   */
  public get commandData(): readonly AppCommandShape[] {
    return this._commands.map(([commandData, _]) => commandData);
  }

  /**
   * Register a command
   * @param {AppCommandShape} commandData  
   * @param {CommandFn} command 
   * @returns {void}
   */
  public command(commandData: AppCommandShape, command: CommandFn<Args>): void {
    this._commands.push([commandData, command]);
  }

  /**
   * Get a command by name and type
   * @param {string} commandName
   * @param {AppCommandType} commandType
   * 
   * @returns CommandHandler | null
   */
  public get(commandName: string, commandType: AppCommandType): CommandFn<Args> | null {
    const command = this._commands.find(([commandData]) => commandData.name === commandName && commandData.type === commandType);

    return command?.[1] ?? null;
  }
}
