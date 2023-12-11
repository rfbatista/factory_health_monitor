import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import "reflect-metadata";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import Container from "typedi";
import { RequestLoggerMiddleware } from "./infrastructure/requestMiddleware";
import { getMachineHealth } from "./machineHealth";
import { Logger, LoggerToken } from "./ports/infrastructure";
import "./shared/error";
import { CustomErrorHandler } from "./shared/error";
import "./shared/result";
import { AuthorizateUserUseCaseImpl } from "./usecases/AuthorizateUserUseCaseImpl";

useContainer(Container);

const authorization = Container.get(AuthorizateUserUseCaseImpl);
const app = createExpressServer({
  classTransformer: true,
  routePrefix: "/api",
  controllers: [path.join(__dirname, "controllers/*.ts")],
  middlewares: [RequestLoggerMiddleware, CustomErrorHandler],
  defaultErrorHandler: false,
  authorizationChecker: async (action: Action) => {
    const token = action.request.headers["authorization"];
    if (!token) return false;
    const accessToken = token.split(" ")[1];
    const result = await authorization.execute({
      accessToken,
    });
    if (result.isFailure) return false;
    return true;
  },
});
const port = 3001;

app.use(express.json());
/* app.use(bodyParser.urlencoded()) */

// Endpoint to get machine health score
app.post("/machine-health", (req: Request, res: Response) => {
  const result = getMachineHealth(req);
  if (result.error) {
    res.status(400).json(result);
  } else {
    res.json(result);
  }
});

app.listen(port, () => {
  const log = Container.get<Logger>(LoggerToken);
  log.info(`API is listening at http://localhost:${port}`);
});
