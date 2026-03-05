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
