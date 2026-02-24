import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Mail, Zap, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscribeToNewsletter } from '../../api/newsletter';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => subscribeToNewsletter({ email }),
    onSuccess: () => {
      setSubscribed(true);
      toast.success('ENCRYPTED CONNECTION ESTABLISHED');
    },
    onError: (err: any) => toast.error(err.friendlyMessage ?? 'Link Failed. Retry.'),
  });

  if (subscribed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 border border-yellow/20 bg-yellow/5 rounded-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,229,0,0.03)_2px)] pointer-events-none" />
        <ShieldCheck className="text-yellow mb-4 animate-bounce" size={40} />
        <h3 className="font-display text-2xl tracking-[0.3em] text-yellow mb-2">LINK ACTIVE</h3>
        <p className="font-mono text-[10px] text-muted text-center max-w-[240px] leading-relaxed uppercase tracking-widest">
          Infiltration successful. Weekly intelligence arriving every Sunday.
        </p>
      </div>
    );
  }

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); email.trim() && mutate(); }} 
      className="flex flex-col gap-4 w-full max-w-md"
    >
      <div className="space-y-1">
        <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted ml-1">Terminal Inbox</label>
        <Input
          type="email"
          placeholder="test@example.com"
          value={email}
          onChange={e => setEmail(e.target.value.toUpperCase())}
          icon={<Mail size={14} className="text-muted group-focus-within:text-yellow" />}
          required
          className="font-mono text-xs tracking-widest bg-surface border-border focus:border-yellow/50 transition-all"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={isPending}
        fullWidth
        className="group relative overflow-hidden h-12"
        disabled={isPending}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow/0 via-white/20 to-yellow/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        <Zap size={14} fill="currentColor" className="mr-2" />
        <span className="font-mono tracking-[0.2em] uppercase text-xs">Authorize Subscription</span>
      </Button>
      
      <p className="font-mono text-[10px] text-muted/60 text-center uppercase tracking-tighter">
        Zero Spam Policy // End-to-End Respect // Frequency: 1/Week
      </p>
    </form>
  );
}

/*import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Mail, Zap, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscribeToNewsletter } from '../../api/newsletter';
import Button from '../ui/Button';
import Input from '../ui/Input';
//import clsx from 'clsx';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => subscribeToNewsletter({ email }),
    onSuccess: () => {
      setSubscribed(true);
      toast.success('You\'re in! 🎉 Weekly chaos incoming.');
    },
    onError: (err: any) => {
      toast.error(err.friendlyMessage ?? 'Something went wrong. Try again.');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    mutate();
  }

  if (subscribed) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center relative overflow-hidden">
        {/* Animated background *
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-cyan rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="text-6xl animate-bounce">🎉</span>
          <h3 className="font-display text-3xl tracking-widest text-yellow animate-pulse-glow">
            YOU'RE IN.
          </h3>
          <p className="font-mono text-xs text-muted max-w-xs leading-relaxed">
            Weekly feed digest landing in your inbox every Sunday. Prepare yourself for controlled chaos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md relative">
      {/* Decorative elements *
      <div className="absolute -top-8 -right-8 text-yellow opacity-10 animate-spin-slow">
        <Sparkles size={64} />
      </div>

      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        label="Your email"
        icon={<Mail size={14} />}
        required
        className="transition-all duration-fast focus:scale-[1.01]"
      />

      <Button
        type="submit"
        variant="primary"
        loading={isPending}
        fullWidth
        className="gap-2 group"
      >
        <Zap size={14} fill="currentColor" className="group-hover:animate-pulse" />
        Subscribe to the chaos
      </Button>

      <p className="font-mono text-[10px] text-muted text-center leading-relaxed">
        Weekly only. No spam. Unsubscribe anytime.<br />
        We respect your inbox (unlike most newsletters).
      </p>
    </form>
  );
}*/

