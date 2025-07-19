const net = require("net");
const log = require("../../shared/loggerUtils");
const { HOST, PORT } = require("../../config/config");
const { handleConnection } = require("./handlers/handleConnection");

const startTCPServer = (client) => {
  const server = net.createServer((socket) => handleConnection(socket, client));

  server.listen(PORT, HOST, () => {
    log.info(`TCP server listening on ${HOST}:${PORT}`);
  });

  server.on("error", (err) => {
    log.error(`Error in TCP server: ${err.message}`);
  });
};

module.exports = { startTCPServer };
