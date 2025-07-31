const log = require('./loggerUtils');
const { MessageTypeNames } = require('../config/config');
const gameServer = require('../tcp-server/server/handlers/gameServer');

// Send Message From Discord to Game Server
function sendMessageToGameServer(message) {
  const socket = gameServer.getGameServerSocket();
  if (!socket) {
    log.warn('Attempted to send message, but no socket is connected');
    return;
  }

  try {
    const formattedMessage = `${JSON.stringify(message)}\0`;
    socket.write(formattedMessage);
    log.debug(`Message type '${MessageTypeNames[message.type]}' sent`);
  } catch (err) {
    log.error(`Failed to send message: ${err.message}`);
  }
}

module.exports = { sendMessageToGameServer };
