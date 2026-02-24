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
  summary: 'border-yellow text-yellow bg-yellow/5',
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
                  <Lightbulb size={16} className="text-yellow" />
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

/*import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Lightbulb, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchInsights } from '../../api/insights';
import { useTrends } from '../../hooks/useTrends';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { formatFullDate } from '../../utils/formatDate';
import { getTrendStatusColor } from '../../utils/categoryColors';
import clsx from 'clsx';
import type { Insight } from '../../types/index';

interface InsightDetailPanelProps {
  insightId: string | null;
  onClose: () => void;
}

const INSIGHT_TYPE_COLORS = {
  pattern: 'var(--color-cyan)',
  anomaly: 'var(--color-coral)',
  prediction: 'var(--color-cat-ai)',
  summary: 'var(--color-yellow)',
};

const TONE_EMOJIS = {
  playful: '🎮',
  shocking: '⚡',
  informative: '📊',
};

export default function InsightDetailPanel({
  insightId,
  onClose,
}: InsightDetailPanelProps) {
  // Fetch single insight
  const { data: insights = [] } = useQuery({
    queryKey: ['insights'],
    queryFn: () => fetchInsights({}),
  });

  const insight = insights.find((i: Insight) => i._id === insightId);
  const { data: allTrends = [] } = useTrends();

  const isOpen = !!insightId;
  const typeColor = insight ? INSIGHT_TYPE_COLORS[insight.type] : undefined;

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Get related trend details
  const relatedTrends = insight
    ? allTrends.filter(trend => insight.relatedTrends.includes(trend._id))
    : [];

  return createPortal(
    <>
      {/* Backdrop *
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel *
      <aside
        className={clsx(
          'fixed top-0 right-0 bottom-0 z-50',
          'w-full md:w-[480px] lg:w-[560px]',
          'bg-surface border-l border-border shadow-2xl',
          'overflow-y-auto',
          'animate-[slideInRight_300ms_ease-out]'
        )}
      >
        {!insight ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="flex flex-col min-h-full">
            {/* Header *
            <header
              className="sticky top-0 z-10 bg-surface/95 backdrop-blur-md border-b border-border p-4"
              style={{
                borderTopColor: typeColor,
                borderTopWidth: '3px',
                borderTopStyle: 'solid',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      label={insight.type}
                      color={typeColor}
                      variant="subtle"
                    />
                    {insight.featured && (
                      <div className="flex items-center gap-1 font-mono text-[9px] text-yellow tracking-widest uppercase">
                        <Lightbulb size={10} fill="currentColor" />
                        Featured
                      </div>
                    )}
                  </div>
                  <h2 className="font-ui font-bold text-lg text-primary leading-tight">
                    {insight.title}
                  </h2>
                </div>

                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-1.5 rounded-sm text-muted hover:text-primary hover:bg-surface-2 transition-all duration-fast"
                  aria-label="Close panel"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            {/* Content *
            <div className="flex-1 p-6 space-y-6">
              {/* Metadata grid *
              <div className="grid grid-cols-2 gap-3 p-4 bg-bg rounded-md border border-border">
                <div>
                  <p className="font-mono text-[9px] text-muted tracking-widest uppercase mb-1 flex items-center gap-1">
                    <Calendar size={10} />
                    Created
                  </p>
                  <p className="font-mono text-xs text-secondary">
                    {formatFullDate(insight.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-muted tracking-widest uppercase mb-1 flex items-center gap-1">
                    <Sparkles size={10} />
                    Tone
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{TONE_EMOJIS[insight.tone]}</span>
                    <span className="font-mono text-xs text-secondary capitalize">
                      {insight.tone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main insight body *
              <div>
                <h3 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3 flex items-center gap-1.5">
                  <Lightbulb size={12} />
                  The Insight
                </h3>
                <p className="font-ui text-sm text-primary leading-relaxed whitespace-pre-line">
                  {insight.body}
                </p>
              </div>

              {/* Supporting data visualization *
              <div>
              {insight?.data && Object.keys(insight.data).length > 0 && (
                <div>
                  <h3 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">
                    Supporting Data
                  </h3>
                  <div className="p-4 bg-surface-2 rounded-md border border-border font-mono text-xs">
                    
                    {/* Chart data display *

                    {insight.data.chartData && (
                      <div className="space-y-2">
                        {Object.entries(insight.data.chartData as Record<string, string | number>).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-muted capitalize">{key}:</span>
                            <span className="text-primary font-semibold tabular-nums">
                              {typeof value === 'number' ? value.toFixed(1) : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Other data fields *
                    {Object.entries(insight.data)
                      .filter(([key]) => key !== 'chartData')
                      .map(([key, value]) => (
                        <div key={key} className="mt-3 pt-3 border-t border-border">
                          <p className="text-muted text-[10px] uppercase mb-1">{key}:</p>
                          <p className="text-secondary">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
                </div>

              {/* Related Trends *
              {relatedTrends.length > 0 && (
                <div>
                  <h3 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3 flex items-center gap-1.5">
                    <TrendingUp size={12} />
                    Related Trends
                  </h3>
                  <div className="space-y-2">
                    {relatedTrends.map(trend => (
                      <div
                        key={trend._id}
                        className="flex items-center justify-between p-3 bg-surface-2 rounded-sm border border-border hover:border-yellow/30 transition-all duration-fast group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-sm text-primary tracking-wider uppercase group-hover:text-yellow transition-colors">
                            {trend.keyword}
                          </p>
                          <p className="font-mono text-[10px] text-muted">
                            {trend.count} mentions • {trend.velocity.toFixed(1)}/day
                          </p>
                        </div>
                        <Badge
                          label={trend.status}
                          color={getTrendStatusColor(trend.status)}
                          variant="subtle"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insight metadata *
              <div className="p-4 bg-yellow/5 border border-yellow/20 rounded-md">
                <p className="font-mono text-[10px] text-yellow/80 leading-relaxed">
                  💡 This insight was auto-generated by analyzing {relatedTrends.length} trend
                  {relatedTrends.length !== 1 ? 's' : ''} and their velocity patterns. The system
                  detected this as a <strong className="text-yellow">{insight.type}</strong> worth
                  highlighting.
                </p>
              </div>
            </div>

            {/* Footer *
            <footer className="sticky bottom-0 p-4 bg-surface/95 backdrop-blur-md border-t border-border">
              <Button
                variant="secondary"
                fullWidth
                onClick={onClose}
                className="gap-2"
              >
                Close Insight
              </Button>
            </footer>
          </div>
        )}
      </aside>
    </>,
    document.body
  );
}*/