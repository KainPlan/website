const winston = require('winston');
const path = require('path');

exports.logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
  ),
  transports: [
    new winston.transports.File({
      filename: path.resolve(__dirname, '..', 'server.log'),
      level: 'error',
    }),
  ],
});