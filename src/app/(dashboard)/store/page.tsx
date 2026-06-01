/**
 * Store management page
 * Allows users to create, edit, and manage digital products
 */
export default function StorePage(): React.ReactNode {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Store</h1>
        <button className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
          + New Product
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
          >
            <div className="h-40 bg-gray-200" />
            <div className="p-4">
              <h3 className="font-bold">Product {i}</h3>
              <p className="text-sm text-gray-600">Digital Product</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold text-primary">₦{2000 * i}</span>
                <div className="space-x-2">
                  <button className="text-primary hover:underline">Edit</button>
                  <button className="text-red-500 hover:underline">Delete</button>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">{i * 10} sales</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
