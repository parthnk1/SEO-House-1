import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-[#F7F8FC]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} The SEO Power House. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
