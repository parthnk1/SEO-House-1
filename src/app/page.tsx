'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toolCategories, ToolCategory } from '@/lib/tools';
import { ArrowRight, Search as SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';

function useSafeUser() {
  try {
    return useUser();
  } catch (e) {
    // This can happen if Firebase is not configured.
    // In that case, we can't use auth, so we return a dummy object.
    return { user: null, login: () => {} };
  }
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, login } = useSafeUser();

  const filteredCategories = useMemo(() => {
    if (!searchQuery) {
      return toolCategories;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered: ToolCategory[] = [];

    toolCategories.forEach(category => {
      const filteredTools = category.tools.filter(
        tool =>
          tool.name.toLowerCase().includes(lowercasedQuery) ||
          tool.description.toLowerCase().includes(lowercasedQuery)
      );

      if (filteredTools.length > 0) {
        filtered.push({ ...category, tools: filteredTools });
      }
    });

    return filtered;
  }, [searchQuery]);

  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          
          {/* Search Bar */}
          <section className="my-12" id="tools">
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search a tool by name or keyword..."
                className="w-full pl-12 h-14 text-base rounded-full shadow-inner bg-background border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for a tool"
              />
            </div>
          </section>

          {/* Tool Sections */}
          <div className="space-y-12">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <section key={category.name}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-muted-foreground mt-1">{category.description}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {category.tools.map(tool => (
                      <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card rounded-xl">
                          <CardHeader className="bg-primary p-6 h-28 flex items-center justify-center rounded-t-xl">
                            <tool.icon className="w-10 h-10 text-primary-foreground" />
                          </CardHeader>
                          <CardContent className="p-4 text-center">
                            <h3 className="font-semibold text-base">{tool.name}</h3>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-xl font-medium">No tools found for "{searchQuery}"</p>
                <p className="text-muted-foreground mt-2">Try searching for something else.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
