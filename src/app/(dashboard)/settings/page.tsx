/**
 * Settings page
 * Account settings, billing, and preferences
 */
export default function SettingsPage(): React.ReactNode {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                defaultValue="user@example.com"
                className="mt-1 w-full"
              />
            </div>
            <div>
              <label className="block font-medium">Username</label>
              <input
                type="text"
                defaultValue="johndoe"
                className="mt-1 w-full"
              />
            </div>
            <button className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
              Save Changes
            </button>
          </div>
        </div>

        {/* Billing */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">Billing</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Plan: Free</span>
              <button className="text-primary hover:underline">Upgrade</button>
            </div>
            <p className="text-sm text-gray-600">
              You have unlimited links and 1 free product slot.
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-4 text-lg font-bold text-red-600">Danger Zone</h2>
          <button className="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-100">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
