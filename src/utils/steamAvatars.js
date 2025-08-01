const NodeCache = require('node-cache');
const { XMLParser } = require('fast-xml-parser');
const log = require('./logger');

const avatarCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

async function getSteamAvatar(steamID64) {
  const cachedAvatar = avatarCache.get(steamID64);
  if (cachedAvatar) {
    return cachedAvatar;
  }

  const steamProfile = `https://steamcommunity.com/profiles/${steamID64}`;
  const defaultAvatar = "https://avatars.fastly.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";

  try {
    const profileRes = await fetch(steamProfile + "?xml=1");
    if (!profileRes.ok) {
      throw new Error(`HTTP ${profileRes.status} - ${profileRes.statusText}`);
    }

    const xmlData = await profileRes.text();
    const parser = new XMLParser();
    let steamAvatar = parser.parse(xmlData).profile.avatarFull;

    // Validate the avatar URL
    const avatarRes = await fetch(steamAvatar, { method: 'HEAD' });
    if (!avatarRes.ok) {
      steamAvatar = defaultAvatar;
    }

    // Cache and return the avatar
    avatarCache.set(steamID64, steamAvatar);
    return steamAvatar;
  } catch (err) {
    log.error(`Error fetching Steam avatar for ${steamID64}: ${err.message}`);
    return defaultAvatar;
  }
}

module.exports = { getSteamAvatar };