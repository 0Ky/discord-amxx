const { Client } = require("discord.js");
const { DISCORD_SERVER_ID, DISCORD_CHANNEL_MEMBERS } = require("../config/config");
const log = require("./loggerUtils");
const { updateChannelName } = require("./updateChannelName");

module.exports = async (clientOrMember) => {
  try {
    const client = clientOrMember.client || clientOrMember;
    const guild = client.guilds.cache.get(DISCORD_SERVER_ID);
    if (!guild) {
      log.error("Discord server not found!");
      return;
    }

    const memberCount = guild.members.cache.filter((m) => !m.user.bot).size;
    const channel = guild.channels.cache.get(DISCORD_CHANNEL_MEMBERS);
    if (!channel) {
      log.error("Members count channel not found!");
      return;
    }

    const newChannelName = `Members: ${memberCount}`;

    // If clientOrMember is an instance of Client, we are in the onReady event
    if (clientOrMember instanceof Client) {
      // This is the first time the bot is ready (not a member event)
      await updateChannelName(channel, newChannelName);
    } else {
      await updateChannelName(channel, newChannelName);
      log.debug(`Updated channel name to '${newChannelName}'`);
    }
  } catch (error) {
    log.error("Error updating channel name:", error);
  }
};
