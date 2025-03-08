import { AppCommandShape, AppCommandType } from '../models/AppCommandShape.js';
import { CommandFn } from '../typings.js';

/**
 * The AppCommandRouter class is used to register and route commands for AppCommandHandler.
 * @template Args The arguments that the command function will take
 */
export class AppCommandRouter<Args extends unknown[]> {
  private readonly _commands: [AppCommandShape, CommandFn<Args>][] = [];

  /**
   * Get all command data
   * @returns {readonly AppCommandShape[]}
   */
  public get commandData(): readonly AppCommandShape[] {
    return this._commands.map(command => command[0]);
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
   * Merge another Router into this Router
   * @param {AppCommandRouter} router The router to merge into this router
   * @returns {void}
   */
  public merge(router: AppCommandRouter<Args>): void {
    this._commands.push(...router._commands);
  }

  /**
   * Get a command by name and type
   * @param {string} commandName
   * @param {AppCommandType} commandType
   *
   * @returns CommandHandler | null
   */
  public get(commandName: string, commandType: AppCommandType): CommandFn<Args> | null {
    const command = this._commands.find(
      ([commandData]) => commandData.name === commandName && commandData.type === commandType,
    );

    return command?.[1] ?? null;
  }
}
