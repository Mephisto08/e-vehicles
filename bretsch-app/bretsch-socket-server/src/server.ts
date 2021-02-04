// tslint:disable-next-line: no-var-requires
require("dotenv-safe").config();
import * as bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import { Logger } from "./util/logger.util";

const logger: Logger = new Logger(path.basename(__filename));
const port: number = Number(process.env.SERVER_PORT);

/**
 * Main method to start the server.
 */
export const run = async () => {
  try {
    const app = express();

    app.use(morgan("combined"));
    app.use(bodyParser.json());
    //app.use('/api', );
    app.get("/socket", (_, res) => {
      res.send("Socket");
    });

    app.listen(port, () => {
      logger.log(`Server is now listening at http://localhost:${port}`);
    });
  } catch (error) {
    logger.log(`${error}`);
  }
};

// tslint:disable-next-line: no-floating-promises
run();
