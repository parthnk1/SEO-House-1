import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CalendarDays, UserCircle } from 'lucide-react';
import AdsensePlaceholder from '@/components/AdsensePlaceholder';

const placeholderArticles = [
    {
      slug: 'mastering-keyword-research-in-2024',
      title: 'Mastering Keyword Research in 2024',
      description: 'A deep dive into modern keyword research techniques that will get you ahead of the competition.',
      author: 'Jane Doe',
      date: 'October 26, 2023',
      imageUrl: 'https://picsum.photos/seed/blog1/800/400',
      imageHint: 'desk computer',
    },
    {
      slug: 'the-ultimate-guide-to-backlink-building',
      title: 'The Ultimate Guide to Backlink Building',
      description: 'Learn how to build high-quality backlinks that boost your domain authority and search rankings.',
      author: 'John Smith',
      date: 'October 22, 2023',
      imageHint: 'abstract network',
      imageUrl: 'https://picsum.photos/seed/blog2/800/400',
    },
    {
      slug: 'demystifying-on-page-seo',
      title: 'Demystifying On-Page SEO: A Beginner\'s Guide',
      description: 'Everything you need to know to optimize your pages for search engines, from meta tags to content.',
      author: 'Emily White',
      date: 'October 18, 2023',
      imageHint: 'checklist document',
      imageUrl: 'https://picsum.photos/seed/blog3/800/400',
    },
    {
      slug: 'how-page-speed-affects-your-rankings',
      title: 'How Page Speed Affects Your Rankings (and How to Fix It)',
      description: 'A fast website is crucial for SEO. We show you why it matters and how to improve your site\'s performance.',
      author: 'Michael Brown',
      date: 'October 15, 2023',
      imageHint: 'stopwatch speed',
      imageUrl: 'https://picsum.photos/seed/blog4/800/400',
    },
    {
      slug: 'unlocking-digital-success-with-free-seo-tools',
      title: 'Unlock Your Digital Success with the Power of Free SEO Tools',
      description: 'In the competitive digital landscape, leveraging the right tools is not just an advantage; it’s a necessity. This article explores how free SEO tools can revolutionize your online strategy and drive growth.',
      author: 'Alex Johnson',
      date: 'November 2, 2023',
      imageHint: 'digital strategy',
      imageUrl: 'https://picsum.photos/seed/blog5/800/400',
      content: `
        <p>In today's digital-first world, visibility is everything. Search Engine Optimization (SEO) is the cornerstone of a successful online presence, but many businesses, especially startups and small enterprises, are often deterred by the perceived high cost of professional SEO services and premium tools. What if you could significantly boost your website’s performance without a hefty price tag? Enter the world of free SEO tools.</p>
        <p>The digital landscape is teeming with a vast array of sophisticated, free SEO tools that can provide deep insights and actionable data to refine your strategy. From keyword research to backlink analysis, these resources empower you to make data-driven decisions that can catapult your website up the search engine rankings. By understanding and utilizing these tools, you can level the playing field and compete with larger players in your industry.</p>
        <h2 class="font-headline text-primary">The Foundation: Keyword Research Tools</h2>
        <p>It all starts with keywords. Understanding what your potential customers are searching for is fundamental to any SEO strategy. Free keyword research tools, such as Google Keyword Planner, offer a treasure trove of information. They allow you to discover relevant keywords, gauge their search volume, and understand the competition level. This knowledge is crucial for creating content that resonates with your target audience and meets their needs. By targeting the right long-tail keywords, you can attract highly qualified traffic with a strong intent to convert.</p>
        <div class="my-8 flex justify-center">
            <AdsensePlaceholder format="large-rectangle" />
        </div>
        <h2 class="font-headline text-primary">Building Authority: Backlink Analysis</h2>
        <p>Backlinks remain one of the most powerful ranking factors for Google. Free backlink checker tools enable you to analyze your own backlink profile as well as your competitors'. By identifying who links to your competition, you can uncover new opportunities for your own link-building campaigns. Furthermore, monitoring your backlinks helps you identify and disavow toxic links that could harm your site's authority. Consistently building a high-quality backlink portfolio is essential for establishing trust and credibility with search engines.</p>
        <h2 class="font-headline text-primary">Technical SEO and Performance</h2>
        <p>A technically sound website is critical for a good user experience and effective search engine crawling. Free tools like Google's PageSpeed Insights can analyze your website’s performance and provide concrete recommendations for improvement. From optimizing images to leveraging browser caching, these suggestions can dramatically reduce your page load times. A faster website not only improves user satisfaction but is also a confirmed ranking factor. Similarly, tools for checking mobile-friendliness and generating sitemaps ensure that your site is accessible and easily navigable for both users and search engine bots.</p>
        <p>In conclusion, the availability of powerful free SEO tools democratizes the world of digital marketing. They provide the necessary insights to optimize your website, understand your audience, and track your performance against competitors. By embracing these resources, you can build a robust SEO strategy that drives organic growth, increases brand visibility, and achieves sustainable success in the digital arena.</p>
      `
    },
  ];


export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = placeholderArticles.find(a => a.slug === params.slug);
  if (!article) return {}
  return {
    title: `${article.title} | SEO Powerhouse`,
    description: article.description,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const article = placeholderArticles.find(a => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">{article.title}</h1>
          <div className="flex justify-center items-center gap-6 mt-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <UserCircle className="w-5 h-5" />
              <span>By {article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              <span>{article.date}</span>
            </div>
          </div>
        </header>

        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg mb-8">
            <Image src={article.imageUrl} alt={article.title} layout="fill" objectFit="cover" data-ai-hint={article.imageHint} />
        </div>

        <div className="prose lg:prose-xl max-w-none mx-auto"
            dangerouslySetInnerHTML={article.content ? { __html: article.content } : undefined}>
          {!article.content && (
            <>
              <p className="lead text-xl text-muted-foreground">{article.description}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.
              </p>
              <div className="my-8 flex justify-center">
                <AdsensePlaceholder format="large-rectangle" />
              </div>
              <p>
                Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.
              </p>
              <h2 className="font-headline text-primary">A Subheading for the Article</h2>
              <p>
                Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam.
              </p>
            </>
          )}
        </div>
        <div className="mt-8 flex justify-center">
            <AdsensePlaceholder format="leaderboard" />
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
    return placeholderArticles.map(article => ({
      slug: article.slug,
    }));
}
