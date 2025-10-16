import AdsensePlaceholder from '@/components/AdsensePlaceholder';

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg h-full">
                    {children}
                </div>
            </div>
            <div className="hidden lg:flex flex-col gap-8">
                <AdsensePlaceholder format="large-rectangle" />
                <AdsensePlaceholder format="large-rectangle" />
            </div>
        </div>
      </div>
    </div>
  );
}
