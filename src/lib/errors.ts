/**
 * Centralized error class for the application.
 * All errors thrown should be instances of AppError.
 */
export class AppError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    status: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

// Common error codes
export const ERROR_CODES = {
  // Auth
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  UNAUTHORIZED: "UNAUTHORIZED",
  SESSION_EXPIRED: "SESSION_EXPIRED",

  // Profile
  PROFILE_NOT_FOUND: "PROFILE_NOT_FOUND",

  // Store/Products
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  PURCHASE_NOT_FOUND: "PURCHASE_NOT_FOUND",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",

  // Database
  DATABASE_ERROR: "DATABASE_ERROR",
  NOT_FOUND: "NOT_FOUND",

  // Payment
  PAYMENT_ERROR: "PAYMENT_ERROR",
  PAYMENT_FAILED: "PAYMENT_FAILED",

  // Agent
  AGENT_ERROR: "AGENT_ERROR",

  // Server
  INTERNAL_ERROR: "INTERNAL_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_ERROR", // Alias
} as const;

/** Type for error codes */
export type ErrorCodeType = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/** Alias for backward compatibility with existing code that expects ErrorCode as the object */
export { ERROR_CODES as ErrorCode };
