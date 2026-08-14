import { NavLink } from 'react-router-dom';
import { Home, Wallet, Target, PieChart, Menu } from 'lucide-react';

const items = [
  { to: '/', label: 'الرئيسية', icon: Home },
  { to: '/expenses', label: 'المصاريف', icon: Wallet },
  { to: '/goals', label: 'الأهداف', icon: Target },
  { to: '/analysis', label: 'التحليل', icon: PieChart },
  { to: '/more', label: 'المزيد', icon: Menu },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-ink-900/95 backdrop-blur border-t border-ink-100 dark:border-ink-800 pb-[env(safe-area-inset-bottom)]"
      aria-label="التنقل الأساسي"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] text-xs font-medium transition-colors ${
                  isActive ? 'text-ink-600 dark:text-sand-200' : 'text-ink-300 dark:text-ink-500'
                }`
              }
              aria-label={label}
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
