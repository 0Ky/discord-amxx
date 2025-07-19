import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { input } from '@inquirer/prompts';

function generateSecret(length = 32) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const randomBytes = crypto.randomBytes(length);

  const secret = Array.from(randomBytes)
    .map(byte => charset[byte % charset.length])
    .join('');

  return secret;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '.env');

const main = async () => {
  try {
    const answers = {
      PORT: await input({ message: 'Enter the port for the TCP server:', default: '57412' }),
      HOST: await input({ message: 'Enter the host for the TCP server:', default: '127.0.0.1' }),
      DISCORD_TOKEN: await input({ message: 'Enter your Discord bot token:' }),
      DISCORD_SERVER_ID: await input({ message: 'Enter your Discord server ID:' }),
      DISCORD_CLIENT_ID: await input({ message: 'Enter your Discord client ID:' }),
      DISCORD_CHANNEL_CHAT: await input({ message: 'Enter the Discord channel ID for chat:' }),
      DISCORD_CHANNEL_CHATSUPPORT: await input({ message: 'Enter the Discord channel ID for chat support:' }),
      DISCORD_CHANNEL_MEMBERS: await input({ message: 'Enter the Discord channel ID for members:' }),
      DISCORD_CHANNEL_PLAYERS: await input({ message: 'Enter the Discord channel ID for players:' }),
      DISCORD_CHANNEL_TOPPLAYERS: await input({ message: 'Enter the Discord channel ID for top players:' }),
      DISCORD_VERIFIED_ROLE: await input({ message: 'Enter the Discord role ID for verified users:' }),
      HLDS_HOSTNAME: await input({ message: 'Enter the HLDS hostname:' }),
      HLDS_MAXPLAYERS: await input({ message: 'Enter the maximum number of players for the HLDS server:' }),
      SHARED_SECRET: await input({
        message: 'Enter the shared secret (leave empty to generate a random one):',
        default: generateSecret()
      }),
    };

    const envContent = Object.entries(answers)
      .map(([key, value]) => `${key}="${value}"`)
      .join('\n');

    fs.writeFileSync(envPath, envContent);
    fs.chmodSync(envPath, 0o600); // rw-------

    console.log('.env file created successfully.');
  } catch (error) {
    console.error('Error creating .env file:', error);
  }
};

main();
