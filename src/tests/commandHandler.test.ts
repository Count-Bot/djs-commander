import assert from 'node:assert';
import { describe, it } from 'node:test';

import { Loggage } from '@countbot/loggage';
import { GatewayIntentBits } from 'discord.js';

import { CommanderClient } from '../client/commanderClient.js';
import { CommandHandler } from '../commands/commandHandler.js';

describe('Test Command Handler', () => {
  it('can get command data', () => {
    const loggage = new Loggage({ name: 'My Loggage Test', save: false });
    const client = new CommanderClient(
      {
        logger: loggage,
        privateGuilds: ['1234'],
        stagingGuilds: ['1234'],
        superUsers: ['1234'],
      },
      { intents: [GatewayIntentBits.Guilds] },
    );

    const handler = new CommandHandler({
      client,
      logger: loggage,
      callbacks: {
        onNoSuperuser(): void {
          console.log('No Superuser');
        },
        onNoStaging(): void {
          console.log('No Staging');
        },
        onCommandError(): void {
          console.log('Command error');
        },
      },
    });

    assert.equal(handler.getCommandData('release').length, 0);
  });
});
