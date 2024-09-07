import { AppErrorResponseTypes } from "..";
import { Response, Request, NextFunction } from "express";

export function handleAppError(error: any, req: Request, res: Response, next: NextFunction) {
  // Log the error for debugging purposes
  console.error(error);

  // Set default error status to 500 (Internal Server Error)
  const status: number = error.status || 500;

  // Construct error response
  const errorResponse: AppErrorResponseTypes = {
    error: {
      message: error.message || "Internal Server Error",
      status: status,
      stack: "",
    },
  };

  // Optionally, include additional error details in development environment
  if (process.env.NODE_ENV === "development") {
    errorResponse.error.stack = error.stack;
    // Include additional properties from the error object if needed
  }

  // Global error handler for uncaught exceptions
  process.on("uncaughtException", (error: Error) => {
    console.log("uncaughtException", error);
    process.exit(1);
  });

  // Global error handler for unhandled promise rejections
  process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
    console.log("unhandledRejection", reason);
  });

  // Send error response to the client
  res.status(status).json(errorResponse);
}
