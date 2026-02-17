/**
 * Custom error classes for the UPSC Practice Platform
 * Provides structured error handling with appropriate HTTP status codes
 */

/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation Error (400)
 * Used when request data fails validation
 */
export class ValidationError extends AppError {
  public readonly fields?: Record<string, string>;

  constructor(message: string, fields?: Record<string, string>) {
    super(message, 400);
    this.fields = fields;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Authentication Error (401)
 * Used when user is not authenticated
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization Error (403)
 * Used when user doesn't have permission
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Not Found Error (404)
 * Used when a resource is not found
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Business Logic Error (422)
 * Used when business rules are violated
 */
export class BusinessLogicError extends AppError {
  constructor(message: string) {
    super(message, 422);
    Object.setPrototypeOf(this, BusinessLogicError.prototype);
  }
}

/**
 * Database Error (500)
 * Used when database operations fail
 */
export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(message, 500, false);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * File Upload Error (400)
 * Used when file upload fails validation
 */
export class FileUploadError extends AppError {
  constructor(message: string) {
    super(message, 400);
    Object.setPrototypeOf(this, FileUploadError.prototype);
  }
}

/**
 * Rate Limit Error (429)
 * Used when rate limit is exceeded
 */
export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

// ============================================================================
// Error Response Types
// ============================================================================

export interface ErrorResponse {
  error: string;
  statusCode: number;
  timestamp: string;
  fields?: Record<string, string>;
}

// ============================================================================
// Error Handler for API Routes
// ============================================================================

/**
 * Global error handler for API routes
 * Converts errors to appropriate HTTP responses
 * @param error - Error object
 * @returns Response object with error details
 */
export function handleAPIError(error: unknown): Response {
  // Log the error for debugging
  logError(error);

  // Handle known application errors
  if (error instanceof AppError) {
    const response: ErrorResponse = {
      error: error.message,
      statusCode: error.statusCode,
      timestamp: error.timestamp.toISOString(),
    };

    // Include field-level errors for validation errors
    if (error instanceof ValidationError && error.fields) {
      response.fields = error.fields;
    }

    return Response.json(response, { status: error.statusCode });
  }

  // Handle Mongoose validation errors
  if (error && typeof error === "object" && "name" in error && error.name === "ValidationError") {
    return Response.json(
      {
        error: "Validation failed",
        statusCode: 400,
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  // Handle Mongoose duplicate key errors
  if (error && typeof error === "object" && "code" in error && error.code === 11000) {
    return Response.json(
      {
        error: "Duplicate entry - resource already exists",
        statusCode: 409,
        timestamp: new Date().toISOString(),
      },
      { status: 409 }
    );
  }

  // Handle unexpected errors - don't expose internal details
  return Response.json(
    {
      error: "An unexpected error occurred",
      statusCode: 500,
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}

/**
 * Error logger
 * Logs errors with context for debugging
 * @param error - Error to log
 */
export function logError(error: unknown): void {
  const timestamp = new Date().toISOString();

  if (error instanceof AppError) {
    console.error(`[${timestamp}] ${error.constructor.name}:`, {
      message: error.message,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
      stack: error.stack,
    });
  } else if (error instanceof Error) {
    console.error(`[${timestamp}] Error:`, {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
  } else {
    console.error(`[${timestamp}] Unknown error:`, error);
  }
}

/**
 * Async error wrapper for API route handlers
 * Catches errors and passes them to the error handler
 * @param handler - Async function to wrap
 * @returns Wrapped function that handles errors
 */
export function asyncHandler(
  handler: (request: Request, context?: any) => Promise<Response>
): (request: Request, context?: any) => Promise<Response> {
  return async (request: Request, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}

/**
 * Assert condition is true, throw error if false
 * @param condition - Condition to check
 * @param error - Error to throw if condition is false
 */
export function assert(condition: boolean, error: AppError): asserts condition {
  if (!condition) {
    throw error;
  }
}
