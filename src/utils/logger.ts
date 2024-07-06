import winston, { format, transports } from "winston";

export const LOGGER = winston.createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [new transports.Console(), new transports.File({ filename: process.env.NODE_ENV + '.log' })],
});
