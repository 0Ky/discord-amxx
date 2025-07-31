const fs = require("fs");
const path = require("path");
const log = require("./loggerUtils");

const verifiedAccountsFilePath = path.join(__dirname, "../../data/verifiedAccounts.json");
let verifiedAccountsCache = [];

function loadVerifiedAccounts() {
    try {
        if (!fs.existsSync(verifiedAccountsFilePath)) {
            verifiedAccountsCache = [];
            return;
        }
        const data = fs.readFileSync(verifiedAccountsFilePath, "utf-8");
        verifiedAccountsCache = JSON.parse(data);
        log.info("Verified accounts loaded successfully.");
    } catch (error) {
        log.error(`Error loading verified accounts: ${error.message}`);
        verifiedAccountsCache = [];
    }
}

function saveVerifiedAccounts() {
    try {
        const dir = path.dirname(verifiedAccountsFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(verifiedAccountsFilePath, JSON.stringify(verifiedAccountsCache, null, 4), "utf-8");
    } catch (error) {
        log.error(`Error saving verified accounts: ${error.message}`);
    }
}

function getVerifiedAccounts() {
    return verifiedAccountsCache;
}

function addVerifiedAccount(account) {
    verifiedAccountsCache.push(account);
    saveVerifiedAccounts();
}

function isSteamIdVerified(steamId) {
    return verifiedAccountsCache.some((account) => account.steamId === steamId);
}

function isDiscordIdVerified(discordId) {
    return verifiedAccountsCache.some((account) => account.discordId === discordId);
}

// Load accounts at startup
loadVerifiedAccounts();

module.exports = {
    loadVerifiedAccounts,
    saveVerifiedAccounts,
    getVerifiedAccounts,
    addVerifiedAccount,
    isSteamIdVerified,
    isDiscordIdVerified,
};
