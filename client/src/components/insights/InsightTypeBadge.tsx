import Badge from '../ui/Badge';
import type { InsightType } from '../../types/index';

const TYPE_CONFIG: Record<InsightType, { label: string; color: string }> = {
  pattern:   { label: '⬡ Pattern',   color: 'var(--color-cyan)'    },
  anomaly:   { label: '⚠ Anomaly',   color: 'var(--color-coral)'   },
  prediction:{ label: '◈ Prediction',color: 'var(--color-cat-ai)'  },
  summary:   { label: '≡ Summary',   color: 'var(--color-yellow)'  },
};

export default function InsightTypeBadge({ type }: { type: InsightType }) {
  const { label, color } = TYPE_CONFIG[type] ?? TYPE_CONFIG.summary;
  return <Badge label={label} color={color} variant="subtle" />;
}