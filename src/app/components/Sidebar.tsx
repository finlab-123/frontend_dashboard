import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Car,
  Home,
  Building2,
  TrendingUp,
  Heart,
  PieChart,
  Shield,
  CreditCard,
  Umbrella,
  Handshake,
  BarChart3,
  Settings,
  BookOpen,
  Truck 
} from 'lucide-react';


interface MenuItemLink {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  path: string;
  divider?: never;
}

interface MenuDivider {
  divider: true;
  label?: string;
  icon?: never;
  path?: never;
}

type MenuItem = MenuItemLink | MenuDivider;

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard Overview', path: '/' },
  { icon: Users, label: 'All Leads', path: '/leads' },
  { icon: UserPlus, label: 'Assign Leads', path: '/assign-leads' },
  { divider: true, label: 'Loan Categories' },
  { icon: Car, label: 'Vehicle Loan', path: '/vehicle-loan' },
  { icon: Home, label: 'Home Loan', path: '/home-loan' },
  { icon: Building2, label: 'Loan Against Property', path: '/lap' },
  { icon: TrendingUp, label: 'Loan Against Shares', path: '/loan-against-shares' },
  { icon: Heart, label: 'Medical Loan', path: '/medical-loan' },
  { icon: Truck, label: 'Supply Chain', path: '/supply-chain' }, 
  { icon: BookOpen, label: 'Education Loan', path: '/education-loan' },
  { icon: PieChart, label: 'Mutual Funds', path: '/mutual-funds' },
  { divider: true, label: 'Other Products' },
  { icon: Shield, label: 'Life Insurance', path: '/life-insurance' },
  { icon: CreditCard, label: 'Credit Card', path: '/credit-card' },
  { icon: Umbrella, label: 'General Insurance', path: '/general-insurance' },
  { divider: true },
  { icon: Handshake, label: 'Partner With Us', path: '/partner' },
  { icon: BarChart3, label: 'Reports & Analytics', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl tracking-tight font-bold text-gray-900">Bynd Finserver</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((item, index) => {
          
          if (item.divider) {
            return (
              <div key={index} className="mt-6 mb-2">
                {item.label && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-3">
                    {item.label}
                  </span>
                )}
                {!item.label && <hr className="border-gray-100 my-4 mx-3" />}
              </div>
            );
          }

          
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium mb-1 ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
