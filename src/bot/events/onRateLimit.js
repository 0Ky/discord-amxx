const log = require("../../utils/logger");

module.exports = (rateLimitData) => {
  log.warn(`A rate limit was hit: ${JSON.stringify(rateLimitData)}`);
};