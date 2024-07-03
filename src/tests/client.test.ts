import { GatewayIntentBits } from 'discord.js';
import assert from 'node:assert';
import { describe, it } from 'node:test';

import { Loggage } from '@countbot/loggage';

import { CommanderClient } from '../client/commanderClient.js';

describe('Test Client', () => {
  it('can check if user is a super user', () => {
    const loggage = new Loggage({ name: 'My Loggage Test', save: false });
    const client = new CommanderClient({ logger: loggage, privateGuilds: ['1234'], stagingGuilds: ['1234'], superUsers: ['1234'] }, { intents: [GatewayIntentBits.Guilds] });

    assert.equal(client.isSuperuser('1234'), true);
    assert.equal(client.isStagingGuild('1234'), true);
    assert.equal(client.isPrivateGuild('1234'), true);
  });
});