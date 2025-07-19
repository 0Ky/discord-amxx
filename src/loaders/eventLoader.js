const onReady = require("../bot/events/onReady");
const onInteractionCreate = require("../bot/events/onInteractionCreate");
const onMessageCreate = require("../bot/events/onMessageCreate");
const discordUpdateMemberCount = require("../shared/discordUpdateMemberCount");

function loadEvents(client) {
  client.once("ready", onReady);
  client.on("interactionCreate", onInteractionCreate);
  client.on("messageCreate", onMessageCreate);
  client.on("guildMemberAdd", discordUpdateMemberCount);
  client.on("guildMemberRemove", discordUpdateMemberCount);
}

module.exports = { loadEvents };
