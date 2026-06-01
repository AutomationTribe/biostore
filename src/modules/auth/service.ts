import { SupabaseClient } from "@supabase/supabase-js";
import { AppError, ErrorCode } from "@/lib/errors";
import {
  findByEmail,
  findByUsername,
  createUser,
} from "@/modules/auth/repository";
import {
  LoginInput,
  SignupInput,
} from "@/modules/auth/validators";
import { User } from "@/modules/auth/types";

/**
 * Login user with email and password
 */
export async function login(
  supabase: SupabaseClient,
  input: LoginInput
): Promise<{ user: User; session: string }> {
  const { error, data } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.session) {
    throw new AppError(
      ErrorCode.INVALID_CREDENTIALS,
      "Invalid email or password",
      401
    );
  }

  const user = await findByEmail(supabase, input.email);
  if (!user) {
    throw new AppError(
      ErrorCode.USER_NOT_FOUND,
      "User not found",
      404
    );
  }

  return {
    user,
    session: data.session.access_token,
  };
}

/**
 * Create new user account
 */
export async function signup(
  supabase: SupabaseClient,
  input: SignupInput
): Promise<User> {
  // Check if email already exists
  const existingEmail = await findByEmail(supabase, input.email);
  if (existingEmail) {
    throw new AppError(
      ErrorCode.USER_ALREADY_EXISTS,
      "Email already registered",
      409
    );
  }

  // Check if username already taken
  const existingUsername = await findByUsername(supabase, input.username);
  if (existingUsername) {
    throw new AppError(
      ErrorCode.USER_ALREADY_EXISTS,
      "Username already taken",
      409
    );
  }

  // Create auth user
  const { error: authError, data: authData } =
    await supabase.auth.signUp({
      email: input.email,
      password: input.password,
    });

  if (authError || !authData.user) {
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to create user account",
      500
    );
  }

  // Create user record
  const user = await createUser(supabase, {
    id: authData.user.id,
    email: input.email,
    username: input.username,
    fullName: input.fullName,
    creatorCategory: input.creatorCategory,
  });

  return user;
}

/**
 * Logout user
 */
export async function logout(supabase: SupabaseClient): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to logout",
      500
    );
  }
}

/**
 * Get current user session
 */
export async function getCurrentSession(
  supabase: SupabaseClient
): Promise<User | null> {
  const { data } = await supabase.auth.getSession();

  if (!data.session) return null;

  const user = await findByEmail(supabase, data.session.user.email!);
  return user || null;
}
