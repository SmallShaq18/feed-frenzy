import { useState } from 'react';
import { RefreshCw, Mail, Send } from 'lucide-react';
import { useScrapingStats, useTriggerScrape, useTriggerInsightGeneration, useTriggerTrendDetection } from '../hooks/useScraperStats';
import { useSubscribers } from '../hooks/useSubscribers';
import { useMutation } from '@tanstack/react-query';
import { sendTestNewsletter } from '../api/newsletter';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import { formatRelativeDate } from '../utils/formatDate';
//import { triggerInsightGeneration } from '../api/insights';

export default function AdminPage() {
  const { data: stats, isLoading } = useScrapingStats();
  const { data: subscriberData } = useSubscribers();
  const { mutate: triggerScrape, isPending: isScraping } = useTriggerScrape();
  const { mutate: triggerInsightGeneration, isPending: isGeneratingInsights } = useTriggerInsightGeneration();
  const { mutate: triggerTrendDetection, isPending: isDetectingTrends } = useTriggerTrendDetection();

  const [testEmail, setTestEmail] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);

  const { mutate: sendTest, isPending: isSendingTest } = useMutation({
    mutationFn: () => sendTestNewsletter(testEmail),
    onSuccess: () => {
      toast.success(`✅ Test newsletter sent to ${testEmail}`);
      setShowTestModal(false);
      setTestEmail('');
    },
    onError: () => {
      toast.error('Failed to send test newsletter');
    },
  });

  function handleSendTest() {
    if (!testEmail) return;
    sendTest();
  }

  return (
    <>
      <div className="flex flex-col gap-10 max-w-7xl mx-auto">
        <header className="border-l-4 border-violet-600 pl-6 py-2 flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all">
          <div>
            <h1 className="font-display text-6xl tracking-tighter uppercase italic leading-[0.8]">
              SYSTEM <span className="text-transparent border-v-stroke">ROOT</span>
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">
              Security Level: Elevated // Node: {window.location.hostname}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <Button variant="secondary" size="md" onClick={() => setShowTestModal(true)} className="font-mono text-[10px] tracking-tighter uppercase border-border">
              <Mail size={14} className="mr-2 text-violet-500" /> Test Newsletter
            </Button>
            <Button variant="primary" size="md" onClick={() => triggerScrape()} loading={isScraping} className="font-mono text-[10px] tracking-tighter uppercase bg-violet-600 hover:bg-violet-700 text-white">
              <RefreshCw size={14} className={`mr-2 ${isScraping ? 'animate-spin' : ''}`} /> Run Scraper
            </Button>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <Button variant="primary" size="md" onClick={() => triggerInsightGeneration()} loading={isGeneratingInsights} className="font-mono text-[10px] tracking-tighter uppercase bg-violet-600 hover:bg-violet-700 text-white">
              <RefreshCw size={14} className={`mr-2 ${isGeneratingInsights ? 'animate-spin' : ''}`} /> Generate Insights
            </Button>
            <Button variant="primary" size="md" onClick={() => triggerTrendDetection()} loading={isDetectingTrends} className="font-mono text-[10px] tracking-tighter uppercase bg-violet-600 hover:bg-violet-700 text-white">
              <RefreshCw size={14} className={`mr-2 ${isDetectingTrends ? 'animate-spin' : ''}`} /> Detect Trends
            </Button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" className="text-violet-600" />
            <span className="font-mono text-[10px] animate-pulse">SYNCHRONIZING DATABASE...</span>
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Scraper & Newsletter Stats */}
            <div className="lg:col-span-8 space-y-10">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">Scraper.Logs</h2>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                  <Card className="bg-muted/20 border-border p-6 rounded-none">
                    <p className="font-mono text-[9px] text-muted-foreground uppercase mb-4 tracking-tighter">Indices Processed</p>
                    <p className="font-display text-5xl text-violet-600">{stats.totalHeadlines.toLocaleString()}</p>
                  </Card>
                  <Card className="bg-muted/20 border-border p-6 rounded-none border-l-0 sm:border-l">
                    <p className="font-mono text-[9px] text-muted-foreground uppercase mb-4 tracking-tighter">Active Vectors</p>
                    <p className="font-display text-5xl">{stats.headlinesBySource.length}</p>
                  </Card>
                  <Card className="bg-muted/20 border-border p-6 rounded-none border-l-0 sm:border-l">
                    <p className="font-mono text-[9px] text-muted-foreground uppercase mb-4 tracking-tighter">Last Sequence</p>
                    <p className="font-mono text-xs mt-4 uppercase text-foreground/80">{stats.lastScrapedAt ? formatRelativeDate(stats.lastScrapedAt) : 'VOID'}</p>
                  </Card>
                </div>
              </section>

              {subscriberData && (
                
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">Network.Subscribers</h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="border-b-2 border-border pb-4">
                      <span className="font-mono text-[9px] text-muted-foreground block uppercase">Total</span>
                      <span className="font-display text-3xl">{subscriberData.total}</span>
                    </div>
                    <div className="border-b-2 border-emerald-500 pb-4">
                      <span className="font-mono text-[9px] text-emerald-500 block uppercase">Active</span>
                      <span className="font-display text-3xl text-emerald-500">{subscriberData.active}</span>
                    </div>
                    <div className="border-b-2 border-red-500 pb-4">
                      <span className="font-mono text-[9px] text-red-500 block uppercase">Dropped</span>
                      <span className="font-display text-3xl text-red-500">{subscriberData.unsubscribed}</span>
                    </div>
                  </div>
                </section>
              )}
              </div>

            {/* Right Col: Source Breakdown Visualization */}
            <aside className="lg:col-span-4 bg-card border border-border p-6">
              <h2 className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-8 border-b border-border pb-2 flex justify-between">
                Source.Dist <span>Vol %</span>
              </h2>
              <div className="space-y-5">
                {stats.headlinesBySource.slice(0, 12).map(({ source, count }) => {
                  const max = stats.headlinesBySource[0].count;
                  const pct = (count / max) * 100;
                  return (
                    <div key={source} className="group">
                      <div className="flex justify-between font-mono text-[10px] mb-1 uppercase tracking-tighter">
                        <span className="text-foreground/70 group-hover:text-violet-500 transition-colors">{source}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-[2px] w-full bg-muted/30">
                        <div className="h-full bg-violet-600 transition-all duration-1000" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Test Newsletter Modal */}
      <Modal
        open={showTestModal}
        onClose={() => setShowTestModal(false)}
        title="Send Test Newsletter"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs text-secondary">
            Send a test version of the weekly newsletter to see how it looks.
          </p>

          <Input
            type="email"
            placeholder="your@email.com"
            value={testEmail}
            onChange={e => setTestEmail(e.target.value)}
            label="Recipient Email"
            icon={<Mail size={14} />}
          />

          <Button
            variant="primary"
            fullWidth
            onClick={handleSendTest}
            loading={isSendingTest}
            disabled={!testEmail}
            className="gap-2"
          >
            <Send size={14} />
            Send Test
          </Button>
        </div>
      </Modal>
    </>
  );
}







