import { toolCategories } from '@/lib/tools';
import { notFound } from 'next/navigation';
import MetaTagGenerator from '@/components/MetaTagGenerator';
import KeywordPositionChecker from '@/components/KeywordPositionChecker';
import KeywordDensityChecker from '@/components/KeywordDensityChecker';
import KeywordSuggestionsTool from '@/components/KeywordSuggestionsTool';
import KeywordResearchTool from '@/components/KeywordResearchTool';
import KeywordCompetitionTool from '@/components/KeywordCompetitionTool';
import RelatedKeywordsFinder from '@/components/RelatedKeywordsFinder';
import LongTailKeywordSuggestionTool from '@/components/LongTailKeywordSuggestionTool';
import KeywordRichDomainsSuggestionsTool from '@/components/KeywordRichDomainsSuggestionsTool';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import BacklinkChecker from '@/components/BacklinkChecker';
import BacklinkMaker from '@/components/BacklinkMaker';

type ToolPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: ToolPageProps) {
  const tool = toolCategories.flatMap(category => category.tools).find(t => t.slug === params.slug);

  if (!tool) {
    return {
      title: 'Tool not found',
    }
  }

  return {
    title: `${tool.name} | SEO Powerhouse`,
    description: tool.description,
  }
}


export default function ToolPage({ params }: ToolPageProps) {
  const tool = toolCategories.flatMap(category => category.tools).find(t => t.slug === params.slug);

  if (!tool) {
    notFound();
  }

  const renderTool = () => {
    switch (tool.slug) {
      case 'meta-tag-generator':
        return <MetaTagGenerator />;
      case 'keyword-position':
        return <KeywordPositionChecker />;
      case 'keywords-density-checker':
        return <KeywordDensityChecker />;
      case 'keywords-suggestions-tool':
        return <KeywordSuggestionsTool />;
      case 'keyword-research-tool':
        return <KeywordResearchTool />;
      case 'keyword-competition-tool':
        return <KeywordCompetitionTool />;
      case 'related-keywords-finder':
        return <RelatedKeywordsFinder />;
      case 'long-tail-keyword-suggestion-tool':
        return <LongTailKeywordSuggestionTool />;
      case 'keywords-rich-domains-suggestions-tool':
        return <KeywordRichDomainsSuggestionsTool />;
      case 'backlink-checker':
        return <BacklinkChecker />;
      case 'backlink-maker':
        return <BacklinkMaker />;
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl h-96 bg-card">
            <tool.icon className="w-16 h-16 mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">Tool interface for <span className="font-semibold text-foreground">{tool.name}</span> coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
                <tool.icon className="w-8 h-8 text-primary" />
            </div>
            <div>
                <h1 className="text-4xl font-bold font-headline text-primary">{tool.name}</h1>
                <p className="text-lg text-muted-foreground mt-1">{tool.description}</p>
            </div>
        </div>
      </div>
      {renderTool()}
    </div>
  );
}

export async function generateStaticParams() {
  const allTools = toolCategories.flatMap(category => category.tools);
  return allTools.map(tool => ({
    slug: tool.slug,
  }));
}
