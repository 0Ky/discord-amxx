const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { MessageType } = require('../../../config/config');
const { sendMessageToGameServer } = require('../../../shared/discordMsgToGameServerUtils');
const gameServer = require('../../../tcp-server/server/handlers/gameServer');
const log = require('../../../shared/loggerUtils');

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("players")
    .setDescription("Show player scoreboard")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

  async execute(interaction) {
    const socket = gameServer.getGameServerSocket();

    if (!socket) {
      log.warn('Game server socket is not available');
      return await interaction.reply({
        content: 'Game server is unavailable. Try again later.',
        flags: MessageFlags.Ephemeral
      });
    }

    await interaction.deferReply(); // Allows a delayed response

    const message = {
      type: MessageType.MSG_SLASH,
      interactionid: interaction.id, // Still helpful for identifying requests
      command: 'players',
    };

    sendMessageToGameServer(socket, message);
    log.debug('Sent /players request to the game server');
  },
};
