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

