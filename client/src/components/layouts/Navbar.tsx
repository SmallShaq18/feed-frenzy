import { Link, NavLink } from 'react-router-dom';
import { Menu, Bookmark, Zap } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useBookmarkStore } from '../../store/useBookmarkStore';
import { useAuthStore } from '../../store/useAuthStore';
import UserMenu from '../auth/UserMenu';
import clsx from 'clsx';

const NAV_LINKS = [
  { to: '/',          label: 'Feed' },
  { to: '/trends',    label: 'Trends' },
  { to: '/insights',  label: 'Insights' },
  { to: '/newsletter',label: 'Newsletter' },
];

export default function Navbar() {
  const toggleSidebar = useUIStore(s => s.toggleSidebar);
  const bookmarkCount = useBookmarkStore(s => s.bookmarks.length);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-bg/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center h-full px-4 gap-4">

        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="p-1.5 text-muted hover:text-primary transition-colors duration-fast rounded-sm hover:bg-surface-2"
        >
          <Menu size={18} />
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="Feed Frenzy home"
        >
          <Zap
            size={18}
            className="text-yellow group-hover:animate-pulse-glow transition-all"
            fill="currentColor"
          />
          <span className="font-display text-xl tracking-widest text-primary leading-none">
            FEED FRENZY
          </span>
        </Link>

        {/* Nav links — hidden on small screens */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'font-mono text-xs tracking-wider px-3 py-1.5 rounded-sm',
                  'transition-all duration-fast',
                  isActive
                    ? 'text-yellow bg-yellow/10'
                    : 'text-secondary hover:text-primary hover:bg-surface-2'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bookmarks icon with count */}
        <Link
          to="/bookmarks"
          aria-label={`Bookmarks (${bookmarkCount})`}
          className="relative p-1.5 text-muted hover:text-primary transition-colors rounded-sm hover:bg-surface-2"
        >
          <Bookmark size={18} />
          {bookmarkCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-yellow text-bg text-[9px] font-mono font-bold rounded-full flex items-center justify-center leading-none">
              {bookmarkCount > 99 ? '99+' : bookmarkCount}
            </span>
          )}
        </Link>

        {/* Auth */}
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <Link
            to="/login"
            className="font-mono text-xs text-secondary hover:text-yellow transition-colors duration-fast tracking-wider"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}