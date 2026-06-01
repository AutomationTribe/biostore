import Link from "next/link";

/**
 * Landing page
 * Marketing homepage for BioStore
 */
export default function LandingPage(): React.ReactNode {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent">
      <div className="container mx-auto px-4 py-20">
        <header className="mb-20 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white">BioStore</h1>
          <p className="text-xl text-white/90">
            Your link-in-bio platform. Sell digital products. Build your audience.
          </p>
        </header>

        <section className="mb-12 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Link-in-Bio",
              description: "Create a beautiful profile page that converts visitors",
            },
            {
              title: "Sell Products",
              description: "Monetize your audience with digital products",
            },
            {
              title: "Analytics",
              description: "Track clicks, views, and revenue in real-time",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg bg-white p-8 shadow-lg"
            >
              <h3 className="mb-2 text-lg font-bold text-primary">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </section>

        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-white px-8 py-3 font-bold text-primary shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border-2 border-white px-8 py-3 font-bold text-white hover:bg-white/10"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
