'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  faHome, 
  faTicket, 
  faUser,
  faChartSimple,
  faGear,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: faHome, label: 'Dashboard' },
    { href: '/tickets', icon: faTicket, label: 'Tickets' },
    { href: '/tickets/new', icon: faPlus, label: 'New Ticket' },
    { href: '/analytics', icon: faChartSimple, label: 'Analytics' },
    { href: '/admin', icon: faUser, label: 'Admin' },
    { href: '/settings', icon: faGear, label: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Ticket SaaS
        </h1>
        <p className="text-xs text-white/40 mt-1">Enterprise Support</p>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="glass p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-bold">TS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Ticket SaaS v1.0</p>
              <p className="text-xs text-white/40">Production</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}