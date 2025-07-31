// const log = require("./logger");

const NodeCache = require("node-cache");

// Initialize NodeCache for link codes with a default TTL of 5 minutes (300 seconds)
const linkCodeCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

function addLinkCode(code, userId) {
    linkCodeCache.set(code, { userId });
}

function getLinkCode(code) {
    return linkCodeCache.get(code);
}

function removeLinkCode(code) {
    linkCodeCache.del(code);
}

function hasLinkCode(code) {
    return linkCodeCache.has(code);
}

function clearCache() {
    linkCodeCache.flushAll();
}

module.exports = {
    addLinkCode,
    getLinkCode,
    removeLinkCode,
    hasLinkCode,
    clearCache,
};
