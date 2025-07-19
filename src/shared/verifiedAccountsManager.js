const fs = require("fs");
const path = require("path");

const verifiedAccountsFilePath = path.join(__dirname, "../../data/verifiedAccounts.json");

function readVerifiedAccounts() {
    try {
        if (!fs.existsSync(verifiedAccountsFilePath)) {
            return [];
        }
        const data = fs.readFileSync(verifiedAccountsFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading verified accounts:", error.message);
        return [];
    }
}

function writeVerifiedAccounts(accounts) {
    try {
        const dir = path.dirname(verifiedAccountsFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(verifiedAccountsFilePath, JSON.stringify(accounts, null, 4), "utf-8");
    } catch (error) {
        console.error("Error writing verified accounts:", error.message);
    }
}

function addVerifiedAccount(account) {
    const accounts = readVerifiedAccounts();
    accounts.push(account);
    writeVerifiedAccounts(accounts);
}

function isSteamIdVerified(steamId) {
    const accounts = readVerifiedAccounts();
    return accounts.some((account) => account.steamId === steamId);
}

function isDiscordIdVerified(discordId) {
    const accounts = readVerifiedAccounts();
    return accounts.some((account) => account.discordId === discordId);
}

module.exports = {
    readVerifiedAccounts,
    writeVerifiedAccounts,
    addVerifiedAccount,
    isSteamIdVerified,
    isDiscordIdVerified,
};
