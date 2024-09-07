require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import { handleAppError } from "@helpers/handleAppError";
import appCors from "@helpers/corsHandler";
import helmet from "helmet";
import { IBootstrapOptions, IStaticFolder } from "./types";
import connectDBs from "@helpers/mongooseConnector";

const app = express();

export default function bootstrap(options: IBootstrapOptions) {
  connectDBs({ dbName: options.db.dbName });

  app.use(express.json());

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
  if (options.helmet && options.helmet.active) app.use(helmet(options.helmet.options));

  if (options.staticFolders?.length) {
    options.staticFolders.map((staticFolder: IStaticFolder) => {
      app.use(staticFolder.path, express.static(staticFolder.folder));
    });
  }

  // routes
  app.use(options.routes);
  // Error handling middleware
  app.use(handleAppError);

  // Server configuration
  const port = Number(options?.port ?? 9000);
  const host = "127.0.0.1";

  app.listen(port, host, () => {
    console.log(`SERVER: ${options.name ?? ""} Service run on ${host}:${port}`);
  });
}
