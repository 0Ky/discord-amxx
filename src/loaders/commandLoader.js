const { Collection } = require("discord.js");
const path = require("node:path");
const { getCommandFiles } = require("../shared/discordCommandUtils");
const log = require("../shared/loggerUtils");

function loadCommands(client) {
  const commandsDir = path.join(__dirname, "../bot/commands");
  const commandFiles = getCommandFiles(commandsDir);
  log.info(`Loading '${commandFiles.length}' (/) command(s)`);

  for (const filePath of commandFiles) {
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      log.debug(`Loaded command: ${command.data.name}`);
    } else {
      log.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

module.exports = { loadCommands };
