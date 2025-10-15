import AdsensePlaceholder from '@/components/AdsensePlaceholder';

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        <div className="lg:col-span-2 xl:col-span-3">{children}</div>
        <div className="space-y-8">
          <AdsensePlaceholder />
          <AdsensePlaceholder />
        </div>
      </div>
    </div>
  );
}
