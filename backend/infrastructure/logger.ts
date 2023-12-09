import { Service } from "typedi";
import { Logger } from "../ports/infrastructure";

@Service()
export class LoggerImpl implements Logger {
  warn(message: string, data: unknown): void {
    console.log("[WARN] " + message, data);
  }
  info(message: string, data: unknown) {
    console.log("[INFO] " + message, data);
  }
  error(message: string, data: unknown) {
    console.error("[ERROR] " + message, data);
  }
}
