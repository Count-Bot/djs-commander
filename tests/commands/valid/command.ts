import { AppCommand, AppCommandParams } from '../../../src/core/models/AppCommand.js';
import { AppCommandType } from '../../../src/core/models/AppCommandShape.js';

export class MyCommand extends AppCommand {
  constructor({ shape }: AppCommandParams) {
    super({ shape });
  }

  run() {

  }
}

export default new MyCommand({ shape: { name: 'my-command', description: 'My description', type: AppCommandType.ChatInput } });
