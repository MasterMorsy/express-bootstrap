import { AppErrorResponseTypes, IFullAppErrorResponse } from ".";
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
      os: {
        platform: os.platform(),
        release: os.release(),
        type: os.type(),
      },
      environment: {
        nodeVersion: process.version,
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

export function handleAppError(error: any, req: Request, res: Response, next: NextFunction, errorHandler?: Function) {
  const status: number = error.status || 500;

  const bugTrackerErrorObject = createErrorResponse(error, req);
  if (errorHandler) errorHandler(bugTrackerErrorObject);

  console.log("bug tracker", bugTrackerErrorObject?.error);

  // Construct error response
  const errorResponse: AppErrorResponseTypes = {
    error: {
      message: error.message || "Internal Server Error",
      status: error.status || 500,
      stack: "",
    },
  };
  // Optionally, include additional error details in development environment
  if (process.env.NODE_ENV !== "production") {
    errorResponse.error.stack = error.stack;
  }

  // Global error handler for uncaught exceptions
  process.on("uncaughtException", (error) => {
    if (errorHandler) errorHandler(bugTrackerErrorObject);
    console.log("uncaughtException", error);
    process.exit(1);
  });
  // Global error handler for uncaught exceptions
  process.on("unhandledRejection", (error) => {
    if (errorHandler) errorHandler(bugTrackerErrorObject);
    console.log("unhandledRejection", error);
  });

  // Send error response to the client
  res.status(status).json(errorResponse);
}
