import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Logger, LoggerToken } from "src/ports/infrastructure";
import { Inject, Service } from "typedi";

@Middleware({ type: "before" })
@Service()
export class RequestLoggerMiddleware implements ExpressMiddlewareInterface {
  @Inject(LoggerToken)
  log: Logger;

  use = (req: any, res: any, next: (error?: any) => void) => {
    const { ip, method, originalUrl: url } = req;
    const userAgent = req.get("user-agent") || "";
    res.on("close", () => {
      const { statusCode } = res;
      const contentLength = res.get("content-length");
      process.env.NODE_ENV !== "local" &&
        this.log.info(`${method} ${url} ${statusCode}`);
    });
    next();
  };
}
