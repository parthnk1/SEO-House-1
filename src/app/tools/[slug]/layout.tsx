import AdsensePlaceholder from '@/components/AdsensePlaceholder';

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-2 xl:col-span-3">{children}</div>
          <div className="space-y-8">
            <AdsensePlaceholder />
            <AdsensePlaceholder />
          </div>
        </div>
      </div>
    </div>
  );
}
