const { REST, Routes } = require("discord.js");
const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_SERVER_ID } = require("../config/config");
const { getCommandFiles } = require("../shared/discordCommandUtils");
const fs = require("node:fs");
const path = require("node:path");
const log = require("../shared/loggerUtils");
const assert = require("assert");

function compareOptions(commandOptions, existingCommandOptions) {
  try {
    // filter out undefined and false values from options,
    // this seems to be the same behavior when we get existing
    // commands from Discord through a get request ???
    const cleanOptions = (options) =>
      options
        ? options.map((option) =>
            Object.fromEntries(Object.entries(option).filter(([_, v]) => v !== undefined && v !== false))
          )
        : [];

    // Deep compare the cleaned options with the one already registered
    assert.deepStrictEqual(cleanOptions(commandOptions), cleanOptions(existingCommandOptions));
    return true;
  } catch {
    log.error("[Slash command] Options do not match");
    return false;
  }
}

async function registerCommands() {
  const commands = [];
  const commandsDir = path.join(__dirname, "/commands");
  const commandFiles = getCommandFiles(commandsDir);

  // Load all local commands
  for (const filePath of commandFiles) {
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
      // log.info(`Loaded command: ${command.data.name}`);
    } else {
      log.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }

  const rest = new REST().setToken(DISCORD_TOKEN);

  try {
    log.info("[Slash command] Fetching existing commands to compare...");
    const existingCommands = await rest.get(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_SERVER_ID));

    // Check for changes in number of commands
    const commandsChanged = commands.length !== existingCommands.length;
    if (commandsChanged) log.error("[Slash command] Discrepancy in the number of commands registered");

    // Check if command definitions differ
    const changesNeeded =
      commandsChanged ||
      commands.some((command) => {
        const matchingCommand = existingCommands.find((existingCommand) => existingCommand.name === command.name);

        // Command doesn't exist at all, needs registration
        if (!matchingCommand) {
          log.error(`[Slash command] Command '${command.name}' not found in the existing registered commands`);
          return true;
        }

        // Check if any properties differ
        const keysToCompare = ["name", "description", "dm_permission", "default_member_permissions"];

        // console.dir(command)
        // console.dir(matchingCommand)
        for (const key of keysToCompare) {
          if (command[key] !== matchingCommand[key]) {
            log.error(`[Slash command] Property '${key}' for command '${command.name}' does not match`);
            return true;
          }
        }

        // Use the compareOptions function to check if options match
        if (!compareOptions(command.options, matchingCommand.options)) return true;

        return false;
      });

    if (changesNeeded) {
      log.info(`Change detected. Registering ${commands.length} application (/) commands.`);

      const data = await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_SERVER_ID), {
        body: commands,
      });

      log.info(`Successfully registered ${data.length} application (/) commands.`);
    } else {
      log.info("No changes detected. Commands not re-registered.");
    }
  } catch (error) {
    log.error(`Failed to register commands: ${error.message}`);
  }
}

module.exports = registerCommands;
