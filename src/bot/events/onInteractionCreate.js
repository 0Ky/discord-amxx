const { Collection, MessageFlags} = require("discord.js");
const log = require("../../shared/loggerUtils");

module.exports = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    log.error(`Unknown command: '/${interaction.commandName}'`);
    await interaction.reply({ content: "Command not found!", flags: MessageFlags.Ephemeral });
    interaction.client.interactions.delete(interaction.id);  // Clean up interaction after replying
    return;
  }

  const { cooldowns } = interaction.client;

  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const defaultCooldownDuration = 3;
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);
      await interaction.reply({ content: `Please wait, you are on a cooldown for the \`/${command.data.name}\` command. You can use it again <t:${expiredTimestamp}:R>.`, flags: MessageFlags.Ephemeral });
      const timeLeft = expirationTime - now;
      setTimeout(() => {
        interaction.editReply({ content: `You can now use the \`/${command.data.name}\` command again.` });
        timestamps.delete(interaction.user.id)
      }, timeLeft);
      return;
    }
  }

  timestamps.set(interaction.user.id, now);

  try {
    log.debug(`User ${interaction.user.username} used '/${interaction.commandName}' (/) command`);
    interaction.client.interactions.set(interaction.id, interaction);
    await command.execute(interaction);
    // interaction.client.interactions.delete(interaction.id);
  } catch (error) {
    log.error(`Error executing command '/${interaction.commandName}': ${error.message}`);
    await interaction.reply({ content: "There was an error executing this command.", flags: MessageFlags.Ephemeral });
    interaction.client.interactions.delete(interaction.id);  // Clean up interaction after replying in case of error
  }
};
