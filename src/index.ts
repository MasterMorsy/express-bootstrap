require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import { handleAppError } from "./lib/handleAppError";
import appCors from "./lib/corsHandler";
import helmet from "helmet";
import { IBootstrapOptions, IStaticFolder } from "./lib";
import connectDBs from "./lib/mongooseConnector";
import compression from "compression";
import globalRoutesHandler from "./lib/globalRoutesHandler";

const app = express();

async function bootstrap(options: IBootstrapOptions) {
  // Disable the X-Powered-By header
  app.disable("x-powered-by");

  app.use(express.json(options.urlencoded ?? {}));
  app.use(express.urlencoded(options.urlencoded ?? {}));
  app.use(compression(options.compression ?? {}));
  if (options.helmet && options.helmet.active) app.use(helmet(options.helmet.options ?? {}));

  // Custom Morgan format string with icons
  const customFormat = options.loggerFormat ?? ":remote-addr 🔗 :method ➡️ :url :status :status-color ⏱️ :response-time ms";
  // Define custom token for status color
  logger.token("status-color", (_, res) => {
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
  // Use Morgan middleware with custom format
  app.use(
    logger(customFormat, {
      skip: (req) => req.method === "OPTIONS",
    })
  );

  await connectDBs(options.db);

  app.use((req: Request, res: Response, next: NextFunction) => appCors(req, res, next, options.cors, options.staticFolders, options.poweredBy));

  if (options.staticFolders?.length) {
    options.staticFolders.map((staticFolder: IStaticFolder) => {
      app.use(staticFolder.path, express.static(staticFolder.folder));
    });
  }

  // routes
  if (options.routes?.length) {
    options.routes.map((route) => app.use(globalRoutesHandler(route?._router)));
  }

  if (options.routesPath?.length) {
    options.routesPath.forEach((routeConfig) => {
      // If middleware exists, apply it
      if (routeConfig.middleware) {
        app.use(routeConfig.path, routeConfig.middleware, globalRoutesHandler(routeConfig.routes)); // Directly pass `routes`
      } else {
        // No middleware, just use the routes
        app.use(routeConfig.path, globalRoutesHandler(routeConfig.routes)); // Directly pass `routes`
      }
    });
  }

  // Error handling middleware
  app.use((error: any, req: Request, res: Response, next: NextFunction) => handleAppError(error, req, res, next, options.errorsHandler));

  // Server configuration
  const port = Number(options?.port ?? 9000);
  const host = options.host;

  if (host) {
    app.listen(port, host, () => {
      console.log(`SERVER: ${options.name ?? ""} Service run on ${host}:${port}`);
    });
  } else {
    app.listen(port, () => {
      console.log(`SERVER: ${options.name ?? ""} Service run on ${host}:${port}`);
    });
  }
}
// CommonJS export
module.exports = bootstrap;
// ES Module export
module.exports.default = bootstrap;
