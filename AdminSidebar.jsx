import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();

  const isActive = (path, exact) =>
    exact ? pathname === path : pathname.startsWith(path);

  return (
    <aside className="w-56 bg-white border-r border-stone-200 min-h-screen flex-shrink-0 hidden md:flex flex-col py-6">
      <div className="px-4 mb-6">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Admin Panel</span>
      </div>

      <nav className="space-y-1 px-3">
        {NAV_ITEMS.map(({ path, label, icon: Icon, exact }) => {
          const active = isActive(path, exact);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-stone-400 hover:text-orange-500 transition-colors"
        >
          ← Back to Store
        </Link>
      </div>
    </aside>
  );
}
