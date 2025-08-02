const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { DISCORD_TOKEN } = require("./config/config");
const { loadCommands } = require("./loaders/commandLoader");
const { loadEvents } = require("./loaders/eventLoader");
const { registerCommands, clearSlashCommands } = require("./bot/registerCommands");
const log = require("./utils/logger");
const { initializeDatabase } = require("./utils/database");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
  rest: {
    rejectOnRateLimit: (info) => {
      return info.route == "/channels/:id" && info.method == "PATCH";
    },
  },
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.interactions = new Collection();

(async () => {
  try {
    await initializeDatabase();
    loadCommands(client);
    loadEvents(client);
    // await clearSlashCommands();
    await registerCommands();
    await client.login(DISCORD_TOKEN);
  } catch (err) {
    log.error(`Error initializing application: ${err.message}`);
  }
})();
