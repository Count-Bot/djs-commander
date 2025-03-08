# Discord Commander

A lightweight, type-safe command framework for Discord bots that works with any Node.js Discord library.

## Features

- Framework-agnostic: Compatible with discord.js, Eris, and other Discord libraries
- Type-safe: Built with TypeScript for reliable code completion and error prevention
- Easy command registration and routing
- Support for slash commands with options
- Simple API for managing and updating application commands

## Installation

```bash
npm install discord-commander
# or
yarn add discord-commander
# or
pnpm add discord-commander
```

## Quick Start

```typescript
import { Router, AppCommandHandler, AppCommandType } from 'discord-commander';

// Create a new command router
const router = new Router();

// Register a simple slash command
router.command(
  {
    type: AppCommandType.ChatInput,
    name: 'ping',
    description: 'Replies with pong!'
  },
  async (interaction) => {
    // Handle the command with your preferred Discord library
    await interaction.reply('Pong!');
  }
);

// Initialize the command handler with your bot credentials
const handler = new AppCommandHandler(router, {
  clientId: 'YOUR_CLIENT_ID',
  token: 'YOUR_BOT_TOKEN'
});

// Register all commands with Discord API
await handler.overwriteCommands();

// In your bot's interaction handler:
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  await handler.run(
    interaction.commandName,
    AppCommandType.ChatInput,
    interaction
  );
});
```

## Creating Commands

### Basic Slash Command

```typescript
router.command(
  {
    type: AppCommandType.ChatInput,
    name: 'hello',
    description: 'Greets the user'
  },
  async (interaction) => {
    await interaction.reply(`Hello, ${interaction.user.username}!`);
  }
);
```

### Command with Options

```typescript
router.command(
  {
    type: AppCommandType.ChatInput,
    name: 'echo',
    description: 'Repeats your message',
    options: [
      {
        type: AppCommandOptionType.String,
        name: 'message',
        description: 'The message to repeat'
      }
    ]
  },
  async (interaction) => {
    const message = interaction.options.getString('message');
    await interaction.reply(message || 'You didn\'t provide a message!');
  }
);
```

## Advanced Usage

### Using with Discord.js

```typescript
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { Router, AppCommandHandler, AppCommandType } from 'discord-commander';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const router = new Router();

// Register commands...

const handler = new AppCommandHandler(router, {
  clientId: process.env.CLIENT_ID,
  token: process.env.TOKEN
});

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await handler.overwriteCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  await handler.run(
    interaction.commandName, 
    AppCommandType.ChatInput, 
    interaction
  );
});

client.login(process.env.TOKEN);
```

### Creating Command Classes

For more complex commands, you can use the `AppCommand` class:

```typescript
import { AppCommand, AppCommandType, AppCommandOptionType } from 'discord-commander';

class PingCommand extends AppCommand {
  constructor() {
    super({
      shape: {
        type: AppCommandType.ChatInput,
        name: 'ping',
        description: 'Replies with pong!'
      }
    });
  }

  async run(interaction) {
    await interaction.reply('Pong!');
  }
}

// Register the command
const pingCommand = new PingCommand();
router.command(pingCommand.shape, pingCommand.run.bind(pingCommand));
```

## License

MIT
