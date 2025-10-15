'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, SearchCode } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#tools', label: 'Tools' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href;
    const isScrollLink = href.startsWith('/#');

    const linkClasses = cn(
      "text-sm font-medium transition-colors",
      isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
    );

    if (isScrollLink) {
        return (
             <a href={href} className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>{label}</a>
        );
    }
    
    return (
        <Link href={href} className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
            {label}
        </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <SearchCode className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg font-headline">SEO Powerhouse</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => <NavLink key={link.href} {...link} />)}
        </nav>

        <div className="flex items-center gap-4">
           
            {/* Mobile Navigation */}
            <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right">
                <div className="flex flex-col gap-6 p-6">
                    <Link href="/" className="flex items-center gap-2 mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                        <SearchCode className="h-7 w-7 text-primary" />
                        <span className="font-bold text-lg font-headline">SEO Powerhouse</span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                        {navLinks.map(link => <NavLink key={link.href} {...link} />)}
                    </nav>
                </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
