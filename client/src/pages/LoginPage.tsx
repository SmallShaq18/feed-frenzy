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
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2 justify-center">
          <Zap size={20} className="text-yellow" fill="currentColor" />
          <span className="font-display text-2xl tracking-widest">FEED FRENZY</span>
        </div>

        {/* Card */}
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
  );
}