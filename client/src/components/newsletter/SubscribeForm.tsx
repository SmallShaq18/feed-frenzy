import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Mail, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscribeToNewsletter } from '../../api/subscriber';
import Button from '../ui/Button';
import Input from '../ui/Input';

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
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <span className="text-5xl">🎉</span>
        <h3 className="font-display text-2xl tracking-widest text-yellow">
          YOU'RE IN.
        </h3>
        <p className="font-mono text-xs text-muted max-w-xs leading-relaxed">
          Weekly feed digest landing in your inbox every Sunday. Prepare yourself.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        label="Your email"
        icon={<Mail size={14} />}
        required
      />
      <Button
        type="submit"
        variant="primary"
        loading={isPending}
        fullWidth
        className="gap-2"
      >
        <Zap size={14} fill="currentColor" />
        Subscribe to the chaos
      </Button>
      <p className="font-mono text-[10px] text-muted text-center">
        Weekly only. No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}