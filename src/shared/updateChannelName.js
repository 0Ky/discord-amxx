const log = require("./loggerUtils");
const { RateLimitError } = require('discord.js');

// A map to hold queues for channels
const channelNameUpdateQueue = new Map();

async function updateChannelName(channel, newName) {
  const channelId = channel.id;

  // Check if there's an existing queue for this channel
  if (channelNameUpdateQueue.has(channelId)) {
    // Update the queued name for this channel
    const queue = channelNameUpdateQueue.get(channelId);
    log.warn(
      `Rate limit pending for channel ${channelId}. Replacing queued name with "${newName}".`
    );
    queue.latestName = newName;
    return;
  }

  // Initialize a queue for this channel
  const queue = {
    latestName: newName,
    timeout: null,
  };
  channelNameUpdateQueue.set(channelId, queue);

  log.debug(`Queuing name update for channel ${channelId}: "${newName}".`);

  // Process the queue
  await processQueue(channelId, channel);
}

async function processQueue(channelId, channel) {
  const queue = channelNameUpdateQueue.get(channelId);

  if (!queue) return;

  try {
    // Attempt to set the channel name
    await channel.setName(queue.latestName);
    log.debug(`Channel name updated successfully: ${queue.latestName}`);

    // Clear the queue after success
    channelNameUpdateQueue.delete(channelId);
  } catch (error) {
    if (error instanceof RateLimitError) {
      const retryAfter = error.retryAfter;
      log.warn(`Rate limit hit for channel ${channelId}. Retrying after ${Math.floor(retryAfter / 60000)}m ${Math.floor((retryAfter % 60000) / 1000)}s.`);
      // Schedule a retry for the latest name in the queue
      queue.timeout = setTimeout(() => {
        processQueue(channelId, channel).catch((err) =>
          log.error(`Failed to retry channel name update: ${err.message}`)
        );
      }, retryAfter);
    } else {
      log.error(`Error updating channel name: ${error.message}`);
      // Clear the queue on other errors
      channelNameUpdateQueue.delete(channelId);
    }
  }
}

module.exports = {
  updateChannelName,
};
