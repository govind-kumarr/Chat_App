const { createLogger, transports, format, transport } = require("winston");
const path = require("path");

const logger = createLogger({
  levels: "info",
  format: format.combine(),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, "logs", "Info"),
      level: "info",
    }),
  ],
});

module.exports = { logger };
