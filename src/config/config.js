require('dotenv').config();

const MessageType = Object.freeze({
  MSG_INVALID: 0,
  MSG_HANDSHAKE: 1,
  MSG_CHAT: 2,
  MSG_SLASH: 3,
  MSG_LINK: 4,
  MSG_SLOTINFO: 5,
});

const MessageTypeNames = Object.fromEntries(
  Object.entries(MessageType).map(([key, value]) => [value, key])
);

const requiredEnvVars = [
  'DISCORD_TOKEN',
  'DISCORD_SERVER_ID',
  'DISCORD_CLIENT_ID',
  'DISCORD_CHANNEL_CHAT',
  'DISCORD_CHANNEL_CHATSUPPORT',
  'DISCORD_CHANNEL_MEMBERS',
  'DISCORD_CHANNEL_PLAYERS',
  'DISCORD_CHANNEL_TOPPLAYERS',
  'DISCORD_VERIFIED_ROLE',
  'HLDS_HOSTNAME',
  'HLDS_MAXPLAYERS',
  'SHARED_SECRET',
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

const envConfig = Object.fromEntries(
  requiredEnvVars.map((key) => [key, process.env[key]])
);

envConfig.PORT = process.env.PORT || 57412;
envConfig.HOST = process.env.HOST || '127.0.0.1';

envConfig.MessageType = MessageType;
envConfig.MessageTypeNames = MessageTypeNames;

module.exports = envConfig;
