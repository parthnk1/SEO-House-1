'use server';

import { generateMetaTags, type GenerateMetaTagsInput, type GenerateMetaTagsOutput } from '@/ai/flows/generate-meta-tags';
import { checkKeywordPosition, type CheckKeywordPositionInput, type CheckKeywordPositionOutput } from '@/ai/flows/check-keyword-position';
import { checkKeywordDensity, type CheckKeywordDensityInput, type CheckKeywordDensityOutput } from '@/ai/flows/check-keyword-density';
import { getKeywordSuggestions, type GetKeywordSuggestionsInput, type GetKeywordSuggestionsOutput } from '@/ai/flows/get-keyword-suggestions';
import { keywordResearch, type KeywordResearchInput, type KeywordResearchOutput } from '@/ai/flows/keyword-research';
import { checkKeywordCompetition, type CheckKeywordCompetitionInput, type CheckKeywordCompetitionOutput } from '@/ai/flows/check-keyword-competition';
import { findRelatedKeywords, type FindRelatedKeywordsInput, type FindRelatedKeywordsOutput } from '@/ai/flows/find-related-keywords';
import { getLongTailKeywordSuggestions, type GetLongTailKeywordSuggestionsInput, type GetLongTailKeywordSuggestionsOutput } from '@/ai/flows/get-long-tail-keyword-suggestions';
import { getKeywordRichDomains, type GetKeywordRichDomainsInput, type GetKeywordRichDomainsOutput } from '@/ai/flows/get-keyword-rich-domains';
import { backlinkChecker, type BacklinkCheckerInput, type BacklinkCheckerOutput } from '@/ai/flows/backlink-checker';
import { backlinkMaker, type BacklinkMakerInput, type BacklinkMakerOutput } from '@/ai/flows/backlink-maker';
import { seoKeywordCompetitionAnalysis, type SeoKeywordCompetitionAnalysisInput, type SeoKeywordCompetitionAnalysisOutput } from '@/ai/flows/seo-keyword-competition-analysis';
import { liveKeywordAnalyzer, type LiveKeywordAnalyzerInput, type LiveKeywordAnalyzerOutput } from '@/ai/flows/live-keyword-analyzer';
import { keywordOverview, type KeywordOverviewInput, type KeywordOverviewOutput } from '@/ai/flows/keyword-overview';
import { keywordDifficultyChecker, type KeywordDifficultyCheckerInput, type KeywordDifficultyCheckerOutput } from '@/ai/flows/keyword-difficulty-checker';
import { paidKeywordFinder, type PaidKeywordFinderInput, type PaidKeywordFinderOutput } from '@/ai/flows/paid-keyword-finder';
import { websiteLinkCountChecker, type WebsiteLinkCountCheckerInput, type WebsiteLinkCountCheckerOutput } from '@/ai/flows/website-link-count-checker';
import { websiteBrokenLinkChecker, type WebsiteBrokenLinkCheckerInput, type WebsiteBrokenLinkCheckerOutput } from '@/ai/flows/website-broken-link-checker';
import { linkPriceCalculator, type LinkPriceCalculatorInput, type LinkPriceCalculatorOutput } from '@/ai/flows/link-price-calculator';
import { reciprocalLinkChecker, type ReciprocalLinkCheckerInput, type ReciprocalLinkCheckerOutput } from '@/ai/flows/reciprocal-link-checker';
import { websiteSeoScoreChecker, type WebsiteSeoScoreCheckerInput, type WebsiteSeoScoreCheckerOutput } from '@/ai/flows/website-seo-score-checker';
import { googlePagerankChecker, type GooglePagerankCheckerInput, type GooglePagerankCheckerOutput } from '@/ai/flows/google-pagerank-checker';
import { onlinePingWebsiteTool, type OnlinePingWebsiteToolInput, type OnlinePingWebsiteToolOutput } from '@/ai/flows/online-ping-website-tool';
import { websiteLinkAnalyzerTool, type WebsiteLinkAnalyzerToolInput, type WebsiteLinkAnalyzerToolOutput } from '@/ai/flows/website-link-analyzer-tool';
import { brokenBacklinkChecker, type BrokenBacklinkCheckerInput, type BrokenBacklinkCheckerOutput } from '@/ai-flows/broken-backlink-checker';
import { valuableBacklinkChecker, type ValuableBacklinkCheckerInput, type ValuableBacklinkCheckerOutput } from '@/ai-flows/valuable-backlink-checker';
import { backlinksCompetitors, type BacklinksCompetitorsInput, type BacklinksCompetitorsOutput } from '@/ai/flows/backlinks-competitors';
import { anchorTextDistribution, type AnchorTextDistributionInput, type AnchorTextDistributionOutput } from '@/ai/flows/anchor-text-distribution';
import { pageSpeedTest, type PageSpeedTestInput, type PageSpeedTestOutput } from '@/ai/flows/page-speed-test';
import { websitePageSizeChecker, type WebsitePageSizeCheckerInput, type WebsitePageSizeCheckerOutput } from '@/ai/flows/website-page-size-checker';
import { websitePageSnooper, type WebsitePageSnooperOutput, type WebsitePageSnooperInput } from '@/ai/flows/website-page-snooper';
import { xmlSitemapGenerator, type XmlSitemapGeneratorInput, type XmlSitemapGeneratorOutput } from '@/ai/flows/xml-sitemap-generator';
import { urlRewritingTool, type UrlRewritingToolInput, type UrlRewritingToolOutput } from '@/ai/flows/url-rewriting-tool';
import { adsenseCalculator, type AdsenseCalculatorInput, type AdsenseCalculatorOutput } from '@/ai/flows/adsense-calculator';
import { openGraphGenerator, type OpenGraphGeneratorInput, type OpenGraphGeneratorOutput } from '@/ai/flows/open-graph-generator';
import { metaTagsAnalyzer, type MetaTagsAnalyzerInput, type MetaTagsAnalyzerOutput } from '@/ai/flows/meta-tags-analyzer';
import { openGraphChecker, type OpenGraphCheckerInput, type OpenGraphCheckerOutput } from '@/ai/flows/open-graph-checker';
import { getHttpHeaders, type GetHttpHeadersInput, type GetHttpHeadersOutput } from '@/ai-flows/get-http-headers';
import { reverseIpLookup, type ReverseIpLookupInput, type ReverseIpLookupOutput } from '@/ai/flows/reverse-ip-lookup';
import { checkServerStatus, type CheckServerStatusInput, type CheckServerStatusOutput } from '@/ai/flows/check-server-status';
import { codeToTextRatioChecker, type CodeToTextRatioCheckerInput, type CodeToTextRatioCheckerOutput } from '@/ai/flows/code-to-text-ratio-checker';
import { alexaRankComparison, type AlexaRankComparisonInput, type AlexaRankComparisonOutput } from '@/ai/flows/alexa-rank-comparison';
import { pageComparison, type PageComparisonInput, type PageComparisonOutput } from '@/ai/flows/page-comparison';
import { spiderSimulator, type SpiderSimulatorInput, type SpiderSimulatorOutput } from '@/ai/flows/spider-simulator';
import { whoisLookup, type WhoisLookupInput, type WhoisLookupOutput } from '@/ai/flows/whois-lookup';
import { googleCacheChecker, type GoogleCacheCheckerInput, type GoogleCacheCheckerOutput } from '@/ai/flows/google-cache-checker';
import { domainAgeChecker, type DomainAgeCheckerInput, type DomainAgeCheckerOutput } from '@/ai/flows/domain-age-checker';
import { domainAuthorityChecker, type DomainAuthorityCheckerInput, type DomainAuthorityCheckerOutput } from '@/ai/flows/domain-authority-checker';
import { domainIpLookup, type DomainIpLookupInput, type DomainIpLookupOutput } from '@/ai/flows/domain-ip-lookup';
import { essayChecker, type EssayCheckerInput, type EssayCheckerOutput } from '@/ai/flows/essay-checker';
import { createTrackedLink, type CreateTrackedLinkInput, type TrackedLink } from '@/ai/flows/link-tracker';
import { classCIpChecker, type ClassCIpCheckerInput, type ClassCIpCheckerOutput } from '@/ai/flows/class-c-ip-checker';


