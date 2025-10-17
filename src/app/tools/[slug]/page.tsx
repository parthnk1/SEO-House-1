

import { toolCategories, Tool } from '@/lib/tools';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
import BulkDomainRatingChecker from '@/components/BulkDomainRatingChecker';
import IndexPagesChecker from '@/components/IndexPagesChecker';
import SpamScoreChecker from '@/components/SpamScoreChecker';
import ComparisonSearch from '@/components/ComparisonSearch';
import PageAuthorityChecker from '@/components/PageAuthorityChecker';
import MozrankChecker from '@/components/MozrankChecker';
import GoogleIndexChecker from '@/components/GoogleIndexChecker';
import AlexaRankChecker from '@/components/AlexaRankChecker';
import RedirectChecker from '@/components/RedirectChecker';
import CloakingChecker from '@/components/CloakingChecker';
import GoogleMalwareChecker from '@/components/GoogleMalwareChecker';
import FindFacebookId from '@/components/FindFacebookId';
import CheckGzipCompression from '@/components/CheckGzipCompression';
import SslChecker from '@/components/SslChecker';
import FindBlogSites from '@/components/FindBlogSites';
import AppsRankTrackingTool from '@/components/AppsRankTrackingTool';

const toolContent: Record<string, { title: string; content: string }> = {
    'meta-tag-generator': {
        title: 'Why is a Meta Tag Generator Important for SEO?',
        content: `
            <p>In the world of search engine optimization (SEO), meta tags are a fundamental component of on-page optimization. They are snippets of text that describe a page's content; they don't appear on the page itself but only in the page's source code. Meta tags are essentially little content descriptors that help tell search engines what a web page is about.</p>
            <p>The two most important meta tags for SEO are the <strong>title tag</strong> and the <strong>meta description</strong>. The title tag is the main headline that appears in search engine results pages (SERPs), and it's also shown in the browser tab. The meta description is the short paragraph of text that appears under the title in search results. While not a direct ranking factor, a well-written meta description can significantly improve your click-through rate (CTR).</p>
            <h2 class="font-headline text-primary">How Our Meta Tag Generator Works</h2>
            <p>Our AI-powered Meta Tag Generator takes the guesswork out of creating optimized meta tags. Simply enter the URL of the page you want to optimize, and our tool will analyze its content to generate a compelling title and description. It identifies the main keywords and themes of your page to craft tags that are not only relevant but also designed to attract clicks from your target audience. This saves you time and helps ensure you're putting your best foot forward in the SERPs.</p>
        `
    },
    'keyword-position': {
        title: 'The Importance of Tracking Your Keyword Position',
        content: `
            <p>Understanding where your website ranks for specific keywords is one of the most critical aspects of any successful SEO strategy. Your keyword position, or ranking, determines your visibility in search engine results pages (SERPs). The higher you rank, the more likely users are to find and click on your website. In fact, the first page of Google receives over 90% of all search traffic, so if you're not on page one, you're missing out on a significant amount of potential visitors.</p>
            <p>Tracking your keyword positions allows you to measure the effectiveness of your SEO efforts. Are the changes you're making to your website having a positive impact? Are you ranking for the keywords that are most valuable to your business? Answering these questions is impossible without consistent rank tracking. It helps you identify which keywords are performing well, which ones need more attention, and where new opportunities lie.</p>
            <h2 class="font-headline text-primary">Using Our Keyword Position Checker</h2>
            <p>Our Keyword Position Checker is a simple yet powerful tool that allows you to check your website's ranking for a specific keyword. By entering your URL and the keyword you want to track, our tool will scan the search results to find your position. This provides you with a quick snapshot of your performance, allowing you to make informed decisions about your SEO strategy. Regularly checking your keyword positions is key to staying ahead of the competition and ensuring your website continues to climb the ranks.</p>
        `
    },
    'backlink-checker': {
        title: 'Why a Backlink Checker is an Essential SEO Tool',
        content: `
            <p>Backlinks, which are links from other websites to yours, are one of the most important ranking factors for search engines like Google. They act as a vote of confidence, indicating to search engines that your content is valuable and trustworthy. The more high-quality backlinks you have, the higher your website is likely to rank in search results. This is why a backlink checker is an indispensable tool for anyone serious about SEO.</p>
            <p>A backlink checker allows you to see which websites are linking to you. This information is crucial for several reasons. Firstly, it helps you understand your own link profile. Are you getting links from authoritative websites in your niche? Or are you accumulating low-quality, spammy links that could potentially harm your rankings? Secondly, a backlink checker enables you to analyze your competitors' backlink profiles. By seeing who is linking to them, you can identify new link-building opportunities for your own site.</p>
            <h2 class="font-headline text-primary">Leverage Our Free Backlink Checker</h2>
            <p>Our free Backlink Checker tool gives you a clear view of the backlinks pointing to any URL. Simply enter a domain, and our tool will provide you with a list of backlinks, including the source URL, the anchor text used, and the domain authority of the linking site. This data empowers you to assess the quality of your backlinks, discover new link-building prospects by spying on your competitors, and build a robust backlink strategy that will propel your website to the top of the search results.</p>
        `
    }
};

type ToolPageProps = {
  params: { slug: string };
};

function ToolContent({ tool }: { tool: Tool }) {
    const content = toolContent[tool.slug];
    if (!content) return null;

    return (
        <Card className="mt-12">
            <CardHeader>
                <CardTitle className="text-3xl font-headline text-primary">{content.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose lg:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
            </CardContent>
        </Card>
    );
}

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
      case 'bulk-domain-rating-checker':
        return <BulkDomainRatingChecker />;
      case 'index-pages-checker':
        return <IndexPagesChecker />;
      case 'spam-score-checker':
        return <SpamScoreChecker />;
      case 'comparison-search':
        return <ComparisonSearch />;
      case 'page-authority-checker':
        return <PageAuthorityChecker />;
      case 'mozrank-checker':
        return <MozrankChecker />;
      case 'google-index-checker':
        return <GoogleIndexChecker />;
      case 'alexa-rank-checker':
        return <AlexaRankChecker />;
      case 'redirect-checker':
        return <RedirectChecker />;
      case 'cloaking-checker':
        return <CloakingChecker />;
      case 'google-malware-checker':
        return <GoogleMalwareChecker />;
      case 'find-facebook-id':
        return <FindFacebookId />;
      case 'check-gzip-compression':
        return <CheckGzipCompression />;
      case 'ssl-checker':
        return <SslChecker />;
      case 'find-blog-sites':
        return <FindBlogSites />;
      case 'apps-rank-tracking-tool':
        return <AppsRankTrackingTool />;
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
      <ToolContent tool={tool} />
    </div>
  );
}

export async function generateStaticParams() {
  const allTools = toolCategories.flatMap(category => category.tools);
  return allTools.map(tool => ({
    slug: tool.slug,
  }));
}
