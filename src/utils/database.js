const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const fs = require("fs").promises;
const log = require("./logger");

const dbFilePath = path.join(__dirname, "../../data/database.sqlite");

let db;

async function openDb() {
    return open({
        filename: dbFilePath,
        driver: sqlite3.Database,
    });
}

async function initializeDatabase() {
    try {
        const dir = path.dirname(dbFilePath);
        try {
            await fs.access(dir);
        } catch (error) {
            await fs.mkdir(dir, { recursive: true });
        }

        db = await openDb();
        await db.exec(`
            CREATE TABLE IF NOT EXISTS verified_accounts (
                discordId TEXT PRIMARY KEY,
                steamId TEXT NOT NULL UNIQUE,
                discordUsername TEXT,
                verifiedAt TEXT
            );
        `);

        log.info("Database initialized successfully.");

    } catch (error) {
        log.error(`Error initializing database: ${error.message}`);
    }
}

function getDb() {
    try {
        if (!db) {
            throw new Error("Database not initialized.");
        }
        return db;
    } catch (error) {
        log.error(`Error getting database instance: ${error.message}`);
        return;
    }
}

module.exports = {
    initializeDatabase,
    getDb,
};
