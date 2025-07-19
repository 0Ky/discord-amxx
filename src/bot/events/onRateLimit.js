const log = require("../../shared/loggerUtils");

module.exports = (rateLimitData) => {
  log.warn(`A rate limit was hit: ${JSON.stringify(rateLimitData)}`);
};