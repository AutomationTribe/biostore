/**
 * Dashboard layout
 * Shell for all authenticated dashboard pages
 * Includes sidebar navigation and header
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">BioStore</h2>
        </div>

        <nav className="space-y-1 px-3 py-6">
          {[
            { name: "Dashboard", href: "/dashboard", icon: "📊" },
            { name: "Links", href: "/dashboard/links", icon: "🔗" },
            { name: "Store", href: "/dashboard/store", icon: "🛍️" },
            { name: "Appearance", href: "/dashboard/appearance", icon: "🎨" },
            { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-lg px-4 py-2 hover:bg-gray-100"
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <header className="border-b border-gray-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <button className="rounded-lg bg-primary px-4 py-2 text-white">
              Profile
            </button>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
