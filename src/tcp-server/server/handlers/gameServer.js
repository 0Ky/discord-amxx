let gameServerSocket = null;

function setGameServerSocket(socket) {
  gameServerSocket = socket;
}

function getGameServerSocket() {
  return gameServerSocket;
}

function clearGameSocket() {
  gameServerSocket = null;
}

module.exports = {
  setGameServerSocket,
  getGameServerSocket,
  clearGameSocket
};
