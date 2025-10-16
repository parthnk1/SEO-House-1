import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';
import AdsensePlaceholder from '@/components/AdsensePlaceholder';

export const metadata: Metadata = {
  title: 'Blog | SEO Powerhouse',
  description: 'Articles, tips, and updates from the SEO Powerhouse team.',
};

const placeholderArticles = [
  {
    slug: 'mastering-keyword-research-in-2024',
    title: 'Mastering Keyword Research in 2024',
    description: 'A deep dive into modern keyword research techniques that will get you ahead of the competition.',
    author: 'Jane Doe',
    date: 'October 26, 2023',
    imageUrl: 'https://picsum.photos/seed/blog1/400/250',
    imageHint: 'desk computer',
  },
  {
    slug: 'the-ultimate-guide-to-backlink-building',
    title: 'The Ultimate Guide to Backlink Building',
    description: 'Learn how to build high-quality backlinks that boost your domain authority and search rankings.',
    author: 'John Smith',
    date: 'October 22, 2023',
    imageHint: 'abstract network',
    imageUrl: 'https://picsum.photos/seed/blog2/400/250',
  },
  {
    slug: 'demystifying-on-page-seo',
    title: 'Demystifying On-Page SEO: A Beginner\'s Guide',
    description: 'Everything you need to know to optimize your pages for search engines, from meta tags to content.',
    author: 'Emily White',
    date: 'October 18, 2023',
    imageHint: 'checklist document',
    imageUrl: 'https://picsum.photos/seed/blog3/400/250',
  },
  {
    slug: 'how-page-speed-affects-your-rankings',
    title: 'How Page Speed Affects Your Rankings (and How to Fix It)',
    description: 'A fast website is crucial for SEO. We show you why it matters and how to improve your site\'s performance.',
    author: 'Michael Brown',
    date: 'October 15, 2023',
    imageHint: 'stopwatch speed',
    imageUrl: 'https://picsum.photos/seed/blog4/400/250',
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Our Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Latest news, tips, and insights on SEO and digital marketing.
        </p>
      </div>

      <div className="mb-12 flex justify-center">
        <AdsensePlaceholder format="leaderboard" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {placeholderArticles.map(article => (
          <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
            <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative w-full h-48">
                 <Image src={article.imageUrl} alt={article.title} layout="fill" objectFit="cover" data-ai-hint={article.imageHint} />
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">{article.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-2">
                  <CalendarDays className="w-4 h-4" /> <span>{article.date}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{article.description}</p>
              </CardContent>
              <CardFooter>
                 <span className="text-sm font-semibold text-primary group-hover:underline flex items-center">
                    Read More <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
