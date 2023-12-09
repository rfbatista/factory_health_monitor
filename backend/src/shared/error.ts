import { Response } from "express";
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  HttpError,
  BadRequestError,
} from "routing-controllers";
import { Logger, LoggerToken } from "src/ports/infrastructure";
import { Inject, Service } from "typedi";

type AppErrorConfig = {
  cause?: Error;
  code?: string;
  httpCode?: number;
  details?: string;
};

export default class AppError extends Error {
  code: string | number;
  httpCode?: string | number;
  details?: string;
  timestamp: string;
  cause?: Error;
  constructor(message: string, config?: AppErrorConfig) {
    super(message);
    this.cause = config?.cause;
    this.code = config?.code || "INTERNAL_ERROR";
    this.httpCode = config?.httpCode || 400;
    this.details = config?.details || "";
    this.timestamp = new Date().toString();
  }
  toObject() {
    return {
      code: this?.code,
      message: this?.message,
      cause: this?.cause,
      stack: this?.stack,
    };
  }
}

@Middleware({ type: "after" })
@Service()
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  @Inject(LoggerToken)
  private log!: Logger;

  error(error: any, _: any, response: Response, __: (err: any) => any) {
    if (error instanceof BadRequestError) {
      response.status(error.httpCode);
      response.send({
        error: {
          name: error.name,
          message: error.message,
          errors: error["errors"],
        },
      });
    } else if (error instanceof HttpError) {
      response.status(error.httpCode);
      response.send({
        error: {
          name: error.name,
          message: error.message,
        },
      });
    } else {
      this.log.error("internal server error", error);
      response.status(500);
      response.send({
        error: {
          name: "INTERNAL_ERROR",
        },
      });
    }
  }
}
