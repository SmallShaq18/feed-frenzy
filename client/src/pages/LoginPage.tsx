import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

/**
 * Login page — mock auth. No separate LoginForm component needed.
 * When real auth lands, swap the store's login() call only.
 */
export default function LoginPage() {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in — redirect
  if (isAuthenticated) return <Navigate to="/admin" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Decorative corner brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-violet-600" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-violet-600" />
        
        <div className="bg-card border border-border p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col items-center gap-2 mb-10 text-center">
            <div className="p-3 bg-violet-600/10 rounded-full mb-2">
              <Zap size={32} className="text-violet-600" fill="currentColor" />
            </div>
            <h1 className="font-display text-4xl tracking-tighter uppercase italic">FEED <span className="text-transparent border-v-stroke">FRENZY</span></h1>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Authorized Access Only</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground ml-1">Identity.Email</label>
              <Input
                type="email"
                className="bg-muted/50 border-border font-mono text-sm rounded-none focus:ring-1 focus:ring-violet-600"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground ml-1">Key.Password</label>
              <Input
                type="password"
                className="bg-muted/50 border-border font-mono text-sm rounded-none focus:ring-1 focus:ring-violet-600"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border-l-2 border-red-500 p-3 mt-2">
                <p className="font-mono text-[10px] text-red-500 uppercase font-bold tracking-tighter italic">Error: {error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="mt-4 bg-violet-600 hover:bg-violet-700 text-white font-mono text-xs uppercase tracking-[0.2em] py-6 rounded-none"
            >
              Initialize Session
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border text-center">
            {/*<p className="font-mono text-[9px] text-muted-foreground uppercase leading-relaxed tracking-tighter italic">
              Credential hint: any character string will pass the handshake validation in this environment.
            </p>*/}
          </div>
        </div>
      </div>
    </div>
  );

  /*return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Logo *
        <div className="flex items-center gap-2 justify-center">
          <Zap size={20} className="text-yellow" fill="currentColor" />
          <span className="font-display text-2xl tracking-widest">FEED FRENZY</span>
        </div>

        {/* Card *
        <div className="bg-surface border border-border rounded-md p-6 flex flex-col gap-4">
          <div>
            <h1 className="font-display text-2xl tracking-widest text-primary">
              ADMIN LOGIN
            </h1>
            <p className="font-mono text-[10px] text-muted mt-1">
              Use admin@feedfrenzy.com with any password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@feedfrenzy.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="anything works"
              required
            />

            {error && (
              <p className="font-mono text-xs text-coral">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="mt-1"
            >
              Log in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );*/
}