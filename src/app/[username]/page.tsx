/**
 * Public profile page for a creator
 * Static generated page showing the creator's link-in-bio and products
 * Route: /[username]
 */

interface PageProps {
  params: Promise<{ username: string }>;
}

/**
 * Generate static params for popular creators
 * Falls back to on-demand rendering for others
 */
export async function generateStaticParams(): Promise<{ username: string }[]> {
  // Return empty array for on-demand ISR
  return [];
}

export default async function ProfilePage({
  params,
}: PageProps): Promise<React.ReactNode> {
  const { username } = await params;

  // In real app: fetch profile data from DB
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
          {/* Profile Header */}
          <div className="text-center">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gray-300" />
            <h1 className="text-2xl font-bold">@{username}</h1>
            <p className="mt-2 text-gray-600">
              Digital creator building awesome products
            </p>
          </div>

          {/* Links Section */}
          <div className="mt-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <a
                key={i}
                href="https://example.com"
                className="block rounded-lg border-2 border-primary bg-white p-4 text-center font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                Link {i}
              </a>
            ))}
          </div>

          {/* Products Section */}
          <div className="mt-12">
            <h2 className="mb-4 text-center font-bold">Products</h2>
            <div className="grid gap-3 grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 p-3 text-center"
                >
                  <div className="mb-2 h-12 bg-gray-200 rounded" />
                  <p className="text-sm font-semibold">Product {i}</p>
                  <p className="text-primary font-bold">₦{2000 * i}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
