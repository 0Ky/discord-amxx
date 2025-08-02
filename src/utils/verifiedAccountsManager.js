const { getDb } = require("./database");
const log = require("./logger");

const MAX_CACHE_SIZE = 1000;

// Cache structures
const discordCache = new Map(); // discordId -> account
const indexBySteam = new Map(); // steamId -> discordId
const order = [];               // FIFO eviction queue (discordId)

function evictLRU() {
    while (discordCache.size > MAX_CACHE_SIZE) {
        const oldestDiscordId = order.shift();
        if (!oldestDiscordId) break;

        const oldestAccount = discordCache.get(oldestDiscordId);
        if (oldestAccount) {
            discordCache.delete(oldestDiscordId);
            indexBySteam.delete(oldestAccount.steamId);
        }
    }
}

function addAccountToCache(account) {
    const { discordId, steamId } = account;

    if (discordCache.has(discordId)) {
        const index = order.indexOf(discordId);
        if (index !== -1) order.splice(index, 1);
    }

    discordCache.set(discordId, account);
    indexBySteam.set(steamId, discordId);
    order.push(discordId);

    evictLRU();
}

async function fetchAccount({ key, value }) {
    // check the cache first
    let cached;
    if (key === "discordId") {
        cached = discordCache.get(value);
    } else if (key === "steamId") {
        const discordId = indexBySteam.get(value);
        if (discordId) {
            cached = discordCache.get(discordId);
        }
    }

    if (cached) return cached;

    const db = getDb();
    if (!db) return;

    try {
        const account = await db.get(`SELECT * FROM verified_accounts WHERE ${key} = ?`, value);
        if (account) addAccountToCache(account);
        return account;
    } catch (error) {
        log.error(`Error fetching verified account by ${key}: ${error.message}`);
    }
}

async function addVerifiedAccount(account) {
    const db = getDb();
    if (!db) return;

    try {
        const stmt = await db.prepare("INSERT INTO verified_accounts (discordId, steamId, discordUsername, verifiedAt) VALUES (?, ?, ?, ?)");
        await stmt.run(account.discordId, account.steamId, account.discordUsername, account.verifiedAt);
        await stmt.finalize();

        addAccountToCache(account);

        log.info(`Added verified account for ${account.discordUsername} (${account.discordId}) to database and cache.`);
    } catch (error) {
        log.error(`Error adding verified account: ${error.message}`);
    }
}

function deleteAccountByDiscordId(discordId) {
  const account = discordCache.get(discordId);
  if (!account) return false;

  discordCache.delete(discordId);
  indexBySteam.delete(account.steamId);
  indexByDiscord.delete(discordId);

  const idx = order.indexOf(discordId);
  if (idx !== -1) order.splice(idx, 1);

  return true;
}

module.exports = {
    fetchAccount,
    addVerifiedAccount
};