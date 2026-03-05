import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Lightbulb, TrendingUp, Calendar, Sparkles, Binary } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchInsights } from '../../api/insights';
import { useTrends } from '../../hooks/useTrends';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { formatFullDate } from '../../utils/formatDate';
import { getTrendStatusColor } from '../../utils/categoryColors';
//import clsx from 'clsx';
import type { Insight } from '../../types/index';

const TYPE_THEMES = {
  pattern: 'border-cyan text-cyan bg-cyan/5',
  anomaly: 'border-coral text-coral bg-coral/5',
  prediction: 'border-cat-ai text-cat-ai bg-cat-ai/5',
  summary: 'border-purple text-purple bg-purple/5',
};

export default function InsightDetailPanel({ insightId, onClose }: { insightId: string | null; onClose: () => void }) {
  const { data: insights = [] } = useQuery({ 
    queryKey: ['insights'], 
    queryFn: () => fetchInsights({}),
    enabled: !!insightId 
  });

  const insight = insights.find((i: Insight) => i._id === insightId);
  const { data: allTrends = [] } = useTrends();
  const isOpen = !!insightId;

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const relatedTrends = insight 
    ? allTrends.filter(t => insight.relatedTrends.includes(t._id)) 
    : [];

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <aside className="relative w-full max-w-xl bg-surface border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        {!insight ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <Spinner size="lg" />
            <span className="font-mono text-xs text-muted animate-pulse">DECRYPTING INSIGHT...</span>
          </div>
        ) : (
          <>
            <header className="p-6 border-b border-border space-y-4">
              <div className="flex items-start justify-between">
                <Badge label={insight.type} className={TYPE_THEMES[insight.type]} variant="subtle" />
                <button onClick={onClose} className="p-2 hover:bg-surface-2 rounded-full transition-colors">
                  <X size={20} className="text-muted" />
                </button>
              </div>
              <h2 className="text-2xl font-display font-bold text-primary">{insight.title}</h2>
              <div className="flex gap-6 border-y border-border/50 py-3">
                <div className="space-y-1">
                  <span className="block font-mono text-[9px] text-muted uppercase tracking-widest">Signal Timestamp</span>
                  <span className="font-mono text-xs text-secondary flex items-center gap-1.5">
                    <Calendar size={12} /> {formatFullDate(insight.createdAt)}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block font-mono text-[9px] text-muted uppercase tracking-widest">Algorithmic Tone</span>
                  <span className="font-mono text-xs text-secondary flex items-center gap-1.5 capitalize">
                    <Sparkles size={12} /> {insight.tone}
                  </span>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <Lightbulb size={16} className="text-purple-500" />
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em]">Analysis Overview</h3>
                </div>
                <p className="font-ui text-base leading-relaxed text-secondary bg-surface-2/50 p-4 rounded-md border border-border/50">
                  {insight.body}
                </p>
              </section>

              {insight.data && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Binary size={16} className="text-cyan" />
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.2em]">Telemetry Data</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-1 border border-border rounded-md overflow-hidden">
                    {Object.entries(insight.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-3 bg-surface-2/30 even:bg-transparent text-xs font-mono">
                        <span className="text-muted lowercase">{key}</span>
                        <span className="text-primary">{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {relatedTrends.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <TrendingUp size={16} className="text-coral" />
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.2em]">Cross-Reference Clusters</h3>
                  </div>
                  <div className="space-y-2">
                    {relatedTrends.map(trend => (
                      <div key={trend._id} className="p-3 border border-border hover:border-primary/30 transition-colors bg-bg/50 rounded flex justify-between items-center">
                        <span className="font-display text-sm tracking-widest uppercase">{trend.keyword}</span>
                        <Badge label={trend.status} color={getTrendStatusColor(trend.status)} variant="subtle" />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <footer className="p-6 bg-surface border-t border-border">
              <Button fullWidth onClick={onClose} variant="secondary" className="font-mono text-[10px] tracking-[0.3em] uppercase">
                Terminate Session
              </Button>
            </footer>
          </>
        )}
      </aside>
    </div>,
    document.body
  );
}
