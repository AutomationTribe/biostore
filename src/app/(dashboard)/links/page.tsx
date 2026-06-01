/**
 * Links management page
 * Allows users to create, edit, reorder, and delete links
 */
export default function LinksPage(): React.ReactNode {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Links</h1>
        <button className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
          + Add Link
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">URL</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Active
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4">Link {i}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  https://example.com
                </td>
                <td className="px-6 py-4">{50 * i}</td>
                <td className="px-6 py-4">
                  <input type="checkbox" defaultChecked className="rounded" />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="mr-3 text-primary hover:underline">
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
