const log = require("../../utils/loggerUtils");

module.exports = (rateLimitData) => {
  log.warn(`A rate limit was hit: ${JSON.stringify(rateLimitData)}`);
};