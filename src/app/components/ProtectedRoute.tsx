import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  // 1. Loading state indicator
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500 animate-pulse">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // 2. Intercept: Unauthenticated OR role not allowed
  const hasAccess = user && allowedRoles.includes(user.role.toLowerCase());

  if (!hasAccess) {
    const handleRedirect = () => {
      window.location.replace("http://localhost:5175");
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 px-6 py-12 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-rose-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 text-center shadow-2xl relative z-10">
          <div className="inline-flex p-4 bg-rose-500/10 rounded-2xl text-rose-500 mb-6 border border-rose-500/20 animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">404</h1>
          <h2 className="text-xl font-bold text-slate-100 mb-4">Access Denied</h2>
          
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            You do not have the required permissions to access this Admin dashboard page. 
            Please sign in as an authorized Admin.
          </p>

          <button
            onClick={handleRedirect}
            className="w-full bg-white hover:bg-slate-100 text-slate-950 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // 3. Render children normally if authorized
  return <>{children}</>;
};
