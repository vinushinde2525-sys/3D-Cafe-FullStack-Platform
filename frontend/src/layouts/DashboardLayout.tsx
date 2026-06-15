import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Users, Package, Tag, BarChart2, Menu as MenuIcon, X,
  ChefHat, LogOut, Settings, Bell, FileText, FileSpreadsheet, Radio, ShieldCheck,
  ChevronDown, Layers, ClipboardList, UserCog,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

interface NavLeaf { label: string; to: string; icon: React.ReactNode; end?: boolean; }
interface NavGroup { label: string; icon: React.ReactNode; children: NavLeaf[]; }
type NavEntry = NavLeaf | NavGroup;

const isGroup = (e: NavEntry): e is NavGroup => 'children' in e;

const adminNav: NavEntry[] = [
  { label: 'Dashboard', to: '/admin', icon: <LayoutDashboard size={18} />, end: true },
  { label: 'Orders', to: '/admin/orders', icon: <ShoppingBag size={18} /> },
  {
    label: 'Menu', icon: <Package size={18} />,
    children: [
      { label: 'Products', to: '/admin/menu', icon: <Package size={15} /> },
      { label: 'Categories', to: '/admin/categories', icon: <Layers size={15} /> },
      { label: 'Coupons', to: '/admin/coupons', icon: <Tag size={15} /> },
    ],
  },
  {
    label: 'Customers', icon: <Users size={18} />,
    children: [
      { label: 'CRM', to: '/admin/customers', icon: <Users size={15} /> },
      { label: 'All Users', to: '/admin/users', icon: <UserCog size={15} /> },
    ],
  },
  { label: 'Inventory ERP', to: '/admin/inventory', icon: <ChefHat size={18} /> },
  {
    label: 'Staff HR', icon: <UserCog size={18} />,
    children: [
      { label: 'Dashboard', to: '/admin/staff', icon: <LayoutDashboard size={15} />, end: true },
      { label: 'Employees', to: '/admin/staff/employees', icon: <Users size={15} /> },
      { label: 'Attendance', to: '/admin/staff/attendance', icon: <ClipboardList size={15} /> },
      { label: 'Shifts', to: '/admin/staff/shifts', icon: <ClipboardList size={15} /> },
      { label: 'Leave', to: '/admin/staff/leaves', icon: <ClipboardList size={15} /> },
      { label: 'Payroll', to: '/admin/staff/payroll', icon: <ClipboardList size={15} /> },
      { label: 'Performance', to: '/admin/staff/performance', icon: <BarChart2 size={15} /> },
    ],
  },
  { label: 'Analytics', to: '/admin/analytics', icon: <BarChart2 size={18} /> },
  { label: 'Reports', to: '/admin/reports', icon: <FileText size={18} /> },
  { label: 'Excel Center', to: '/admin/excel-center', icon: <FileSpreadsheet size={18} /> },
  { label: 'Command Center', to: '/admin/command-center', icon: <Radio size={18} /> },
  { label: 'Audit Logs', to: '/admin/audit-logs', icon: <ShieldCheck size={18} /> },
  { label: 'Settings', to: '/admin/settings', icon: <Settings size={18} /> },
];

const staffNav: NavEntry[] = [
  { label: 'Kitchen', to: '/staff', icon: <ChefHat size={18} />, end: true },
  { label: 'Orders', to: '/staff/orders', icon: <ShoppingBag size={18} /> },
  { label: 'Inventory', to: '/staff/inventory', icon: <Package size={18} /> },
];

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.role === 'admin' ? adminNav : staffNav;
  const title = user?.role === 'admin' ? 'Admin' : 'Kitchen';

  const groupKeyOf = (g: NavGroup) => g.label;
  const isGroupActive = useCallback(
    (g: NavGroup) => g.children.some(c => location.pathname.startsWith(c.to)),
    [location.pathname]
  );

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    navItems.forEach(e => { if (isGroup(e) && isGroupActive(e)) initial.add(groupKeyOf(e)); });
    return initial;
  });

  useEffect(() => {
    navItems.forEach(e => {
      if (isGroup(e) && isGroupActive(e)) {
        setOpenGroups(prev => prev.has(groupKeyOf(e)) ? prev : new Set(prev).add(groupKeyOf(e)));
      }
    });
  }, [location.pathname, navItems, isGroupActive]);

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleLogout = async () => { await logout(); navigate('/'); };

  const leafClass = ({ isActive }: { isActive: boolean }) => cn(
    'flex items-center gap-3 px-3 py-2.5 rounded-xl font-display text-sm font-medium transition-all',
    isActive ? 'bg-gold text-espresso' : 'text-cream/60 hover:text-cream hover:bg-cream/8'
  );

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn(
      'flex flex-col h-full bg-espresso text-cream',
      mobile ? 'w-72' : 'w-64'
    )}>
      {/* Brand */}
      <div className="flex items-center justify-between p-6 border-b border-cream/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
            <span className="text-espresso text-sm font-serif font-semibold">3D</span>
          </div>
          <div>
            <p className="font-serif text-base text-cream leading-tight">3D Café</p>
            <p className="font-display text-[10px] text-gold tracking-widest uppercase">{title}</p>
          </div>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="text-cream/50 hover:text-cream">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
        {navItems.map((entry) => {
          if (!isGroup(entry)) {
            return (
              <NavLink
                key={entry.to}
                to={entry.to}
                end={entry.end ?? false}
                onClick={() => setSidebarOpen(false)}
                className={leafClass}
              >
                {entry.icon}<span>{entry.label}</span>
              </NavLink>
            );
          }

          const key = groupKeyOf(entry);
          const open = openGroups.has(key);
          const active = isGroupActive(entry);

          return (
            <div key={key}>
              <button
                onClick={() => toggleGroup(key)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-display text-sm font-medium transition-all',
                  active ? 'text-cream bg-cream/8' : 'text-cream/60 hover:text-cream hover:bg-cream/8'
                )}
              >
                {entry.icon}<span className="flex-1 text-left">{entry.label}</span>
                <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-3"
                  >
                    {entry.children.map(child => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        end={child.end ?? false}
                        onClick={() => setSidebarOpen(false)}
                        className={leafClass}
                      >
                        {child.icon}<span>{child.label}</span>
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-cream/10 flex-shrink-0 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-display font-semibold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-display text-sm text-cream truncate">{user?.name}</p>
            <p className="font-sans text-xs text-cream/40 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut size={16} /><span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-espresso/50 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex-shrink-0 h-16 glass-nav border-b border-beige/30 flex items-center justify-between px-5 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-ink-2 hover:bg-canvas-2 transition-colors">
            <MenuIcon size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <>
                <button onClick={() => navigate('/admin/audit-logs')} title="Recent activity" className="p-2 rounded-xl text-ink-3 hover:bg-canvas-2 hover:text-espresso transition-colors relative">
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold" />
                </button>
                <button onClick={() => navigate('/admin/settings')} title="Settings" className="p-2 rounded-xl text-ink-3 hover:bg-canvas-2 hover:text-espresso transition-colors">
                  <Settings size={18} />
                </button>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
