const log = require("../../../utils/loggerUtils");
const handleMessage = require("./handleMessage");
const gameServer = require("./gameServer");
const { HOST } = require("../../../config/config");

const clients = {};
let isConnectionActive = false;

function handleConnection(client) {
  const socket = gameServer.getGameServerSocket();
  const ip = socket.remoteAddress;

  if (isConnectionActive) {
    log.warn(`Rejected connection from ${ip}: A connection is already active.`);
    socket.destroy();
    return;
  }

  // Track failed attempts
  if (!clients[ip]) {
    clients[ip] = {
      failedAttempts: 0,
      lastAttempt: 0,
      isBlocked: false,
    };
  }

  const clientData = clients[ip];

  if (clientData.isBlocked) {
    const blockDuration = 5 * 60 * 1000; // 5 minutes
    if (Date.now() - clientData.lastAttempt < blockDuration) {
      log.warn(`Blocked IP ${ip} tried to connect. Connection dropped.`);
      socket.destroy();
      return;
    } else {
      clientData.isBlocked = false;
      clientData.failedAttempts = 0;
    }
  }

  socket.on("timeout", () => {
    log.warn(`Socket from ${ip} timed out.`);
    socket.destroy();
  });

  let authTimeout = setTimeout(() => {
    log.warn(`Authentication timeout for ${ip}`);
    socket.destroy();
  }, 30000);

  const addressInfo = socket.address();

  // uh, we need to set game server IP 
  if (addressInfo.address !== HOST) {
    log.error(`Rejected connection from: ${addressInfo.address}:${addressInfo.port}`);
    socket.destroy();
    return;
  }

  // log.info("Game server connection established");
  isConnectionActive = true;
  gameServer.setGameServerSocket(socket);
  socket.setEncoding("utf8");

  // Store client data and timeout on socket for access in handleMessage
  socket.clientData = clientData;
  socket.authTimeout = authTimeout;

  socket.on("data", (data) => handleMessage(data, client));

  socket.on("end", () => {
    clearTimeout(authTimeout);
    isConnectionActive = false;
    delete clients[ip];
    log.info("Game server connection ended");
    gameServer.setGameServerSocket(null);
  });

  socket.on("error", (err) => {
    clearTimeout(authTimeout);
    isConnectionActive = false;
    delete clients[ip];
    if (err.code === "ECONNRESET") {
      log.error("Game server connection lost");
    } else {
      log.error(`Game server socket error: ${err.message}`);
    }
    gameServer.setGameServerSocket(null);
  });

  socket.on("close", () => {
    clearTimeout(authTimeout);
    delete clients[ip];
  });
}

module.exports = { handleConnection };
