const { EmbedBuilder, escapeMarkdown } = require("discord.js");
const SteamID = require("steamid");
const { getCountryCode } = require("./countryCodes");
const { getSteamAvatar } = require("./steamAvatars");
const { getUserColor } = require("./colorManager");
const { HLDS_HOSTNAME } = require("../config/config");

async function formatChatMessage(parsed, translated) {
  const { translatedText, originalLanguage } = translated;
  const messageToSend = translatedText === parsed.message ? parsed.message : translatedText;

  const steamID64 = new SteamID(parsed.authid).getSteamID64();
  const steamProfile = `https://steamcommunity.com/profiles/${steamID64}`;
  const steamAvatar = await getSteamAvatar(steamID64);

  parsed.message = parsed.message.replace(/\`\`\`/g, "   ");
  const countryCode = getCountryCode(originalLanguage);
  const flag = countryCode ? `:flag_${countryCode}` : `(${originalLanguage})`;

  let descriptionText = "";
  if (originalLanguage === "en" || messageToSend === parsed.message) {
    descriptionText = `\`\`\`\n${parsed.message}\n\`\`\``;
  } else {
    descriptionText = `**Translated :flag_us:**\n\`\`\`\n${messageToSend}\n\`\`\`\n**Original ${flag}:**\n\`\`\`\n${parsed.message}\n\`\`\``;
  }

  const color = getUserColor(steamID64);

  return new EmbedBuilder()
    .setColor(color)
    .setTitle(escapeMarkdown(parsed.name))
    .setURL(steamProfile)
    .setDescription(descriptionText)
    .setFooter({ text: `${HLDS_HOSTNAME}  •  ${parsed.authid}`, iconURL: steamAvatar })
    .setTimestamp();
}

module.exports = { formatChatMessage };
