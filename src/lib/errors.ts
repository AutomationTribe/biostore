/**
 * Centralized error class for the application.
 * All errors thrown should be instances of AppError.
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
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
} as const;
