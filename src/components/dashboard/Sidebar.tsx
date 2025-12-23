'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, GitBranch, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Peserta',
    href: '/dashboard/peserta',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Bagan 1',
    href: '/dashboard/bagan-1',
    icon: <GitBranch className="h-5 w-5" />,
  },
  {
    title: 'Bagan 2',
    href: '/dashboard/bagan-2',
    icon: <GitBranch className="h-5 w-5" />,
  },
];

const Sidebar = (): React.ReactElement => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <h1 className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-xl font-bold text-transparent">
            The Blind App
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-violet-600 dark:text-violet-400'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                collapsed && 'justify-center px-2'
              )}
            >
              <span
                className={cn(
                  'flex-shrink-0',
                  isActive && 'text-violet-500'
                )}
              >
                {item.icon}
              </span>
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        {!collapsed && (
          <p className="text-xs text-muted-foreground">
            © 2024 The Blind App
          </p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

