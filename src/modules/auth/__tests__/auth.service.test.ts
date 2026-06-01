import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SupabaseClient } from "@supabase/supabase-js";
import * as repository from "../repository";
import * as service from "../service";
import { AppError } from "@/lib/errors";

// Mock the repository module
vi.mock("../repository");

describe("Auth Service", () => {
  let mockSupabase: SupabaseClient;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Create a minimal mock Supabase client
    mockSupabase = {
      auth: {
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        getUser: vi.fn(),
      },
      from: vi.fn(),
      rpc: vi.fn(),
    } as unknown as SupabaseClient;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("signup", () => {
    it("should create a new user successfully", async () => {
      const email = "newuser@example.com";
      const password = "SecurePassword123!";
      const userId = "user-uuid-123";

      // Mock the repository to simulate successful user creation
      vi.mocked(repository.createUser).mockResolvedValue({
        id: userId,
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const result = await service.signup(mockSupabase, { email, password });

      expect(result).toEqual({
        id: userId,
        email,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
      expect(repository.createUser).toHaveBeenCalledWith(mockSupabase, {
        email,
        password,
      });
    });

    it("should throw error on duplicate email", async () => {
      const email = "existing@example.com";
      const password = "SecurePassword123!";

      // Mock the repository to throw duplicate email error
      vi.mocked(repository.createUser).mockRejectedValue(
        new AppError("CONFLICT", "Email already exists", 409, { email })
      );

      await expect(service.signup(mockSupabase, { email, password })).rejects.toThrow(
        AppError
      );
      await expect(service.signup(mockSupabase, { email, password })).rejects.toMatchObject({
        code: "CONFLICT",
        status: 409,
      });
    });

    it("should throw error on weak password", async () => {
      const email = "user@example.com";
      const password = "weak";

      vi.mocked(repository.createUser).mockRejectedValue(
        new AppError("INVALID_INPUT", "Password does not meet requirements", 400, {
          password: "too short",
        })
      );

      await expect(service.signup(mockSupabase, { email, password })).rejects.toThrow(
        AppError
      );
    });

    it("should throw error on invalid email format", async () => {
      const email = "invalid-email";
      const password = "SecurePassword123!";

      vi.mocked(repository.createUser).mockRejectedValue(
        new AppError("INVALID_INPUT", "Invalid email format", 400, { email })
      );

      await expect(service.signup(mockSupabase, { email, password })).rejects.toThrow(
        AppError
      );
    });
  });

  describe("login", () => {
    it("should authenticate user successfully", async () => {
      const email = "user@example.com";
      const password = "CorrectPassword123!";
      const userId = "user-uuid-456";
      const token = "auth-token-abc123";

      vi.mocked(repository.getUserByEmail).mockResolvedValue({
        id: userId,
        email,
        password_hash: "hashed_password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      vi.mocked(repository.verifyPassword).mockResolvedValue(true);

      vi.mocked(repository.createSession).mockResolvedValue({
        id: "session-123",
        user_id: userId,
        token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      });

      const result = await service.login(mockSupabase, { email, password });

      expect(result).toEqual({
        id: "session-123",
        user_id: userId,
        token,
        expires_at: expect.any(String),
        created_at: expect.any(String),
      });
      expect(repository.getUserByEmail).toHaveBeenCalledWith(mockSupabase, email);
      expect(repository.verifyPassword).toHaveBeenCalledWith(
        password,
        "hashed_password"
      );
      expect(repository.createSession).toHaveBeenCalledWith(mockSupabase, userId);
    });

    it("should throw error when user not found", async () => {
      const email = "nonexistent@example.com";
      const password = "SomePassword123!";

      vi.mocked(repository.getUserByEmail).mockResolvedValue(null);

      await expect(service.login(mockSupabase, { email, password })).rejects.toThrow(
        AppError
      );
      await expect(service.login(mockSupabase, { email, password })).rejects.toMatchObject({
        code: "UNAUTHORIZED",
        status: 401,
      });
      expect(repository.verifyPassword).not.toHaveBeenCalled();
    });

    it("should throw error on incorrect password", async () => {
      const email = "user@example.com";
      const password = "WrongPassword123!";
      const userId = "user-uuid-789";

      vi.mocked(repository.getUserByEmail).mockResolvedValue({
        id: userId,
        email,
        password_hash: "hashed_correct_password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      vi.mocked(repository.verifyPassword).mockResolvedValue(false);

      await expect(service.login(mockSupabase, { email, password })).rejects.toThrow(
        AppError
      );
      await expect(service.login(mockSupabase, { email, password })).rejects.toMatchObject({
        code: "UNAUTHORIZED",
        status: 401,
        message: "Invalid email or password",
      });
      expect(repository.createSession).not.toHaveBeenCalled();
    });

    it("should throw error on database connection failure", async () => {
      const email = "user@example.com";
      const password = "Password123!";

      vi.mocked(repository.getUserByEmail).mockRejectedValue(
        new AppError("DATABASE_ERROR", "Connection failed", 500, {})
      );

      await expect(service.login(mockSupabase, { email, password })).rejects.toThrow(
        AppError
      );
      await expect(service.login(mockSupabase, { email, password })).rejects.toMatchObject({
        code: "DATABASE_ERROR",
        status: 500,
      });
    });
  });

  describe("logout", () => {
    it("should invalidate session successfully", async () => {
      const sessionId = "session-123";
      const userId = "user-uuid-456";

      vi.mocked(repository.getSession).mockResolvedValue({
        id: sessionId,
        user_id: userId,
        token: "auth-token",
        expires_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      vi.mocked(repository.deleteSession).mockResolvedValue(true);

      const result = await service.logout(mockSupabase, sessionId);

      expect(result).toBe(true);
      expect(repository.getSession).toHaveBeenCalledWith(mockSupabase, sessionId);
      expect(repository.deleteSession).toHaveBeenCalledWith(mockSupabase, sessionId);
    });

    it("should throw error when session not found", async () => {
      const sessionId = "nonexistent-session";

      vi.mocked(repository.getSession).mockResolvedValue(null);

      await expect(service.logout(mockSupabase, sessionId)).rejects.toThrow(
        AppError
      );
      await expect(service.logout(mockSupabase, sessionId)).rejects.toMatchObject({
        code: "NOT_FOUND",
        status: 404,
      });
      expect(repository.deleteSession).not.toHaveBeenCalled();
    });
  });

  describe("verifySession", () => {
    it("should return user data for valid session", async () => {
      const token = "valid-token-abc123";
      const userId = "user-uuid-456";
      const userEmail = "user@example.com";

      vi.mocked(repository.getSessionByToken).mockResolvedValue({
        id: "session-123",
        user_id: userId,
        token,
        expires_at: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
        created_at: new Date().toISOString(),
      });

      vi.mocked(repository.getUserById).mockResolvedValue({
        id: userId,
        email: userEmail,
        password_hash: "hashed_password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const result = await service.verifySession(mockSupabase, token);

      expect(result).toEqual({
        id: userId,
        email: userEmail,
        password_hash: "hashed_password",
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
      expect(repository.getSessionByToken).toHaveBeenCalledWith(mockSupabase, token);
      expect(repository.getUserById).toHaveBeenCalledWith(mockSupabase, userId);
    });

    it("should throw error for expired session", async () => {
      const token = "expired-token";
      const userId = "user-uuid-456";

      vi.mocked(repository.getSessionByToken).mockResolvedValue({
        id: "session-123",
        user_id: userId,
        token,
        expires_at: new Date(Date.now() - 1000).toISOString(), // 1 second ago
        created_at: new Date().toISOString(),
      });

      await expect(service.verifySession(mockSupabase, token)).rejects.toThrow(
        AppError
      );
      await expect(service.verifySession(mockSupabase, token)).rejects.toMatchObject({
        code: "UNAUTHORIZED",
        status: 401,
        message: "Session expired",
      });
      expect(repository.getUserById).not.toHaveBeenCalled();
    });

    it("should throw error when session not found", async () => {
      const token = "invalid-token";

      vi.mocked(repository.getSessionByToken).mockResolvedValue(null);

      await expect(service.verifySession(mockSupabase, token)).rejects.toThrow(
        AppError
      );
      await expect(service.verifySession(mockSupabase, token)).rejects.toMatchObject({
        code: "UNAUTHORIZED",
        status: 401,
      });
    });
  });

  describe("changePassword", () => {
    it("should change password successfully", async () => {
      const userId = "user-uuid-789";
      const currentPassword = "OldPassword123!";
      const newPassword = "NewPassword123!";

      vi.mocked(repository.getUserById).mockResolvedValue({
        id: userId,
        email: "user@example.com",
        password_hash: "hashed_old_password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      vi.mocked(repository.verifyPassword).mockResolvedValue(true);

      vi.mocked(repository.updatePassword).mockResolvedValue({
        id: userId,
        email: "user@example.com",
        password_hash: "hashed_new_password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const result = await service.changePassword(mockSupabase, userId, {
        currentPassword,
        newPassword,
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(userId);
      expect(repository.verifyPassword).toHaveBeenCalledWith(
        currentPassword,
        "hashed_old_password"
      );
      expect(repository.updatePassword).toHaveBeenCalledWith(
        mockSupabase,
        userId,
        newPassword
      );
    });

    it("should throw error when current password is incorrect", async () => {
      const userId = "user-uuid-789";
      const currentPassword = "WrongPassword123!";
      const newPassword = "NewPassword123!";

      vi.mocked(repository.getUserById).mockResolvedValue({
        id: userId,
        email: "user@example.com",
        password_hash: "hashed_correct_password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      vi.mocked(repository.verifyPassword).mockResolvedValue(false);

      await expect(
        service.changePassword(mockSupabase, userId, {
          currentPassword,
          newPassword,
        })
      ).rejects.toThrow(AppError);
      expect(repository.updatePassword).not.toHaveBeenCalled();
    });

    it("should throw error when new password same as old password", async () => {
      const userId = "user-uuid-789";
      const password = "SamePassword123!";

      vi.mocked(repository.getUserById).mockResolvedValue({
        id: userId,
        email: "user@example.com",
        password_hash: "hashed_password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      vi.mocked(repository.verifyPassword).mockResolvedValue(true);

      await expect(
        service.changePassword(mockSupabase, userId, {
          currentPassword: password,
          newPassword: password,
        })
      ).rejects.toThrow(AppError);
      expect(repository.updatePassword).not.toHaveBeenCalled();
    });
  });
});
