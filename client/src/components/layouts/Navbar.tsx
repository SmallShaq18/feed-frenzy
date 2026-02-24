import { Link, NavLink } from 'react-router-dom';
import { Menu, Bookmark, Zap, Sun, Moon } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useBookmarkStore } from '../../store/useBookmarkStore';
import { useAuthStore } from '../../store/useAuthStore';
import UserMenu from '../auth/UserMenu';
import clsx from 'clsx';

const NAV_LINKS = [
  { to: '/',           label: 'FEED' },
  { to: '/trends',     label: 'TRENDS' },
  { to: '/insights',   label: 'INSIGHTS' },
  { to: '/newsletter', label: 'NEWSLETTER' },
  { to: '/recap',      label: 'RECAP' },
];

export default function Navbar() {
  const { toggleSidebar, toggleTheme, theme } = useUIStore();
  const bookmarkCount = useBookmarkStore(s => s.bookmarks.length);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-bg/80 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="flex items-center h-full px-4 max-w-[1800px] mx-auto">
        
        {/* Interaction Hub */}
        <div className="flex items-center gap-3 mr-6">
          <button
            onClick={toggleSidebar}
            className="p-2 text-muted hover:text-yellow transition-colors hover:bg-surface-2 rounded-sm"
          >
            <Menu size={18} />
          </button>
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Zap size={18} className="text-purple-600 relative z-10" fill="currentColor" />
              <div className="absolute inset-0 bg-yellow blur-md opacity-20 group-hover:opacity-60 transition-opacity" />
            </div>
            <span className="font-display text-lg tracking-[0.2em] text-primary hidden sm:block">
              FEED FRENZY
            </span>
          </Link>
        </div>

        {/* Tactical Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => clsx(
                'relative font-mono text-[10px] tracking-widest px-4 py-2 rounded-sm transition-all',
                isActive 
                  ? 'text-purple-500 font-bold bg-yellow/5' 
                  : 'hover:text-primary hover:bg-surface-2'
              )}
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 animate-in slide-in-from-left duration-300" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Global Utilities */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-muted hover:text-primary hover:bg-surface-2 rounded-sm transition-all"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            to="/bookmarks"
            className="relative p-2 text-muted hover:text-primary hover:bg-surface-2 rounded-sm transition-all"
          >
            <Bookmark size={16} />
            {bookmarkCount > 0 && (
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500 text-[7px] font-bold text-bg items-center justify-center">
                  {bookmarkCount > 9 ? '9+' : bookmarkCount}
                </span>
              </span>
            )}
          </Link>

          <div className="h-4 w-[1px] bg-border mx-2" />

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Link
              to="/login"
              className="font-mono text-[10px] tracking-widest text-secondary hover:text-yellow border border-border px-3 py-1.5 rounded-sm transition-all"
            >
              AUTH_INIT
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

/*import { Link, NavLink } from 'react-router-dom';
import { Menu, Bookmark, Zap, Sun, Moon} from 'lucide-react';
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
  { to: '/recap',     label: 'Weekly Recap' },
];

export default function Navbar() {
  //const toggleSidebar = useUIStore(s => s.toggleSidebar);
  const { toggleSidebar, toggleTheme, theme } = useUIStore();
  const bookmarkCount = useBookmarkStore(s => s.bookmarks.length);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-bg/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center h-full px-4 gap-4">

        {/* Sidebar toggle *
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="p-1.5 text-muted hover:text-primary transition-colors duration-fast rounded-sm hover:bg-surface-2"
        >
          <Menu size={18} />
        </button>

        {/* Logo *
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

        {/* Nav links — hidden on small screens *
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

        {/* Spacer *
        <div className="flex-1" />

        {/* Theme toggle *
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-1.5 text-muted hover:text-primary transition-all duration-fast rounded-sm hover:bg-surface-2"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Bookmarks icon with count *
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

        {/* Auth *
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
}*/