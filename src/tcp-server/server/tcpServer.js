const net = require("net");
const log = require("../../utils/loggerUtils");
const { HOST, PORT } = require("../../config/config");
const { handleConnection } = require("./handlers/handleConnection");
const gameServer = require("./handlers/gameServer");

const startTCPServer = (client) => {
  const server = net.createServer((socket) => {
    gameServer.setGameServerSocket(socket);
    handleConnection(client);
  });

  server.listen(PORT, HOST, () => {
    log.info(`TCP server listening on ${HOST}:${PORT}`);
  });

  server.on("error", (err) => {
    log.error(`Error in TCP server: ${err.message}`);
  });
};

module.exports = { startTCPServer };
