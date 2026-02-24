import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, TrendingUp, BarChart3, Clock, User as UserIcon } from 'lucide-react';
import { useHeadlineDetail } from '../../hooks/useHeadlines';
import { useTrends } from '../../hooks/useTrends';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { formatFullDate } from '../../utils/formatDate';
import { getCategoryColor } from '../../utils/categoryColors';
//import clsx from 'clsx';

export default function ArticleDetailPanel({ headlineId, onClose }: { headlineId: string | null; onClose: () => void }) {
  const { data: headline, isLoading } = useHeadlineDetail(headlineId);
  const { data: allTrends = [] } = useTrends();
  const isOpen = !!headlineId;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const relatedTrends = headline 
    ? allTrends.filter(t => headline.keywords.some(kw => kw.toLowerCase().includes(t.keyword.toLowerCase()))).slice(0, 4)
    : [];

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <aside className="relative w-full max-w-xl bg-surface border-l border-border shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-500">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center"><Spinner size="lg" /></div>
        ) : headline ? (
          <>
            <header className="p-6 border-b border-border space-y-4">
              <div className="flex justify-between items-center">
                <Badge label={headline.source} color={getCategoryColor(headline.source)} variant="outline" />
                <button onClick={onClose} className="p-2 hover:bg-surface-2 transition-colors"><X size={20} /></button>
              </div>
              <h2 className="font-display text-3xl leading-none uppercase italic tracking-tighter">{headline.title}</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {headline.imageUrl && (
                <img src={headline.imageUrl} className="w-full aspect-video object-cover border border-border grayscale hover:grayscale-0 transition-all duration-700" alt="" />
              )}

              <div className="grid grid-cols-2 gap-px bg-border border border-border">
                <MetaItem icon={<Clock size={12}/>} label="Timestamp" value={formatFullDate(headline.publishedAt)} />
                <MetaItem icon={<UserIcon size={12}/>} label="Source Agent" value={headline.author || 'Anonymous'} />
              </div>

              <div className="space-y-3">
                <h3 className="font-mono text-[10px] uppercase tracking-[.2em] text-muted flex items-center gap-2">
                  <BarChart3 size={14} /> Intelligence Summary
                </h3>
                <p className="font-serif text-lg leading-relaxed text-secondary italic">"{headline.summary}"</p>
              </div>

              {relatedTrends.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-mono text-[10px] uppercase tracking-[.2em] text-muted flex items-center gap-2">
                    <TrendingUp size={14} /> Correlated Vectors
                  </h3>
                  <div className="grid gap-2">
                    {relatedTrends.map(t => (
                      <div key={t._id} className="p-3 border border-border bg-bg flex justify-between items-center group hover:border-primary transition-colors">
                        <span className="font-mono text-xs uppercase text-primary">#{t.keyword}</span>
                        <span className="font-mono text-[9px] text-muted uppercase tracking-tighter">{t.velocity.toFixed(1)}v/h</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <footer className="p-6 border-t border-border bg-surface-2">
              <Button variant="primary" fullWidth onClick={() => window.open(headline.url, '_blank')} className="gap-2">
                <ExternalLink size={16} /> Open External Source
              </Button>
            </footer>
          </>
        ) : null}
      </aside>
    </div>,
    document.body
  );
}

const MetaItem = ({ icon, label, value }: any) => (
  <div className="bg-surface p-3">
    <div className="flex items-center gap-2 text-muted mb-1 uppercase font-mono text-[8px] tracking-widest">
      {icon} {label}
    </div>
    <div className="font-mono text-[10px] text-primary truncate">{value}</div>
  </div>
);


/*import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, TrendingUp, BarChart3 } from 'lucide-react';
import { useHeadlineDetail } from '../../hooks/useHeadlines';
import { useTrends } from '../../hooks/useTrends';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { formatFullDate } from '../../utils/formatDate';
import { getCategoryColor, getSentimentColor } from '../../utils/categoryColors';
//import { getSourceColor } from '../../utils';
import clsx from 'clsx';

interface ArticleDetailPanelProps {
  headlineId: string | null;
  onClose: () => void;
}

export default function ArticleDetailPanel({
  headlineId,
  onClose,
}: ArticleDetailPanelProps) {
  const { data: headline, isLoading } = useHeadlineDetail(headlineId);
  const { data: allTrends = [] } = useTrends();
  //const { mutate: trackClick } = useTrackClick();

  const isOpen = !!headlineId;
  const sourceColor = headline ? getCategoryColor(headline.source) : undefined;

  /* Track click when panel opens
  useEffect(() => {
    if (headlineId) {
      trackClick(headlineId);
    }
  }, [headlineId, trackClick]);

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

  // Find related trends based on keywords
  const relatedTrends = headline
    ? allTrends.filter(trend =>
        headline.keywords.some(kw => kw.toLowerCase().includes(trend.keyword.toLowerCase()))
      ).slice(0, 5)
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
          // Slide animation
          'animate-[slideInRight_300ms_ease-out]'
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" />
          </div>
        ) : headline ? (
          <div className="flex flex-col min-h-full">
            {/* Header *
            <header
              className="sticky top-0 z-10 bg-surface/95 backdrop-blur-md border-b border-border p-4"
              style={{
                borderTopColor: sourceColor,
                borderTopWidth: '3px',
                borderTopStyle: 'solid',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-mono text-[10px] font-semibold tracking-wider uppercase"
                      style={{ color: sourceColor ?? 'var(--color-text-muted)' }}
                    >
                      {headline.source}
                    </span>
                    {headline.category && (
                      <Badge
                        label={headline.category}
                        color={getCategoryColor(headline.category)}
                        variant="subtle"
                      />
                    )}
                  </div>
                  <h2 className="font-ui font-bold text-base text-primary leading-tight">
                    {headline.title}
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

            {/* Content 
            <div className="flex-1 p-6 space-y-6">
              {/* Image *
              {headline.imageUrl && (
                <div className="w-full aspect-video rounded-md overflow-hidden bg-surface-2 border border-border">
                  <img
                    src={headline.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Metadata grid *
              <div className="grid grid-cols-2 gap-3 p-4 bg-bg rounded-md border border-border">
                <div>
                  <p className="font-mono text-[9px] text-muted tracking-widest uppercase mb-1">
                    Published
                  </p>
                  <p className="font-mono text-xs text-secondary">
                    {formatFullDate(headline.publishedAt)}
                  </p>
                </div>
                {headline.author && (
                  <div>
                    <p className="font-mono text-[9px] text-muted tracking-widest uppercase mb-1">
                      Author
                    </p>
                    <p className="font-mono text-xs text-secondary truncate">
                      {headline.author}
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-mono text-[9px] text-muted tracking-widest uppercase mb-1">
                    Sentiment
                  </p>
                  {headline.sentiment && (
                    <Badge
                      label={headline.sentiment}
                      color={getSentimentColor(headline.sentiment)}
                      variant="subtle"
                    />
                  )}
                </div>
                <div>
                  <p className="font-mono text-[9px] text-muted tracking-widest uppercase mb-1">
                    Engagement
                  </p>
                  <p className="font-mono text-xs text-secondary">
                    {headline.metadata.clicks} {headline.metadata.clicks === 1 ? 'view' : 'views'}
                  </p>
                </div>
              </div>

              {/* Summary *
              {headline.summary && (
                <div>
                  <h3 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2 flex items-center gap-1.5">
                    <BarChart3 size={12} />
                    Summary
                  </h3>
                  <p className="font-ui text-sm text-secondary leading-relaxed">
                    {headline.summary}
                  </p>
                </div>
              )}

              {/* Keywords *
              {headline.keywords.length > 0 && (
                <div>
                  <h3 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {headline.keywords.map((keyword, i) => (
                      <span
                        key={keyword}
                        className="font-mono text-xs text-secondary bg-surface-2 px-2 py-1 rounded-sm border border-border hover:border-yellow hover:text-yellow transition-all duration-fast cursor-default"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
                        className="flex items-center justify-between p-3 bg-surface-2 rounded-sm border border-border hover:border-yellow/30 transition-all duration-fast"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-sm text-primary tracking-wider uppercase">
                            {trend.keyword}
                          </p>
                          <p className="font-mono text-[10px] text-muted">
                            {trend.count} mentions • {trend.velocity.toFixed(1)}/day
                          </p>
                        </div>
                        <Badge
                          label={trend.status}
                          color={
                            trend.status === 'rising' ? 'var(--color-green)' :
                            trend.status === 'peak' ? 'var(--color-yellow)' :
                            'var(--color-coral)'
                          }
                          variant="subtle"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with CTA *
            <footer className="sticky bottom-0 p-4 bg-surface/95 backdrop-blur-md border-t border-border">
              <Button
                variant="primary"
                fullWidth
                onClick={() => window.open(headline.url, '_blank')}
                className="gap-2"
              >
                <ExternalLink size={14} />
                Read Full Article on {headline.source}
              </Button>
            </footer>
          </div>
        ) : null}
      </aside>
    </>,
    document.body
  );
}*/