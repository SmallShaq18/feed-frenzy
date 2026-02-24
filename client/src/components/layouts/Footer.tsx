import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-6 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-purple-600" fill="currentColor" />
          <span className="font-display text-sm tracking-widest">
            FEED FRENZY
          </span>
        </div>

        {/* Tagline */}
        <p className="font-mono text-[10px] text-muted tracking-wider text-center">
          The internet is talking. We're just keeping score.
        </p>

        {/* Links */}
        <nav className="flex items-center gap-4">
          {[
            { to: '/newsletter', label: 'Subscribe' },
            { to: '/trends',     label: 'Trends'    },
            { to: '/admin',      label: 'Admin'     },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="font-mono text-[10px] hover:text-purple-500 transition-colors tracking-widest uppercase"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}