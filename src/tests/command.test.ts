import assert from 'node:assert';
import { describe, it } from 'node:test';

import { Loggage } from '@countbot/loggage';
import { GatewayIntentBits } from 'discord.js';

import { CommanderClient } from '../client/commanderClient.js';
import { Command } from '../commands/command.js';
import { CommandMode, PermissionResponse } from '../typings/commands.js';

describe('Test Command', () => {
  it('can get user permissions', () => {
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

    const command = new Command({
      category: 'Test',
      ephemeral: true,
      mode: CommandMode.RELEASE,
      superUserOnly: false,
      data: {
        name: 'test',
        description: 'Test command description',
      },
      execute: () => {
        console.log('Test');
      },
    });

    const privateCommand = new Command({
      category: 'Test',
      ephemeral: true,
      mode: CommandMode.PRIVATE,
      superUserOnly: true,
      data: {
        name: 'test',
        description: 'Test command description',
      },
      execute: () => {
        console.log('Test');
      },
    });

    client.enableSuperUser('1234');

    assert.equal(privateCommand.getPermission({ userId: '1234' }, client), PermissionResponse.ALLOWED);
    assert.equal(command.getPermission({ userId: '1234' }, client), PermissionResponse.ALLOWED);
    assert.equal(command.getPermission({ userId: '1234', guildId: '123a4' }, client), PermissionResponse.ALLOWED);
    assert.equal(
      privateCommand.getPermission(
        {
          userId: '123a4',
          guildId: '123a4',
        },
        client,
      ),
      PermissionResponse.NO_SUPERUSER,
    );
  });
});
