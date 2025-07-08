import winston from "winston";


const {combine, timestamp, printf, colorize, errors, json} = winston.format;

const customFormat = printf(({level, message, timestamp, stack, ...meta}) => {
    let logMessage = `${timestamp} ${level}: ${stack || message}`;

    if (Object.keys(meta).length) {
        logMessage += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return logMessage;
});

export const logger = winston.createLogger({
    level: "info",
    format: combine(
        colorize(),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        errors({stack: true}),
        customFormat
    ),
    transports: [
        new winston.transports.Console({}),
        // Save errors to a file
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({filename: 'logs/combined.log'})
    ]
});