import winston from 'winston';
import env from '../config/env.js';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Standard log format for local development
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
    level: env.isDev ? 'debug' : 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        env.isProduction ? json() : combine(colorize(), consoleFormat)
    ),
    defaultMeta: { service: 'eduspace-api' },
    transports: [
        new winston.transports.Console()
    ],
});

// If we're not in development, write structured logs to files
if (!env.isDev) {
    logger.add(
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: json()
        })
    );
    logger.add(
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: json()
        })
    );
}

// Ensure unhandled exceptions and rejections are caught
logger.exceptions.handle(
    new winston.transports.Console({ format: combine(colorize(), consoleFormat) })
);

export default logger;
