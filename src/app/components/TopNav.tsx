import { Search, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function TopNav() {
  const { user: currentUser, loading, logout: handleLogout } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      {/* Left Section: Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search leads, loans, partners..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      {/* Right Section: Actions & User Info */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        {/* User Account Details */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          {loading ? (
            // Simple loading skeleton/spinner while check finishes
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          ) : currentUser ? (
            <>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {currentUser?.fullname}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  {currentUser?.role}
                </div>
              </div>

              {/* Dynamic Avatar Container */}
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-semibold shadow-sm text-sm text-white">
                {getInitials(currentUser?.fullname)}
              </div>

              {/* Functional Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 ml-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            // Fallback Guest State when user isn't logged in
            <>
              <div className="text-right hidden sm:block">
                <div className="text-sm text-gray-500">Guest User</div>
              </div>
              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                <User className="w-5 h-5" />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}