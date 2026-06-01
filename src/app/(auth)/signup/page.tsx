/**
 * Signup page
 * New user registration with onboarding
 */
export default function SignupPage(): React.ReactNode {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">Create Account</h1>

        <form className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block font-medium">
              Full Name
            </label>
            <input id="fullName" type="text" placeholder="John Doe" required />
          </div>

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
            <label htmlFor="username" className="block font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="johndoe"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block font-medium">
              Creator Category
            </label>
            <select id="category">
              <option>Select a category</option>
              <option>Music</option>
              <option>Tech</option>
              <option>Lifestyle</option>
              <option>Business</option>
              <option>Other</option>
            </select>
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
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="font-bold text-primary">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
