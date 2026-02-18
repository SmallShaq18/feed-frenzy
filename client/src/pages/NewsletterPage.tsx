import SubscribeForm from '../components/newsletter/SubscribeForm';

export default function NewsletterPage() {
  return (
    <div className="flex flex-col gap-8 max-w-xl mx-auto">
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-5xl tracking-widest text-primary leading-none">
          NEWSLETTER
        </h1>
        <p className="font-mono text-xs text-muted mt-1">
          The week's biggest trends. Delivered Sunday morning.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Value props */}
        {[
          { icon: '📰', text: 'Top headlines from 15+ sources' },
          { icon: '📊', text: 'Trend analysis and velocity data' },
          { icon: '💡', text: 'Auto-generated insights and patterns' },
          { icon: '📅', text: 'Every Sunday, 9AM. Never more.' },
        ].map(item => (
          <div key={item.text} className="flex items-center gap-3">
            <span className="text-xl">{item.icon}</span>
            <p className="font-mono text-xs text-secondary">{item.text}</p>
          </div>
        ))}

        <div className="border-t border-border pt-6">
          <SubscribeForm />
        </div>
      </div>
    </div>
  );
}