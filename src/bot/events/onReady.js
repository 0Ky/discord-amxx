const log = require("../../utils/logger");
const { startTCPServer } = require("../../tcp-server/server/tcpServer");
const discordUpdateMemberCount = require('../../utils/discordUpdateMemberCount');

module.exports = (client) => {
  client.user.setActivity("✨ !help for a list of commands!", { type: 4 });
  client.user.setStatus("online");

  log.info(`Discord bot is online as '${client.user.tag}'`);

  startTCPServer(client);

  discordUpdateMemberCount(client);
};