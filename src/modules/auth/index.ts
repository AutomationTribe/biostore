// Public API of auth module

export type { User, Session, AuthError } from "@/modules/auth/types";
export { login, signup, logout, getCurrentSession } from "@/modules/auth/service";
export { loginSchema, signupSchema } from "@/modules/auth/validators";
export type { LoginInput, SignupInput } from "@/modules/auth/validators";
