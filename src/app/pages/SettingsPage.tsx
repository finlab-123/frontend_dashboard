import { User, Bell, Lock, CreditCard, Globe, Palette } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <button className="p-6 bg-white border-2 border-blue-600 rounded-lg text-left hover:shadow-md transition-shadow">
          <User className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-sm text-gray-900 mb-1">Profile</h3>
          <p className="text-xs text-gray-600">Update your personal information</p>
        </button>

        <button className="p-6 bg-white border border-gray-200 rounded-lg text-left hover:shadow-md transition-shadow">
          <Bell className="w-8 h-8 text-gray-600 mb-3" />
          <h3 className="text-sm text-gray-900 mb-1">Notifications</h3>
          <p className="text-xs text-gray-600">Manage notification preferences</p>
        </button>

        <button className="p-6 bg-white border border-gray-200 rounded-lg text-left hover:shadow-md transition-shadow">
          <Lock className="w-8 h-8 text-gray-600 mb-3" />
          <h3 className="text-sm text-gray-900 mb-1">Security</h3>
          <p className="text-xs text-gray-600">Password and authentication</p>
        </button>

        <button className="p-6 bg-white border border-gray-200 rounded-lg text-left hover:shadow-md transition-shadow">
          <CreditCard className="w-8 h-8 text-gray-600 mb-3" />
          <h3 className="text-sm text-gray-900 mb-1">Billing</h3>
          <p className="text-xs text-gray-600">Manage billing and payments</p>
        </button>

        <button className="p-6 bg-white border border-gray-200 rounded-lg text-left hover:shadow-md transition-shadow">
          <Globe className="w-8 h-8 text-gray-600 mb-3" />
          <h3 className="text-sm text-gray-900 mb-1">Language & Region</h3>
          <p className="text-xs text-gray-600">Set language and timezone</p>
        </button>

        <button className="p-6 bg-white border border-gray-200 rounded-lg text-left hover:shadow-md transition-shadow">
          <Palette className="w-8 h-8 text-gray-600 mb-3" />
          <h3 className="text-sm text-gray-900 mb-1">Appearance</h3>
          <p className="text-xs text-gray-600">Customize theme and display</p>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl text-gray-900 mb-6">Profile Settings</h2>
        <form className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                defaultValue="Admin"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                defaultValue="User"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              defaultValue="admin@byndfinserver.com"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">mobile  Number</label>
            <input
              type="tel"
              defaultValue="+91 98765 43210"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Role</label>
            <input
              type="text"
              defaultValue="Administrator"
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

