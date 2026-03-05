import SubscribeForm from '../components/newsletter/SubscribeForm';
import { Newspaper, BarChart3, Lightbulb, Bell } from 'lucide-react';

export default function NewsletterPage() {
  const features = [
    { icon: <Newspaper size={18} />, text: 'Curated intel from 15+ global sources' },
    { icon: <BarChart3 size={18} />, text: 'Trend velocity and pattern detection' },
    { icon: <Lightbulb size={18} />, text: 'Algorithmic insights and predictions' },
    { icon: <Bell size={18} />, text: 'Every Sunday, 09:00 UTC. Zero noise.' },
  ];

  return (
    <div className="flex flex-col gap-12 max-w-2xl mx-auto py-12 px-4">
      <header className="border-l-4 border-violet-600 pl-8 py-2">
        <h1 className="font-display text-6xl tracking-tighter uppercase italic leading-none">
          THE <span className="text-purple-500">WEEKLY</span>
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground mt-4 uppercase tracking-[0.3em]">
          Signal delivery direct to your terminal.
        </p>
      </header>

      <div className="grid gap-10">
        <div className="grid gap-4">
          {features.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-border bg-muted/5 group hover:border-violet-500/50 transition-colors">
              <div className="text-violet-500">{item.icon}</div>
              <p className="font-mono text-[11px] text-foreground/80 uppercase tracking-tight">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-card border-2 border-foreground p-8 relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(124,58,237,0.1)]">
          <div className="relative z-10">
            <h2 className="font-display text-2xl mb-6 uppercase italic tracking-tighter">Initialize Subscription</h2>
            <SubscribeForm />
          </div>
          <div className="absolute top-[-20px] right-[-30px] text-[120px] font-display text-foreground/[0.03] pointer-events-none select-none">
            @
          </div>
        </div>
      </div>
    </div>
  );
}
