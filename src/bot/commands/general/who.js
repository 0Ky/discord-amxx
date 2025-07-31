const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require("discord.js");
const { getVerifiedAccounts } = require("../../../shared/verifiedAccountsManager");
const { HLDS_HOSTNAME } = require("../../../config/config");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("who")
    .setDescription("Replies with user information")
    .addUserOption((option) =>
      option.setName("mention").setDescription("The user to search for (mention)").setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("steamid").setDescription("The user to search for (Steam ID)").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  async execute(interaction) {
    const mention = interaction.options.getUser("mention");
    const steamid = interaction.options.getString("steamid");

    if (!mention && !steamid) {
      interaction.reply({
        content: "Please provide a search option mention or steamid.",
        flags: MessageFlags.Ephemeral,
      });
      interaction.client.interactions.delete(interaction.id);
      return;
    }

    const accounts = getVerifiedAccounts();
    let account;

    if (mention) {
      account = accounts.find((acc) => acc.discordId === mention.id);
    } else if (steamid) {
      account = accounts.find((acc) => acc.steamId === steamid);
    }

    if (account) {
      const embed = new EmbedBuilder()
        .setTitle("User Information")
        .setColor(0x0099ff)
        .addFields(
          { name: "Discord Username", value: account.discordUsername, inline: true },
          { name: "Steam ID", value: account.steamId, inline: true },
          { name: "Verified At", value: new Date(account.verifiedAt).toUTCString(), inline: false }
        )
        .setTimestamp()
        .setFooter({ text: `${HLDS_HOSTNAME}` });


      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply("User is not verified.");
    }
    interaction.client.interactions.delete(interaction.id);
  },
};
