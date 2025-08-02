const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const log = require("../../../utils/logger");
const { v4: uuidv4 } = require("uuid");
const linkCodeManager = require("../../../utils/linkCodeManager");
const { fetchAccount } = require("../../../utils/verifiedAccountsManager");

module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder()
    .setName("link")
    .setDescription("Generates a code to verify and link your Steam account through in-game")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  async execute(interaction) {
    const isLinked = !!await fetchAccount({ key: "discordId", value: interaction.user.id });

    if (isLinked) {
      return await interaction.reply({
        content: "Your account is already linked.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const code = uuidv4(); // Shortened for simplicity
    linkCodeManager.addLinkCode(code, interaction.user.id);

    await interaction.reply({
      content: `To link your Steam account, follow these steps:\n1. Open the in-game console by pressing the tilde key (~).\n2. Enter the following \`verify\` command with the provided verification code:\n\`\`\`properties\nverify ${code}\n\`\`\`\n-# (The verification code expires in 5 minutes)\n`,
      flags: MessageFlags.Ephemeral,
    });

    log.debug(`Generated link code ${code} for user ${interaction.user.tag} <${interaction.user.id}>`);
  },
};
