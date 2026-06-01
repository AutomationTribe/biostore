/**
 * Dashboard statistics overview page
 * Shows high-level metrics: views, clicks, revenue, etc.
 */
export default function DashboardPage(): React.ReactNode {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Profile Views", value: "1,234" },
          { label: "Link Clicks", value: "456" },
          { label: "Products Sold", value: "12" },
          { label: "Revenue", value: "₦45,600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {/* Top Links Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">Top Performing Links</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <span>Link {i}</span>
                <div className="h-2 w-32 bg-gray-200">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(6 - i) * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">Recent Sales</h2>
          <div className="space-y-3 text-sm">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between border-b pb-2">
                <span>Product {i}</span>
                <span className="font-bold">₦{1000 * i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
