import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Settings, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function UserMenu() {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center justify-center w-8 h-8 border border-border bg-surface hover:border-primary transition-all group"
      >
        <span className="font-mono text-[10px] font-bold text-primary group-hover:text-yellow">
          {initials}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-surface border-2 border-primary shadow-[4px_4px_0px_0px_rgba(var(--primary-rgb),0.1)] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-border bg-primary/5">
            <p className="font-mono text-[10px] text-primary font-bold uppercase truncate">{user.name}</p>
            <p className="font-mono text-[9px] text-muted truncate mt-0.5">{user.email}</p>
          </div>

          <div className="p-1">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 font-mono text-[10px] uppercase text-secondary hover:bg-primary hover:text-bg transition-colors"
              >
                <Shield size={12} /> Access Admin
              </Link>
            )}
            <button className="flex items-center gap-3 w-full px-3 py-2 font-mono text-[10px] uppercase text-secondary hover:bg-surface-2 transition-colors">
              <Settings size={12} /> Preferences
            </button>
            <div className="h-px bg-border my-1" />
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2 font-mono text-[10px] uppercase text-coral hover:bg-coral/10 transition-colors"
            >
              <LogOut size={12} /> Terminate Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/*import { useState, useRef, useEffect } from 'react';
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
      {/* Avatar trigger *
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="User menu"
        className="flex items-center gap-2 group"
      >
        <span className="w-7 h-7 rounded-sm bg-yellow text-bg text-xs font-mono font-bold flex items-center justify-center transition-transform group-hover:scale-105">
          {initials}
        </span>
      </button>

      {/* Dropdown *
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border-loud rounded-md shadow-card-hover animate-slide-up z-50">
          {/* User info *
          <div className="px-4 py-3 border-b border-border">
            <p className="font-mono text-xs text-primary truncate">{user.name}</p>
            <p className="font-mono text-[10px] text-muted truncate">{user.email}</p>
          </div>

          {/* Menu items *
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
}*/