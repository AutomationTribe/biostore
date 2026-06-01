/**
 * Login page
 * Allows existing users to authenticate
 */
export default function LoginPage(): React.ReactNode {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">Sign In</h1>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 font-bold text-white hover:bg-primary/90"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="font-bold text-primary">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
