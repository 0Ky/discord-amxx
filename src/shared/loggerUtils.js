const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const printFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    format.colorize({ all: true }),
    timestamp({ format: 'h:mm:ss a - D/M/YYYY' }),
    printFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'bot.log' }),
  ],
});

module.exports = {
  info: logger.info.bind(logger),
  error: logger.error.bind(logger),
  warn: logger.warn.bind(logger),
  debug: logger.debug.bind(logger),
};
