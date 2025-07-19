const { EmbedBuilder } = require("discord.js");
const crypto = require("crypto");
const { keccak256 } = require("js-sha3");
const NodeCache = require("node-cache");
const log = require("../../../shared/loggerUtils");
const {
  MessageType,
  HOST,
  SHARED_SECRET,
  DISCORD_CHANNEL_CHAT,
  DISCORD_CHANNEL_CHATSUPPORT,
  HLDS_HOSTNAME,
  DISCORD_CHANNEL_PLAYERS,
  DISCORD_CHANNEL_TOPPLAYERS,
  DISCORD_VERIFIED_ROLE,
  HLDS_MAXPLAYERS,
  DISCORD_SERVER_ID,
} = require("../../../config/config");
const { fullwidthToASCII } = require('../../../shared/fullwidthToASCIIUtils');
const { translateMessage } = require("../../../shared/translateUtils");
const { formatChatMessage } = require("../../../shared/formatChatMessage");
const { sendMessageToGameServer } = require("../../../shared/discordMsgToGameServerUtils");
const { updateChannelName } = require("../../../shared/updateChannelName");
const { getLinkCode, removeLinkCode } = require("../../../shared/linkCodeManager");
const { addVerifiedAccount, isSteamIdVerified } = require("../../../shared/verifiedAccountsManager");

const { validate: validateUUID } = require('uuid');
const gameServer = require("./gameServer"); // Import gameServer singleton

let maxPlayers = HLDS_MAXPLAYERS || "0";
let playersNum = "0";
const avatarCache = new NodeCache({ stdTTL: 21600, checkperiod: 3600 }); // 6 hours TTL, checks every 60 minutes

