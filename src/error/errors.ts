import type { Snowflake } from 'discord.js';

export const errors = {
  NO_SUPERUSER: (userId: Snowflake) => ({
    code: 'P001' as const,
    message: `User with Discord ID '${userId}' is not a superuser.`,
  }),
  COMMAND_DOESNT_EXIST: (commandName: string) => ({
    code: 'C001' as const,
    message: `Command '${commandName}' doesn't exist.`,
  }),
  NOT_A_COMMAND: (path: string) => ({
    code: 'C002' as const,
    message: `Command at '${path}' is not a command.`,
  }),
};
