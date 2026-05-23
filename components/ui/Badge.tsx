import { cn } from '@/lib/utils';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'purple' | 'outline';
  className?: string;
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  outline: 'border border-gray-300 text-gray-600 bg-transparent',
};

export function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('badge-base', variantStyles[variant], className)}>{label}</span>
  );
}

export function CollegeTypeBadge({ type }: { type: string }) {
  const variant =
    type === 'Government' ? 'success' : type === 'Private' ? 'info' : 'purple';
  return <Badge label={type} variant={variant} />;
}
