import { AppErrorResponseTypes, IFullAppErrorResponse } from "./";
import { Response, Request, NextFunction } from "express";
import os from "os";

function createErrorResponse(error: any, req?: Request) {
  // Construct full error response for bug trackers
  const fullErrorResponse: IFullAppErrorResponse = {
    error: {
      message: error.message || error,
      status: error.status || 500,
      stack: error.stack,
      date: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        os: {
          platform: os.platform(),
          release: os.release(),
          type: os.type(),
        },
        env: process.env.NODE_ENV ?? "Development",
      },
      request: req
        ? {
            url: req.url,
            method: req.method,
            headers: req.headers,
            body: req.body,
          }
        : undefined,
    },
  };

  return fullErrorResponse;
}

// Global error handler for uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.log("uncaughtException", error);
  process.exit(1);
});

// Global error handler for unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
  console.log("unhandledRejection", reason);
});

export function handleAppError(error: any, req: Request, res: Response, next: NextFunction, errorHandler?: Function) {
  const status: number = error.status || 500;

  const bugTrackerErrorObject = createErrorResponse(error, req);
  if (errorHandler) errorHandler(bugTrackerErrorObject);

  // Construct error response
  const errorResponse: AppErrorResponseTypes = {
    error: {
      message: error.message || "Internal Server Error",
      status: error.status || 500,
      stack: "",
    },
  };
  // Optionally, include additional error details in development environment
  if (process.env.NODE_ENV === "development") {
    errorResponse.error.stack = error.stack;
  }

  // Send error response to the client
  res.status(status).json(errorResponse);
}
