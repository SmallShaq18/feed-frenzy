import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
      <span className="font-display text-[120px] text-yellow leading-none">404</span>
      <p className="font-mono text-sm text-muted">This page doesn't exist. Classic.</p>
      <Link to="/" className="font-mono text-xs text-yellow hover:underline mt-2">
        ← Back to the feed
      </Link>
    </div>
  );
}