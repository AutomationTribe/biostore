/**
 * Appearance customization page
 * Allows users to customize themes and appearance of their profile
 */
export default function AppearancePage(): React.ReactNode {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Appearance & Themes</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Theme Selection */}
        <div>
          <h2 className="mb-4 text-lg font-bold">Select a Theme</h2>
          <div className="space-y-3">
            {[
              { name: "Minimal", colors: "bg-black/50" },
              { name: "Vibrant", colors: "bg-gradient-to-r from-red-500 to-yellow-500" },
              { name: "Professional", colors: "bg-blue-900/50" },
              { name: "Sunset", colors: "bg-gradient-to-r from-orange-500 to-pink-500" },
            ].map((theme) => (
              <div
                key={theme.name}
                className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4 hover:border-primary"
              >
                <div className={`h-16 w-16 rounded-lg ${theme.colors}`} />
                <div className="flex-1">
                  <h3 className="font-bold">{theme.name}</h3>
                  <p className="text-sm text-gray-600">Modern design</p>
                </div>
                <input type="radio" name="theme" className="rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Bio Editor */}
        <div>
          <h2 className="mb-4 text-lg font-bold">Your Bio</h2>
          <textarea
            className="h-48 w-full rounded-lg border border-gray-300 p-4"
            placeholder="Write a short bio about yourself..."
            defaultValue="Digital creator building awesome products."
          />
          <button className="mt-4 rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90">
            Save Bio
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-12">
        <h2 className="mb-4 text-lg font-bold">Preview</h2>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8">
          <div className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 h-20 w-20 rounded-full bg-gray-200 mx-auto" />
            <h3 className="text-center font-bold">Your Name</h3>
            <p className="mt-2 text-center text-sm text-gray-600">
              Digital creator building awesome products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
