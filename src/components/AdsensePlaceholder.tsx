import { DollarSign } from 'lucide-react';

export default function AdsensePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-64 bg-card border-2 border-dashed rounded-lg text-muted-foreground shadow-sm">
      <DollarSign className="w-10 h-10 mb-2 text-primary/50" />
      <p className="text-sm font-medium">Adsense Placeholder</p>
    </div>
  );
}
