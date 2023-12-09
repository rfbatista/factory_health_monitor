import Container, { Token } from "typedi";
import { LoggerImpl } from "../infrastructure/logger";

export const LoggerToken = new Token("Logger");
Container.set(LoggerToken, Container.get<Logger>(LoggerImpl));
export interface Logger {
  info(message: string, data?: unknown): void;
  error(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
}
