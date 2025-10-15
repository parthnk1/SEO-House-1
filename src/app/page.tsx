'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toolCategories, ToolCategory } from '@/lib/tools';
import { ArrowRight, Code, FileText, ImageIcon, Search as SearchIcon, Video } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary tracking-tighter">
            Free SEO Tools, All in One Place
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Analyze, Create, Rank — fast and free.
          </p>
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button asChild size="lg">
              <a href="#tools">Explore Tools</a>
            </Button>
            <div className="hidden sm:flex items-center gap-4 text-muted-foreground">
              <ImageIcon className="w-6 h-6" />
              <FileText className="w-6 h-6" />
              <Code className="w-6 h-6" />
              <Video className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="my-12" id="tools">
        <div className="relative max-w-2xl mx-auto">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search a tool by name or keyword..."
            className="w-full pl-10 h-12 text-base rounded-full shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search for a tool"
          />
        </div>
      </section>

      {/* Tool Sections */}
      <div className="space-y-16">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <section key={category.name}>
              <div className="mb-8">
                <h2 className="text-3xl font-bold font-headline">{category.name}</h2>
                <p className="text-muted-foreground mt-2">{category.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.tools.map(tool => (
                  <Card key={tool.slug} className="flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="p-3 bg-accent/10 rounded-lg">
                           <tool.icon className="w-6 h-6 text-accent" />
                        </div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full bg-transparent group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent">
                        <Link href={`/tools/${tool.slug}`}>
                          Use Tool
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
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
  );
}
