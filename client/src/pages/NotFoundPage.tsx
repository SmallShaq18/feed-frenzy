import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative">
        <span className="font-display text-[160px] leading-none text-muted/10 select-none">404</span>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="font-display text-4xl uppercase italic tracking-tighter">Protocol Error</h1>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Target coordinate does not exist.</p>
        </div>
      </div>
      <Link to="/" className="mt-12 font-mono text-[10px] border-2 border-foreground px-8 py-3 uppercase font-bold hover:bg-violet-600 hover:border-violet-600 hover:text-white transition-all">
        ← Return to Mainframe
      </Link>
    </div>
  );
}

/*import { Link } from 'react-router-dom';
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
}*/