async function handleMessage(data, client, socket) {
  try {
    const message = data.toString().trim();
    log.debug(`Received raw data: ${message}`);

    let parsed;
    try {
      parsed = JSON.parse(message);
    } catch {
      log.error("Received data is not valid JSON. Ignoring message");
      return;
    }

    switch (parsed.type) {
      case MessageType.MSG_HANDSHAKE: {
        const ip = socket.remoteAddress;

        if (parsed.status === "HANDSHAKE_HELLO") {
          clearTimeout(socket.authTimeout);
          socket.authTimeout = setTimeout(() => {
            log.warn(`Authentication timeout for ${ip}`);
            socket.destroy();
          }, 30000);

          const challenge = crypto.randomBytes(32).toString("hex");
          socket.challenge = challenge;

          const challengeMessage = {
            type: MessageType.MSG_HANDSHAKE,
            status: "HANDSHAKE_CHALLENGE",
            challenge: challenge
          };

          sendMessageToGameServer(socket, challengeMessage);
          log.info(`Sent handshake challenge to ${ip}: ${challenge}`);

        } else if (parsed.status === "HANDSHAKE_CHALLENGE") {
          clearTimeout(socket.authTimeout);
          socket.authTimeout = setTimeout(() => {
            log.warn(`Authentication timeout for ${ip}`);
            socket.destroy();
          }, 30000);

          const expectedHash = keccak256(socket.challenge + SHARED_SECRET);

          if (parsed.challenge === expectedHash) {
            log.info(`Client ${ip} authenticated handshake successfully.`);
            clearTimeout(socket.authTimeout);
            socket.clientData.failedAttempts = 0;
            socket.isAuthenticated = true;

            // Send success response
            sendMessageToGameServer(socket, {
              type: MessageType.MSG_HANDSHAKE,
              status: "HANDSHAKE_OK",
            });

            log.info("Game server connection established");
            // gameServer.setGameServerSocket(socket);
            // socket.setEncoding("utf8");

          } else {
            log.warn(`Failed handshake authentication attempt from ${ip}`);
            sendMessageToGameServer(socket, {
              type: MessageType.MSG_HANDSHAKE,
              status: "HANDSHAKE_REJECT",
            });

            socket.clientData.failedAttempts++;
            socket.clientData.lastAttempt = Date.now();

            if (socket.clientData.failedAttempts >= 5) {
              log.warn(`Blocking IP ${ip} due to too many failed attempts.`);
              socket.clientData.isBlocked = true;
            }

            socket.end();
          }
        }
        break;
      }

      case MessageType.MSG_CHAT: {

        parsed.name = fullwidthToASCII(parsed.name).replace(/\`\`\`/g, "   ");
        parsed.message = fullwidthToASCII(parsed.message);
        const translated = await translateMessage(parsed.message);
        const formattedChatEmbed = await formatChatMessage(parsed, translated);

        const channel = await client.channels.cache.get(
          parsed.mode === "team"
            ? DISCORD_CHANNEL_CHATSUPPORT
            : parsed.mode === "global"
            ? DISCORD_CHANNEL_CHAT
            : DISCORD_CHANNEL_CHATSUPPORT // any other
        );
        
        
        if (channel) {
          await channel.send({ embeds: [formattedChatEmbed] });
          log.debug(`Relayed in-game message to Discord`);
        } else {
          log.warn("Channel not found");
        }
        
        break;

      }

      case MessageType.MSG_SLASH: {
        const interaction = await client.interactions.get(parsed.interactionid);

        if (!interaction) {
          log.warn(`Interaction with ID ${parsed.interactionid} not found`);
          return;
        }

        switch (parsed.command) {
          case "players": {
            parsed.players.forEach((player) => {
              player.name = fullwidthToASCII(player.name).replace(/\`\`\`/g, "");
            });

            // const players = parsed.players;
            const players = parsed.players.sort((a, b) => b.score - a.score || a.deaths - b.deaths);

            let maxNameLength = 4, maxScoreLength = 5, maxDeathsLength = 6, maxPingLength = 4;

            players.forEach((player) => {
              maxNameLength = Math.max(maxNameLength, player.name.length);
              maxScoreLength = Math.max(maxScoreLength, player.score.toString().length);
              maxDeathsLength = Math.max(maxDeathsLength, player.deaths.toString().length);
              maxPingLength = Math.max(maxPingLength, player.ping.toString().length);
            });

            const nameHeaderPadding = " ".repeat(maxNameLength - 3);
            const scoreHeaderPadding = " ".repeat(maxScoreLength - 4);
            const deathsHeaderPadding = " ".repeat(maxDeathsLength - 5);

            const header = `\u001b[4;2m𝗡𝗮𝗺𝗲\u001b[0m${nameHeaderPadding}\u001b[4;2m𝗦𝗰𝗼𝗿𝗲\u001b[0m${scoreHeaderPadding}\u001b[4;2m𝗗𝗲𝗮𝘁𝗵𝘀\u001b[0m${deathsHeaderPadding}\u001b[4;2m𝗣𝗶𝗻𝗴\u001b[0m\n`;

            let playerData = "```ansi\n" + header;
            players.forEach((player) => {
              const namePadding = " ".repeat(maxNameLength - player.name.length);
              const scorePadding = " ".repeat(maxScoreLength - player.score.toString().length);
              const deathsPadding = " ".repeat(maxDeathsLength - player.deaths.toString().length - 1);
              const spaceBetweenNameAndScore = 2;
              const spaceBetweenScoreAndDeaths = 1;

              const thinSpace = "\u2009";

              playerData +=
                `\u001b[0;32m${player.name}${thinSpace}${namePadding}\u001b[0;0m${" ".repeat(spaceBetweenNameAndScore)}` +
                `\u001b[0;33m${player.score}${scorePadding}\u001b[0;0m${" ".repeat(spaceBetweenScoreAndDeaths)}` +
                `${player.deaths}${deathsPadding}${player.ping}\u001b[0;0m\n`;
            });

            if (players.length === 0) {
              const noPlayersMessage = "No players are currently online.";
              const totalLength = maxNameLength + maxScoreLength + maxDeathsLength + maxPingLength + 10;
              const centeredMessage = noPlayersMessage.padStart(Math.floor(totalLength / 2) + noPlayersMessage.length / 2, " ");
              playerData += `\u001b[0;31m${centeredMessage}\u001b[0;0m\n`;
            }

            playerData += "```";

            const embed = new EmbedBuilder()
              .setTitle("Scoreboard")
              .setColor(0x20aa20)
              .setDescription(playerData)
              .setTimestamp()
              .setFooter({
                text: `${HLDS_HOSTNAME}  •  Players ${players.length}/${maxPlayers}`,
              });

            await interaction.editReply({ embeds: [embed] });
            log.debug("Updated the /players response");
            client.interactions.delete(parsed.interactionid);
            break;
          }
          default:
            log.warn(`Unhandled command: ${parsed.command}`);
            break;
        }
        break;
      }

      case MessageType.MSG_LINK: {
        const channel = await client.channels.cache.get(DISCORD_CHANNEL_CHATSUPPORT);

        if (!channel) {
          log.error("Channel not found");
          return;
        }






        const code = parsed.message;
        if (validateUUID(code)) {
          const linkCode = getLinkCode(code);
          if (linkCode) {
            const { userId } = linkCode;
            const steamId = parsed.authid;
            if (isSteamIdVerified(steamId)) {
              log.warn(`Steam ID ${steamId} is already linked to a Discord account.`);
              return;
            }
            try {
              const guild = client.guilds.cache.get(DISCORD_SERVER_ID);
              const member = await guild.members.cache.get(userId);
              if (member) {
                await member.roles.add(DISCORD_VERIFIED_ROLE);

                // Add the verified account with additional metadata
                addVerifiedAccount({
                  discordId: userId,
                  discordUsername: member.user.tag, // e.g., "User#1234"
                  steamId,
                  verifiedAt: new Date().toString(), // Timestamp
                });
                removeLinkCode(code); // Remove the used code

                // await member.send("Your Steam account has been successfully linked to your Discord account!");
                await channel.send(`:link: User <@${member.user.id}> successfully linked \`${steamId}\` steam account.`);

                const socket = gameServer.getGameServerSocket();
                if (socket) {
                  sendMessageToGameServer(socket, {
                    type: MessageType.MSG_LINK,
                    authid: steamId,
                    message: `Steam ID ${steamId} successfully linked with Discord user ${member.user.tag}.`,
                  });
                }
              }
            } catch (error) {
              log.error(`Error linking Steam ID ${steamId} with Discord user ${userId}: ${error.message}`);
            }
          } else {
            log.warn(`Invalid or expired verification code: ${code}`);
          }
        }
        else {
          log.error("Code not valid.")
        }
        break;
      }

      case MessageType.MSG_SLOTINFO: {
        maxPlayers = parsed.maxplayers;
        playersNum = parsed.playersnum;

        try {
          let channel = client.channels.cache.get(DISCORD_CHANNEL_PLAYERS);

          if (!channel) {
            log.warn("Channel not found in cache, attempting to fetch.");
            channel = await client.channels.fetch(DISCORD_CHANNEL_PLAYERS).catch((error) => {
              log.error(`Failed to fetch channel: ${error.message}`);
              return null;
            });
          }

          if (channel) {
            const newName = `Players: ${playersNum}/${maxPlayers}`;
            try {
              await updateChannelName(channel, newName);
            } catch (error) {
              log.error(`Failed to queue channel name update: ${error.message}`);
            }
          } else {
            log.error("Channel not found.");
          }
        } catch (error) {
          log.error(`Unexpected error in MSG_SLOTINFO handling: ${error.message}`);
        }
        break;
      }
    }
  } catch (err) {
    log.error(`Error processing data: ${err.message}`);
  }
}

module.exports = handleMessage;
