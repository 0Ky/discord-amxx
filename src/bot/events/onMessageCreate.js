const log = require('../../shared/loggerUtils');
const { sendMessageToGameServer } = require('../../shared/discordMsgToGameServerUtils');
const { DISCORD_CHANNEL_CHAT, MessageType } = require('../../config/config');
const gameServer = require('../../tcp-server/server/handlers/gameServer'); // Import gameServer singleton

// From Discord Chat to Game Server
module.exports = async (msg) => {
  if (msg.channel.id === DISCORD_CHANNEL_CHAT && !msg.author.bot) {
    log.debug(`Received message from Discord: ${msg.author.username}: ${msg.content}`);

    const message = {
      type: MessageType.MSG_CHAT,
      channel: msg.channel.name,
      displayname: msg.author.username,
      message: msg.content,
    };

    const socket = gameServer.getGameServerSocket(); // Get the game server socket from the singleton
    if (socket) {
      sendMessageToGameServer(socket, message); // Send message with the socket
    } else {
      log.warn('Game server socket is not available');
    }
  }
};
