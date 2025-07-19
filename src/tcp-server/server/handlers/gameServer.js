let gameServerSocket = null;

function setGameServerSocket(socket) {
  gameServerSocket = socket;
}

function getGameServerSocket() {
  return gameServerSocket;
}

module.exports = {
  setGameServerSocket,
  getGameServerSocket,
};
