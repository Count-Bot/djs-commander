import ky from 'ky';
import { AppCommandType } from '../models/AppCommandShape.js';
import { CommandUpdateError, InvalidAppCommandError } from '../models/errors.js';
import { AppCommandRouter } from '../router/AppCommandRouter.js';

export interface AppCommandHandlerOptions {
  /**
   * The client ID of the Discord Application
   */
  clientId: string;
  /**
   * The token of the Discord Application
   */
  token: string;
}

/**
 * The AppCommandHandler class is used to handle commands for a Discord Application.
 * @template Args The arguments that the command function will take
 */
export class AppCommandHandler<Args extends unknown[]> {
  private readonly router: AppCommandRouter<Args>;
  private readonly clientId: string;
  private readonly token: string;

  /**
   * @param {AppCommandRouter<Args>} router The router to use for command routing
   * @param {AppCommandHandlerOptions} clientConfig
   */
  constructor(router: AppCommandRouter<Args>, clientConfig: AppCommandHandlerOptions) {
    this.router = router;
    this.clientId = clientConfig.clientId;
    this.token = clientConfig.token;
  }

  /**
   * Overwrite the commands for the Discord Application
   * @returns {Promise<void>}
   */
  public async overwriteCommands(): Promise<void> {
    try {
      await ky.put(`https://discord.com/api/v10/applications/${this.clientId}/commands`, {
        headers: { Authorization: `Bot ${this.token}` },
        json: this.router.commandData,
      });
    } catch (error) {
      throw new CommandUpdateError('Failed to overwrite commands:\n\t' + error);
    }
  }

  /**
   * Run a command
   * @param {string} commandName - The name of the command to run. This should be the name of the command as defined in the Discord API.
   * @param {AppCommandType} commandType - The type of the command to run. This should be the type of the command as defined in the Discord API.
   * @param args - The arguments to pass to the command function. Typically this will include an Interaction from Discord.
   */
  public async run(commandName: string, commandType: AppCommandType, ...args: Args): Promise<void> {
    const commandFn = this.router.get(commandName, commandType);

    if (!commandFn) {
      throw new InvalidAppCommandError(`Command ${commandName} does not exist.`);
    }

    await commandFn(...args);
  }
}
