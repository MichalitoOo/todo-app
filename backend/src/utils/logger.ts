import path from "path";
import { createLogger, format, transports } from "winston";

const logDirectory = path.resolve(__dirname, "../../../logs");

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDirectory, "error.log"), level: "error" }),
    new transports.File({ filename: path.join(logDirectory, "combined.log") }),
  ],
});

export default logger;
