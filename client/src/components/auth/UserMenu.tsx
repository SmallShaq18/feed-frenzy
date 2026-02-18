import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Settings, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
//import clsx from 'clsx';

export default function UserMenu() {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="User menu"
        className="flex items-center gap-2 group"
      >
        <span className="w-7 h-7 rounded-sm bg-yellow text-bg text-xs font-mono font-bold flex items-center justify-center transition-transform group-hover:scale-105">
          {initials}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border-loud rounded-md shadow-card-hover animate-slide-up z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-border">
            <p className="font-mono text-xs text-primary truncate">{user.name}</p>
            <p className="font-mono text-[10px] text-muted truncate">{user.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-mono text-secondary hover:text-yellow hover:bg-surface-2 transition-colors"
              >
                <Shield size={13} />
                Admin Panel
              </Link>
            )}
            <button className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-mono text-secondary hover:text-primary hover:bg-surface-2 transition-colors">
              <Settings size={13} />
              Settings
            </button>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-mono text-coral hover:bg-surface-2 transition-colors"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}