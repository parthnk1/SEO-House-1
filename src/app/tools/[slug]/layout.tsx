import AdsensePlaceholder from '@/components/AdsensePlaceholder';

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          {children}
          <div className="mt-8">
            <AdsensePlaceholder />
          </div>
        </div>
      </div>
    </div>
  );
}
