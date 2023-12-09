import "reflect-metadata";
import express, { Request, Response } from "express";
import { getMachineHealth } from "./machineHealth";
import Container from "typedi";
import { Logger, LoggerToken } from "./ports/infrastructure";
import { createExpressServer, useContainer } from "routing-controllers";
import "./shared/error";
import "./shared/result"
import path from "path";
import bodyParser from "body-parser";
useContainer(Container);
const app = createExpressServer({
  classTransformer: true,
  routePrefix: "/api",
  controllers: [path.join(__dirname, "controllers/*.ts")],
  defaultErrorHandler: false,
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
