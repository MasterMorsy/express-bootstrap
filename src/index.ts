require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import { handleAppError } from "./lib/handleAppError";
import appCors from "./lib/corsHandler";
import helmet from "helmet";
import { IBootstrapOptions, IStaticFolder } from "./lib";
import connectDBs from "./lib/mongooseConnector";
import compression from "compression";

const app = express();

function bootstrap(options: IBootstrapOptions) {
  connectDBs(options.db);

  // Request Body Middlewares
  app.use(express.json(options.urlencoded ?? {}));
  app.use(express.urlencoded(options.urlencoded ?? {}));
  app.use(compression(options.compression ?? {}));
  // Custom Morgan format string with icons
  const customFormat = options.loggerFormat ?? ":remote-addr 🔗 :method ➡️ :url :status :status-color ⏱️ :response-time ms";
  // Use Morgan middleware with custom format
  app.use(logger(customFormat));
  // Define custom token for status color
  logger.token("status-color", (_: Request, res: Response) => {
    const statusCode = res.statusCode;
    if (statusCode === 401) {
      return "🟡"; // Yellow icon for 401 status code
    } else if (statusCode >= 500) {
      return "🔴"; // Red icon for 5xx status codes
    } else if (statusCode > 401 && statusCode < 500) {
      return "🟠"; // Orange icon for status codes greater than 401 but less than 500
    } else {
      return "✅"; // Green icon for successful status codes
    }
  });

  app.use((req: Request, res: Response, next: NextFunction) => appCors(req, res, next, options.cors));
  if (options.helmet && options.helmet.active) app.use(helmet(options.helmet.options ?? {}));

  if (options.staticFolders?.length) {
    options.staticFolders.map((staticFolder: IStaticFolder) => {
      app.use(staticFolder.path, express.static(staticFolder.folder));
    });
  }

  // routes
  options.routes.map((route: any) => app.use(route));

  // Error handling middleware
  app.use(handleAppError);

  // Server configuration
  const port = Number(options?.port ?? 9000);
  const host = "127.0.0.1";

  app.listen(port, host, () => {
    console.log(`SERVER: ${options.name ?? ""} Service run on ${host}:${port}`);
  });
}

module.exports = bootstrap;
