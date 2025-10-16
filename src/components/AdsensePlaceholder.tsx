import { DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

type AdsensePlaceholderProps = {
  format?: 'responsive' | 'leaderboard' | 'large-rectangle';
  className?: string;
};

export default function AdsensePlaceholder({ format = 'responsive', className }: AdsensePlaceholderProps) {
  const formatClasses = {
    responsive: 'h-64',
    leaderboard: 'h-[90px] w-[728px] max-w-full',
    'large-rectangle': 'h-[280px] w-[336px] max-w-full',
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center w-full bg-card border-2 border-dashed rounded-lg text-muted-foreground shadow-sm",
      formatClasses[format],
      className
    )}>
      <DollarSign className="w-10 h-10 mb-2 text-primary/50" />
      <p className="text-sm font-medium">Adsense Placeholder</p>
      <p className="text-xs">({format})</p>
    </div>
  );
}