export async function generateMetaTagsAction(
  input: GenerateMetaTagsInput
): Promise<{ success: true, data: GenerateMetaTagsOutput } | { success: false, error: string }> {
  try {
    const result = await generateMetaTags(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating meta tags:', error);
    return { success: false, error: 'Failed to generate meta tags. Please check the URL and try again.' };
  }
}

export async function checkKeywordPositionAction(
  input: CheckKeywordPositionInput
): Promise<{ success: true, data: CheckKeywordPositionOutput } | { success: false, error: string }> {
  try {
    const result = await checkKeywordPosition(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking keyword position:', error);
    return { success: false, error: 'Failed to check keyword position. Please try again later.' };
  }
}

export async function checkKeywordDensityAction(
  input: CheckKeywordDensityInput
): Promise<{ success: true, data: CheckKeywordDensityOutput } | { success: false, error: string }> {
  try {
    const result = await checkKeywordDensity(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking keyword density:', error);
    return { success: false, error: 'Failed to check keyword density. Please try again later.' };
  }
}


export async function getKeywordSuggestionsAction(
  input: GetKeywordSuggestionsInput
): Promise<{ success: true, data: GetKeywordSuggestionsOutput } | { success: false, error: string }> {
  try {
    const result = await getKeywordSuggestions(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting keyword suggestions:', error);
    return { success: false, error: 'Failed to get keyword suggestions. Please try again later.' };
  }
}

export async function keywordResearchAction(
    input: KeywordResearchInput
  ): Promise<{ success: true, data: KeywordResearchOutput } | { success: false, error: string }> {
    try {
      const result = await keywordResearch(input);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error performing keyword research:', error);
      return { success: false, error: 'Failed to perform keyword research. Please try again later.' };
    }
}

export async function checkKeywordCompetitionAction(
    input: CheckKeywordCompetitionInput
): Promise<{ success: true, data: CheckKeywordCompetitionOutput } | { success: false, error: string }> {
    try {
        const result = await checkKeywordCompetition(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error checking keyword competition:', error);
        return { success: false, error: 'Failed to check keyword competition. Please try again later.' };
    }
}

export async function findRelatedKeywordsAction(
  input: FindRelatedKeywordsInput
): Promise<{ success: true, data: FindRelatedKeywordsOutput } | { success: false, error: string }> {
  try {
    const result = await findRelatedKeywords(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error finding related keywords:', error);
    return { success: false, error: 'Failed to find related keywords. Please try again later.' };
  }
}

export async function getLongTailKeywordSuggestionsAction(
  input: GetLongTailKeywordSuggestionsInput
): Promise<{ success: true, data: GetLongTailKeywordSuggestionsOutput } | { success: false, error: string }> {
  try {
    const result = await getLongTailKeywordSuggestions(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting long-tail keyword suggestions:', error);
    return { success: false, error: 'Failed to get long-tail keyword suggestions. Please try again later.' };
  }
}

export async function getKeywordRichDomainsAction(
  input: GetKeywordRichDomainsInput
): Promise<{ success: true, data: GetKeywordRichDomainsOutput } | { success: false, error: string }> {
  try {
    const result = await getKeywordRichDomains(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting keyword rich domains:', error);
    return { success: false, error: 'Failed to get keyword rich domains. Please try again later.' };
  }
}

export async function backlinkCheckerAction(
  input: BacklinkCheckerInput
): Promise<{ success: true, data: BacklinkCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await backlinkChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking backlinks:', error);
    return { success: false, error: 'Failed to check backlinks. Please try again later.' };
  }
}

export async function backlinkMakerAction(
  input: BacklinkMakerInput
): Promise<{ success: true, data: BacklinkMakerOutput } | { success: false, error: string }> {
  try {
    const result = await backlinkMaker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error making backlinks:', error);
    return { success: false, error: 'Failed to make backlinks. Please try again later.' };
  }
}

export async function seoKeywordCompetitionAnalysisAction(
    input: SeoKeywordCompetitionAnalysisInput
  ): Promise<{ success: true, data: SeoKeywordCompetitionAnalysisOutput } | { success: false, error: string }> {
    try {
      const result = await seoKeywordCompetitionAnalysis(input);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error performing SEO keyword competition analysis:', error);
      return { success: false, error: 'Failed to perform SEO keyword competition analysis. Please try again later.' };
    }
}

export async function liveKeywordAnalyzerAction(
    input: LiveKeywordAnalyzerInput
  ): Promise<{ success: true, data: LiveKeywordAnalyzerOutput } | { success: false, error: string }> {
    try {
      const result = await liveKeywordAnalyzer(input);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error analyzing keywords:', error);
      return { success: false, error: 'Failed to analyze keywords. Please try again later.' };
    }
}

export async function keywordOverviewAction(
    input: KeywordOverviewInput
    ): Promise<{ success: true, data: KeywordOverviewOutput } | { success: false, error: string }> {
    try {
        const result = await keywordOverview(input);
        return { success: true, data: result };
    } catch (error)
    {
        console.error('Error getting keyword overview:', error);
        return { success: false, error: 'Failed to get keyword overview. Please try again later.' };
    }
}

export async function keywordDifficultyCheckerAction(
    input: KeywordDifficultyCheckerInput
    ): Promise<{ success: true, data: KeywordDifficultyCheckerOutput } | { success: false, error: string }> {
    try {
        const result = await keywordDifficultyChecker(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error getting keyword difficulty:', error);
        return { success: false, error: 'Failed to get keyword difficulty. Please try again later.' };
    }
}

export async function paidKeywordFinderAction(
  input: PaidKeywordFinderInput
): Promise<{ success: true, data: PaidKeywordFinderOutput } | { success: false, error: string }> {
  try {
    const result = await paidKeywordFinder(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error finding paid keywords:', error);
    return { success: false, error: 'Failed to find paid keywords. Please try again later.' };
  }
}

export async function websiteLinkCountCheckerAction(
  input: WebsiteLinkCountCheckerInput
): Promise<{ success: true, data: WebsiteLinkCountCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await websiteLinkCountChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking link count:', error);
    return { success: false, error: 'Failed to check link count. Please try again later.' };
  }
}

export async function websiteBrokenLinkCheckerAction(
    input: WebsiteBrokenLinkCheckerInput
): Promise<{ success: true, data: WebsiteBrokenLinkCheckerOutput } | { success: false, error: string }> {
    try {
        const result = await websiteBrokenLinkChecker(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error checking broken links:', error);
        return { success: false, error: 'Failed to check broken links. Please try again later.' };
    }
}

export async function linkPriceCalculatorAction(
  input: LinkPriceCalculatorInput
): Promise<{ success: true, data: LinkPriceCalculatorOutput } | { success: false, error: string }> {
  try {
    const result = await linkPriceCalculator(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error calculating link price:', error);
    return { success: false, error: 'Failed to calculate link price. Please try again later.' };
  }
}

export async function reciprocalLinkCheckerAction(
  input: ReciprocalLinkCheckerInput
): Promise<{ success: true, data: ReciprocalLinkCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await reciprocalLinkChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking reciprocal links:', error);
    return { success: false, error: 'Failed to check reciprocal links. Please try again later.' };
  }
}

export async function websiteSeoScoreCheckerAction(
    input: WebsiteSeoScoreCheckerInput
): Promise<{ success: true, data: WebsiteSeoScoreCheckerOutput } | { success: false, error: string }> {
    try {
        const result = await websiteSeoScoreChecker(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error checking SEO score:', error);
        return { success: false, error: 'Failed to check SEO score. Please try again later.' };
    }
}

export async function googlePagerankCheckerAction(
    input: GooglePagerankCheckerInput
): Promise<{ success: true, data: GooglePagerankCheckerOutput } | { success: false, error: string }> {
    try {
        const result = await googlePagerankChecker(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error checking PageRank:', error);
        return { success: false, error: 'Failed to check PageRank. Please try again later.' };
    }
}

export async function onlinePingWebsiteToolAction(
    input: OnlinePingWebsiteToolInput
): Promise<{ success: true, data: OnlinePingWebsiteToolOutput } | { success: false, error: string }> {
    try {
        const result = await onlinePingWebsiteTool(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error pinging website:', error);
        return { success: false, error: 'Failed to ping website. Please try again later.' };
    }
}

export async function websiteLinkAnalyzerToolAction(
    input: WebsiteLinkAnalyzerToolInput
): Promise<{ success: true, data: WebsiteLinkAnalyzerToolOutput } | { success: false, error: string }> {
    try {
        const result = await websiteLinkAnalyzerTool(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error analyzing links:', error);
        return { success: false, error: 'Failed to analyze links. Please try again later.' };
    }
}

export async function brokenBacklinkCheckerAction(
  input: BrokenBacklinkCheckerInput
): Promise<{ success: true, data: BrokenBacklinkCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await brokenBacklinkChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking broken backlinks:', error);
    return { success: false, error: 'Failed to check broken backlinks. Please try again later.' };
  }
}

export async function valuableBacklinkCheckerAction(
    input: ValuableBacklinkCheckerInput
  ): Promise<{ success: true, data: ValuableBacklinkCheckerOutput } | { success: false, error: string }> {
    try {
      const result = await valuableBacklinkChecker(input);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error checking valuable backlinks:', error);
      return { success: false, error: 'Failed to check valuable backlinks. Please try again later.' };
    }
  }

export async function backlinksCompetitorsAction(
  input: BacklinksCompetitorsInput
): Promise<{ success: true, data: BacklinksCompetitorsOutput } | { success: false, error: string }> {
  try {
    const result = await backlinksCompetitors(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing competitor backlinks:', error);
    return { success: false, error: 'Failed to analyze competitor backlinks. Please try again later.' };
  }
}

export async function anchorTextDistributionAction(
  input: AnchorTextDistributionInput
): Promise<{ success: true, data: AnchorTextDistributionOutput } | { success: false, error: string }> {
  try {
    const result = await anchorTextDistribution(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing anchor text distribution:', error);
    return { success: false, error: 'Failed to analyze anchor text. Please try again later.' };
  }
}

export async function pageSpeedTestAction(
  input: PageSpeedTestInput
): Promise<{ success: true, data: PageSpeedTestOutput } | { success: false, error: string }> {
  try {
    const result = await pageSpeedTest(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error testing page speed:', error);
    return { success: false, error: 'Failed to test page speed. Please try again later.' };
  }
}

export async function websitePageSizeCheckerAction(
  input: WebsitePageSizeCheckerInput
): Promise<{ success: true, data: WebsitePageSizeCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await websitePageSizeChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking page size:', error);
    return { success: false, error: 'Failed to check page size. Please try again later.' };
  }
}

export async function websitePageSnooperAction(
  input: WebsitePageSnooperInput
): Promise<{ success: true, data: WebsitePageSnooperOutput } | { success: false, error: string }> {
  try {
    const result = await websitePageSnooper(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error snooping on page:', error);
    return { success: false, error: 'Failed to snoop on page. Please try again later.' };
  }
}

export async function xmlSitemapGeneratorAction(
  input: XmlSitemapGeneratorInput
): Promise<{ success: true, data: XmlSitemapGeneratorOutput } | { success: false, error: string }> {
  try {
    const result = await xmlSitemapGenerator(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return { success: false, error: 'Failed to generate sitemap. Please try again later.' };
  }
}

export async function urlRewritingToolAction(
  input: UrlRewritingToolInput
): Promise<{ success: true, data: UrlRewritingToolOutput } | { success: false, error: string }> {
  try {
    const result = await urlRewritingTool(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error rewriting URL:', error);
    return { success: false, error: 'Failed to rewrite URL. Please try again later.' };
  }
}

export async function adsenseCalculatorAction(
  input: AdsenseCalculatorInput
): Promise<{ success: true, data: AdsenseCalculatorOutput } | { success: false, error: string }> {
  try {
    const result = await adsenseCalculator(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error calculating AdSense earnings:', error);
    return { success: false, error: 'Failed to calculate earnings. Please try again later.' };
  }
}

export async function openGraphGeneratorAction(
  input: OpenGraphGeneratorInput
): Promise<{ success: true, data: OpenGraphGeneratorOutput } | { success: false, error: string }> {
  try {
    const result = await openGraphGenerator(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating Open Graph tags:', error);
    return { success: false, error: 'Failed to generate Open Graph tags. Please try again later.' };
  }
}

export async function metaTagsAnalyzerAction(
  input: MetaTagsAnalyzerInput
): Promise<{ success: true, data: MetaTagsAnalyzerOutput } | { success: false, error: string }> {
  try {
    const result = await metaTagsAnalyzer(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing meta tags:', error);
    return { success: false, error: 'Failed to analyze meta tags. Please try again later.' };
  }
}

export async function openGraphCheckerAction(
  input: OpenGraphCheckerInput
): Promise<{ success: true, data: OpenGraphCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await openGraphChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking Open Graph tags:', error);
    return { success: false, error: 'Failed to check Open Graph tags. Please try again later.' };
  }
}

export async function getHttpHeadersAction(
  input: GetHttpHeadersInput
): Promise<{ success: true, data: GetHttpHeadersOutput } | { success: false, error: string }> {
  try {
    const result = await getHttpHeaders(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting HTTP headers:', error);
    return { success: false, error: 'Failed to get HTTP headers. Please try again later.' };
  }
}

export async function reverseIpLookupAction(
  input: ReverseIpLookupInput
): Promise<{ success: true, data: ReverseIpLookupOutput } | { success: false, error: string }> {
  try {
    const result = await reverseIpLookup(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error performing reverse IP lookup:', error);
    return { success: false, error: 'Failed to perform reverse IP lookup. Please try again later.' };
  }
}

export async function checkServerStatusAction(
  input: CheckServerStatusInput
): Promise<{ success: true, data: CheckServerStatusOutput } | { success: false, error: string }> {
  try {
    const result = await checkServerStatus(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking server status:', error);
    return { success: false, error: 'Failed to check server status. Please try again later.' };
  }
}

export async function codeToTextRatioCheckerAction(
  input: CodeToTextRatioCheckerInput
): Promise<{ success: true, data: CodeToTextRatioCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await codeToTextRatioChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking code to text ratio:', error);
    return { success: false, error: 'Failed to check code to text ratio. Please try again later.' };
  }
}

export async function alexaRankComparisonAction(
  input: AlexaRankComparisonInput
): Promise<{ success: true, data: AlexaRankComparisonOutput } | { success: false, error: string }> {
  try {
    const result = await alexaRankComparison(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error comparing Alexa ranks:', error);
    return { success: false, error: 'Failed to compare Alexa ranks. Please try again later.' };
  }
}

export async function pageComparisonAction(
    input: PageComparisonInput
  ): Promise<{ success: true, data: PageComparisonOutput } | { success: false, error: string }> {
    try {
      const result = await pageComparison(input);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error comparing pages:', error);
      return { success: false, error: 'Failed to compare pages. Please try again later.' };
    }
  }

export async function spiderSimulatorAction(
  input: SpiderSimulatorInput
): Promise<{ success: true, data: SpiderSimulatorOutput } | { success: false, error: string }> {
  try {
    const result = await spiderSimulator(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error running spider simulator:', error);
    return { success: false, error: 'Failed to run spider simulator. Please try again later.' };
  }
}

export async function whoisLookupAction(
  input: WhoisLookupInput
): Promise<{ success: true, data: WhoisLookupOutput } | { success: false, error: string }> {
  try {
    const result = await whoisLookup(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error performing WHOIS lookup:', error);
    return { success: false, error: 'Failed to perform WHOIS lookup. Please try again later.' };
  }
}

export async function googleCacheCheckerAction(
  input: GoogleCacheCheckerInput
): Promise<{ success: true, data: GoogleCacheCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await googleCacheChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking Google cache:', error);
    return { success: false, error: 'Failed to check Google cache. Please try again later.' };
  }
}

export async function domainAgeCheckerAction(
  input: DomainAgeCheckerInput
): Promise<{ success: true, data: DomainAgeCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await domainAgeChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking domain age:', error);
    return { success: false, error: 'Failed to check domain age. Please try again later.' };
  }
}

export async function domainAuthorityCheckerAction(
  input: DomainAuthorityCheckerInput
): Promise<{ success: true, data: DomainAuthorityCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await domainAuthorityChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking domain authority:', error);
    return { success: false, error: 'Failed to check domain authority. Please try again later.' };
  }
}

export async function domainIpLookupAction(
  input: DomainIpLookupInput
): Promise<{ success: true, data: DomainIpLookupOutput } | { success: false, error: string }> {
  try {
    const result = await domainIpLookup(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error looking up domain IP:', error);
    return { success: false, error: 'Failed to look up domain IP. Please try again later.' };
  }
}

export async function essayCheckerAction(
  input: EssayCheckerInput
): Promise<{ success: true, data: EssayCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await essayChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking essay:', error);
    return { success: false, error: 'Failed to check essay. Please try again later.' };
  }
}


export async function createTrackedLinkAction(
    input: CreateTrackedLinkInput
  ): Promise<{ success: true, data: TrackedLink } | { success: false, error: string }> {
    try {
      const result = await createTrackedLink(input);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating tracked link:', error);
      return { success: false, error: 'Failed to create tracked link. Please try again later.' };
    }
}

export async function classCIpCheckerAction(
  input: ClassCIpCheckerInput
): Promise<{ success: true, data: ClassCIpCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await classCIpChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking Class C IP:', error);
    return { success: false, error: 'Failed to check Class C IP. Please try again later.' };
  }
}
