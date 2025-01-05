import assert from 'assert';
import { describe, it } from 'node:test';
import { AppCommandHandler } from '../src/core/handler/AppCommandHandler.js';
import { InvalidAppCommandError } from '../src/core/models/errors.js';

describe('AppCommandHandler', () => {
  const handler = new AppCommandHandler({ clientId: '123', token: 'abc' });

  it('should load zero commands and fail', async () => {
    const path = 'build/tests/commands/invalid';

    try {
      await handler.load(path);
    } catch (e) {
      console.log(e);
      assert.strictEqual(e instanceof InvalidAppCommandError, true);
      assert.strictEqual(handler.commands.size < 1, true);
    }
  });

  it('should load one command', async () => {
    const path = 'build/tests/commands/valid';

    await handler.load(path);

    assert.strictEqual(handler.commands.size, 1);
  });
});
