
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
import SeoKeywordCompetitionAnalysis from '@/components/SeoKeywordCompetitionAnalysis';
import LiveKeywordAnalyzer from '@/components/LiveKeywordAnalyzer';
import KeywordOverviewTool from '@/components/KeywordOverviewTool';
import KeywordDifficultyChecker from '@/components/KeywordDifficultyChecker';
import PaidKeywordFinder from '@/components/PaidKeywordFinder';
import WebsiteLinkCountChecker from '@/components/WebsiteLinkCountChecker';
import WebsiteBrokenLinkChecker from '@/components/WebsiteBrokenLinkChecker';
import LinkPriceCalculator from '@/components/LinkPriceCalculator';
import ReciprocalLinkChecker from '@/components/ReciprocalLinkChecker';
import WebsiteSeoScoreChecker from '@/components/WebsiteSeoScoreChecker';
import GooglePagerankChecker from '@/components/GooglePagerankChecker';
import OnlinePingWebsiteTool from '@/components/OnlinePingWebsiteTool';
import WebsiteLinkAnalyzerTool from '@/components/WebsiteLinkAnalyzerTool';
import BrokenBacklinkChecker from '@/components/BrokenBacklinkChecker';
import ValuableBacklinkChecker from '@/components/ValuableBacklinkChecker';
import BacklinksCompetitors from '@/components/BacklinksCompetitors';
import AnchorTextDistribution from '@/components/AnchorTextDistribution';
import PageSpeedTest from '@/components/PageSpeedTest';
import WebsitePageSizeChecker from '@/components/WebsitePageSizeChecker';
import WebsitePageSnooper from '@/components/WebsitePageSnooper';
import XmlSitemapGenerator from '@/components/XmlSitemapGenerator';
import UrlRewritingTool from '@/components/UrlRewritingTool';
import UrlEncoderDecoder from '@/components/UrlEncoderDecoder';
import AdsenseCalculator from '@/components/AdsenseCalculator';
import OpenGraphGenerator from '@/components/OpenGraphGenerator';
import MetaTagsAnalyzer from '@/components/MetaTagsAnalyzer';
import WhatIsMyScreenResolution from '@/components/WhatIsMyScreenResolution';
import OpenGraphChecker from '@/components/OpenGraphChecker';
import QrCodeGenerator from '@/components/QrCodeGenerator';
import GetHttpHeaders from '@/components/GetHttpHeaders';
import ReverseIpLookup from '@/components/ReverseIpLookup';
import CheckServerStatus from '@/components/CheckServerStatus';
import CodeToTextRatioChecker from '@/components/CodeToTextRatioChecker';
import AlexaRankComparison from '@/components/AlexaRankComparison';
import PageComparison from '@/components/PageComparison';
import SpiderSimulator from '@/components/SpiderSimulator';
import WhoisLookup from '@/components/WhoisLookup';
import GoogleCacheChecker from '@/components/GoogleCacheChecker';
import DomainAgeChecker from '@/components/DomainAgeChecker';
import DomainAuthorityChecker from '@/components/DomainAuthorityChecker';
import DomainIpLookup from '@/components/DomainIpLookup';
import EssayChecker from '@/components/EssayChecker';
import HtaccessRedirectGenerator from '@/components/HtaccessRedirectGenerator';
import LinkTracker from '@/components/LinkTracker';
import ClassCIpChecker from '@/components/ClassCIpChecker';
import PasswordGenerator from '@/components/PasswordGenerator';
import SimilarSiteChecker from '@/components/SimilarSiteChecker';
import DomainHostingChecker from '@/components/DomainHostingChecker';
import FindDnsRecords from '@/components/FindDnsRecords';
import DomainToIp from '@/components/DomainToIp';
import CheckBlacklistIp from '@/components/CheckBlacklistIp';
import FindExpiredDomains from '@/components/FindExpiredDomains';

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
      case 'seo-keyword-competition-analysis':
        return <SeoKeywordCompetitionAnalysis />;
      case 'live-keyword-analyzer':
        return <LiveKeywordAnalyzer />;
      case 'keyword-overview-tool':
        return <KeywordOverviewTool />;
      case 'keyword-difficulty-checker':
        return <KeywordDifficultyChecker />;
      case 'paid-keyword-finder':
        return <PaidKeywordFinder />;
      case 'website-link-count-checker':
        return <WebsiteLinkCountChecker />;
      case 'website-broken-link-checker':
        return <WebsiteBrokenLinkChecker />;
      case 'link-price-calculator':
        return <LinkPriceCalculator />;
      case 'reciprocal-link-checker':
        return <ReciprocalLinkChecker />;
      case 'website-seo-score-checker':
        return <WebsiteSeoScoreChecker />;
      case 'google-pagerank-checker':
        return <GooglePagerankChecker />;
      case 'online-ping-website-tool':
        return <OnlinePingWebsiteTool />;
      case 'website-link-analyzer-tool':
        return <WebsiteLinkAnalyzerTool />;
      case 'broken-backlink-checker':
        return <BrokenBacklinkChecker />;
      case 'valuable-backlink-checker':
        return <ValuableBacklinkChecker />;
      case 'backlinks-competitors':
        return <BacklinksCompetitors />;
      case 'anchor-text-distribution':
        return <AnchorTextDistribution />;
      case 'page-speed-test':
        return <PageSpeedTest />;
      case 'website-page-size-checker':
        return <WebsitePageSizeChecker />;
      case 'website-page-snooper':
        return <WebsitePageSnooper />;
      case 'xml-sitemap-generator':
        return <XmlSitemapGenerator />;
      case 'url-rewriting-tool':
        return <UrlRewritingTool />;
      case 'url-encoder-decoder':
        return <UrlEncoderDecoder />;
      case 'adsense-calculator':
        return <AdsenseCalculator />;
      case 'open-graph-generator':
        return <OpenGraphGenerator />;
      case 'meta-tags-analyzer':
        return <MetaTagsAnalyzer />;
      case 'what-is-my-screen-resolution':
        return <WhatIsMyScreenResolution />;
      case 'open-graph-checker':
        return <OpenGraphChecker />;
      case 'qr-code-generator':
        return <QrCodeGenerator />;
      case 'get-http-headers':
        return <GetHttpHeaders />;
      case 'reverse-ip-lookup':
        return <ReverseIpLookup />;
      case 'check-server-status':
        return <CheckServerStatus />;
      case 'code-to-text-ratio-checker':
        return <CodeToTextRatioChecker />;
      case 'alexa-rank-comparison':
        return <AlexaRankComparison />;
      case 'page-comparison':
        return <PageComparison />;
      case 'spider-simulator':
        return <SpiderSimulator />;
      case 'whois-lookup':
        return <WhoisLookup />;
      case 'google-cache-checker':
        return <GoogleCacheChecker />;
      case 'domain-age-checker':
        return <DomainAgeChecker />;
      case 'domain-authority-checker':
        return <DomainAuthorityChecker />;
      case 'domain-ip-lookup':
        return <DomainIpLookup />;
      case 'essay-checker':
        return <EssayChecker />;
      case 'htaccess-redirect-generator':
        return <HtaccessRedirectGenerator />;
      case 'link-tracker':
        return <LinkTracker />;
      case 'class-c-ip-checker':
        return <ClassCIpChecker />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'similar-site-checker':
        return <SimilarSiteChecker />;
      case 'domain-hosting-checker':
        return <DomainHostingChecker />;
      case 'find-dns-records':
        return <FindDnsRecords />;
      case 'domain-to-ip':
        return <DomainToIp />;
      case 'check-blacklist-ip':
        return <CheckBlacklistIp />;
      case 'find-expired-domains':
        return <FindExpiredDomains />;
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
