# Discord AMXX Bot

> [!WARNING]
> This project is currently in development and may not be stable.

A Node.js Discord bot built with [Discord.js](https://discord.js.org/) library that communicates with a Half-Life game server via a TCP socket interface using an AMXX plugin. The bot and plugin exchange JSON messages over a TCP connection to relay in-game chat to a Discord server and vice versa. Features include real-time player info updates, Discord slash commands, and linking Discord accounts to Steam IDs.

## Features

- **Discord to Game Server Communication:** Relay messages from Discord to the game server.
- **Member Count Display:** Update a channel to display the member count.
- **Translation:** Translates messages automatically on the fly.
- **Steam Avatar Display:** Display Steam avatars.
- **Country Code Utilities:** Utilities for handling country codes.
- **Link Code Manager:** Steam ID account verification.

## How It Works

The system operates on a client-server model:

1. The AMXX plugin acts as a TCP client, initiating a connection to the Discord bot.

2. The Discord bot runs a TCP server, listening for connections from the game server plugin.

3. Once connected and authenticated via a shared secret, both components relay information as JSON-formatted messages over the TCP socket.

## Setup and Installation

1. Setup Discord Bot:
   - Create a new bot on the [Discord Developer Portal](https://discord.com/developers/applications).
   - Copy the tokens and IDs that are required in your environment variables.
2. Clone the repository:
   ```bash
   git clone https://github.com/0ky/discord-amxx.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the setup script to configure your environment variables:
   ```bash
   npm run setup
   ```
5. Start the bot:
   ```bash
   npm run bot
   ```

## Discord Slash Commands

- `/link`: Link your Discord account to your Steam account
- `/ping`: Check if the bot is responsive
- `/players`: Show the current scoreboard from the game server
- `/who`: Display information about a verified user

## Environment Variables

The bot is configured using environment variables. You can set them in a `.env` file in the root of the project.

| Variable                      | Description                                                                 |
| ----------------------------- | --------------------------------------------------------------------------- |
| `PORT`                        | The port for the TCP server.                                                |
| `HOST`                        | The host for the TCP server.                                                |
| `DISCORD_TOKEN`               | Your Discord bot token.                                                     |
| `DISCORD_SERVER_ID`           | Your Discord server ID.                                                     |
| `DISCORD_CLIENT_ID`           | Your Discord client ID.                                                     |
| `DISCORD_CHANNEL_CHAT`        | The Discord channel ID for chat.                                            |
| `DISCORD_CHANNEL_CHATSUPPORT` | The Discord channel ID for team chat (support).                             |
| `DISCORD_CHANNEL_MEMBERS`     | The Discord channel ID for displaying server member count.                  |
| `DISCORD_CHANNEL_PLAYERS`     | The Discord channel ID for displaying game server player count              |
| `DISCORD_CHANNEL_TOPPLAYERS`  | The Discord channel ID for displaying player of the day.                    |
| `DISCORD_VERIFIED_ROLE`       | The Discord role ID for verified users that linked their steam account.     |
| `HLDS_HOSTNAME`               | The HLDS hostname.                                                          |
| `HLDS_MAXPLAYERS`             | The maximum number of players for the HLDS server.                          |
| `SHARED_SECRET`               | A shared secret used for handshake between the bot and the game server.     |

## License

This project is licensed under the No Warranty Public License. - see the [LICENSE.md](LICENSE.md) file for details.