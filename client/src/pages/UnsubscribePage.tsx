import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { unsubscribeFromNewsletter } from '../api/newsletter';
import Spinner from '../components/ui/Spinner';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function UnsubscribePage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'already' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Missing sequence token');
      return;
    }

    unsubscribeFromNewsletter(token)
      .then(() => setStatus('success'))
      .catch((error) => {
        if (error.response?.data?.message?.includes('already')) {
          setStatus('already');
        } else {
          setStatus('error');
          setErrorMessage(error.response?.data?.error || error.message);
        }
      });
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full border-2 border-foreground p-10 bg-card relative shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)]">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-6 py-8">
            <Spinner size="lg" className="text-violet-600" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Terminating Connection...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center text-center gap-6">
            <CheckCircle size={48} className="text-emerald-500" />
            <h1 className="font-display text-4xl uppercase italic tracking-tighter">DE-ACTIVATED</h1>
            <p className="font-mono text-xs text-muted-foreground uppercase leading-relaxed">
              Your identifier has been purged from the primary mailing sequence.
            </p>
            <Link to="/newsletter" className="font-mono text-[10px] text-violet-500 font-bold uppercase hover:underline">
              Re-establish link →
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center text-center gap-6">
            <XCircle size={48} className="text-coral" />
            <h1 className="font-display text-4xl uppercase italic tracking-tighter">FAULT DETECTED</h1>
            <div className="w-full bg-coral/5 border border-coral/20 p-3 font-mono text-[9px] text-coral uppercase tracking-tighter">
              LOG: {errorMessage}
            </div>
            <Link to="/" className="font-mono text-[10px] text-foreground uppercase border border-border px-4 py-2 hover:bg-muted transition-colors">
              Return to Feed
            </Link>
          </div>
        )}

        {status === 'already' && (
          <div className="flex flex-col items-center text-center gap-6">
            <AlertTriangle size={48} className="text-violet-500" />
            <h1 className="font-display text-4xl uppercase italic tracking-tighter">VOID STATUS</h1>
            <p className="font-mono text-xs text-muted-foreground uppercase">Connection already severed.</p>
            <Link to="/" className="font-mono text-[10px] text-violet-500 font-bold uppercase hover:underline">
              Go to feed
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}