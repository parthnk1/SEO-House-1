'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, SearchCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';

function AuthButtons() {
    // This will throw an error if Firebase is not configured, so we catch it.
    try {
        const { user, login } = useUser();

        if (user) {
            return (
                <Button variant="outline" size="sm" asChild>
                    <Link href="/tools/link-tracker">Dashboard</Link>
                </Button>
            );
        }

        return (
            <>
                <Button variant="ghost" size="sm" onClick={login}>Log In</Button>
                <Button variant="secondary" size="sm" onClick={login} className='bg-white text-black hover:bg-white/90'>
                    Sign Up
                </Button>
            </>
        );
    } catch (e) {
        // If useFirebase() fails, it means the provider is not there.
        // In this case, we don't render any auth buttons.
        return null;
    }
}

const navLinks = [
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
      isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-primary-foreground"
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-[#1D2335] text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className='bg-primary p-2 rounded-lg'>
            <SearchCode className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg font-headline">Free SEO Tools</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => <NavLink key={link.href} {...link} />)}
        </nav>

        <div className="flex items-center gap-4">
           
            {/* User Auth */}
            <div className="hidden md:flex items-center gap-2">
              <AuthButtons />
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#1D2335] text-primary-foreground border-l-0">
                <div className="flex flex-col gap-6 p-6">
                    <Link href="/" className="flex items-center gap-2 mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                         <div className='bg-primary p-2 rounded-lg'>
                            <SearchCode className="h-6 w-6 text-primary-foreground" />
                         </div>
                        <span className="font-bold text-lg font-headline">Free SEO Tools</span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                        {navLinks.map(link => <NavLink key={link.href} {...link} />)}
                    </nav>
                     <div className="flex flex-col gap-2 mt-4">
                         <AuthButtons />
                    </div>
                </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
