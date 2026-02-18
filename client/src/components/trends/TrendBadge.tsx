import Badge from '../ui/Badge';
import { getTrendStatusColor } from '../../utils/categoryColors';

interface TrendBadgeProps {
  status: 'rising' | 'peak' | 'declining';
}

const STATUS_LABELS = {
  rising:   '↑ Rising',
  peak:     '● Peak',
  declining:'↓ Fading',
};

export default function TrendBadge({ status }: TrendBadgeProps) {
  return (
    <Badge
      label={STATUS_LABELS[status]}
      color={getTrendStatusColor(status)}
      variant="subtle"
      dot={status === 'rising'}
    />
  );
}