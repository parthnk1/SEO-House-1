'use server';

import { generateMetaTags } from '@/ai/flows/generate-meta-tags';
import { checkKeywordPosition } from '@/ai/flows/check-keyword-position';
import { checkKeywordDensity } from '@/ai/flows/check-keyword-density';
import { getKeywordSuggestions } from '@/ai/flows/get-keyword-suggestions';
import { keywordResearch } from '@/ai/flows/keyword-research';
import { checkKeywordCompetition } from '@/ai/flows/check-keyword-competition';
import { findRelatedKeywords } from '@/ai/flows/find-related-keywords';
import { getLongTailKeywordSuggestions } from '@/ai/flows/get-long-tail-keyword-suggestions';
import { getKeywordRichDomains } from '@/ai/flows/get-keyword-rich-domains';
import { backlinkChecker } from '@/ai/flows/backlink-checker';
import { backlinkMaker } from '@/ai/flows/backlink-maker';
import { seoKeywordCompetitionAnalysis } from '@/ai/flows/seo-keyword-competition-analysis';
import { liveKeywordAnalyzer } from '@/ai/flows/live-keyword-analyzer';
import { keywordOverview } from '@/ai/flows/keyword-overview';
import { keywordDifficultyChecker } from '@/ai/flows/keyword-difficulty-checker';
import { paidKeywordFinder } from '@/ai/flows/paid-keyword-finder';
import { websiteLinkCountChecker } from '@/ai/flows/website-link-count-checker';
import { websiteBrokenLinkChecker } from '@/ai/flows/website-broken-link-checker';
import { linkPriceCalculator } from '@/ai/flows/link-price-calculator';
import { reciprocalLinkChecker } from '@/ai/flows/reciprocal-link-checker';
import { websiteSeoScoreChecker } from '@/ai/flows/website-seo-score-checker';
import { googlePagerankChecker } from '@/ai/flows/google-pagerank-checker';
import { onlinePingWebsiteTool } from '@/ai/flows/online-ping-website-tool';
import { websiteLinkAnalyzerTool } from '@/ai/flows/website-link-analyzer-tool';
import { brokenBacklinkChecker } from '@/ai/flows/broken-backlink-checker';
import { valuableBacklinkChecker } from '@/ai/flows/valuable-backlink-checker';
import { backlinksCompetitors } from '@/ai/flows/backlinks-competitors';
import { anchorTextDistribution } from '@/ai/flows/anchor-text-distribution';
import { pageSpeedTest } from '@/ai/flows/page-speed-test';
import { websitePageSizeChecker } from '@/ai/flows/website-page-size-checker';
import { websitePageSnooper } from '@/ai/flows/website-page-snooper';
import { xmlSitemapGenerator } from '@/ai/flows/xml-sitemap-generator';
import { urlRewritingTool } from '@/ai/flows/url-rewriting-tool';
import { adsenseCalculator } from '@/ai/flows/adsense-calculator';
import { openGraphGenerator } from '@/ai/flows/open-graph-generator';
import { metaTagsAnalyzer } from '@/ai/flows/meta-tags-analyzer';
import { openGraphChecker } from '@/ai/flows/open-graph-checker';
import { getHttpHeaders } from '@/ai/flows/get-http-headers';
import { reverseIpLookup } from '@/ai/flows/reverse-ip-lookup';
import { checkServerStatus } from '@/ai/flows/check-server-status';
import { codeToTextRatioChecker } from '@/ai/flows/code-to-text-ratio-checker';
import { alexaRankComparison } from '@/ai/flows/alexa-rank-comparison';
import { pageComparison } from '@/ai/flows/page-comparison';
import { spiderSimulator } from '@/ai/flows/spider-simulator';
import { whoisLookup } from '@/ai/flows/whois-lookup';
import { googleCacheChecker } from '@/ai/flows/google-cache-checker';
import { domainAgeChecker } from '@/ai/flows/domain-age-checker';
import { domainAuthorityChecker } from '@/ai/flows/domain-authority-checker';
import { domainIpLookup } from '@/ai/flows/domain-ip-lookup';
import { essayChecker } from '@/ai/flows/essay-checker';
import { classCIpChecker } from '@/ai/flows/class-c-ip-checker';
import { similarSiteChecker } from '@/ai/flows/similar-site-checker';
import { domainHostingChecker } from '@/ai/flows/domain-hosting-checker';
import { findDnsRecords } from '@/ai/flows/find-dns-records';
import { domainToIp } from '@/ai/flows/domain-to-ip';
import { checkBlacklistIp } from '@/ai/flows/check-blacklist-ip';
import { findExpiredDomains } from '@/ai/flows/find-expired-domains';
import { bulkDomainRatingChecker } from '@/ai/flows/bulk-domain-rating-checker';
import { indexPagesChecker } from '@/ai/flows/index-pages-checker';
import { spamScoreChecker } from '@/ai/flows/spam-score-checker';
import { comparisonSearch } from '@/ai/flows/comparison-search';
import { pageAuthorityChecker } from '@/ai/flows/page-authority-checker';
import { mozrankChecker } from '@/ai/flows/mozrank-checker';
import { googleIndexChecker } from '@/ai/flows/google-index-checker';
import { alexaRankChecker } from '@/ai/flows/alexa-rank-checker';
import { redirectChecker } from '@/ai/flows/redirect-checker';
import { cloakingChecker } from '@/ai/flows/cloaking-checker';
import { googleMalwareChecker } from '@/ai/flows/google-malware-checker';
import { findFacebookId } from '@/ai/flows/find-facebook-id';
import { checkGzipCompression } from '@/ai/flows/check-gzip-compression';
import { sslChecker } from '@/ai/flows/ssl-checker';
import { findBlogSites } from '@/ai/flows/find-blog-sites';
import { appsRankTrackingTool } from '@/ai/flows/apps-rank-tracking-tool';
import { domainNameSearch } from '@/ai/flows/domain-name-search';
import { websiteAnalysis } from '@/ai/flows/website-analysis';

import { type GenerateMetaTagsInput, type GenerateMetaTagsOutput } from '@/ai/flows/generate-meta-tags';
import { type CheckKeywordPositionInput, type CheckKeywordPositionOutput } from '@/ai/flows/check-keyword-position';
import { type CheckKeywordDensityInput, type CheckKeywordDensityOutput } from '@/ai/flows/check-keyword-density';
import { type GetKeywordSuggestionsInput, type GetKeywordSuggestionsOutput } from '@/ai/flows/get-keyword-suggestions';
import { type KeywordResearchInput, type KeywordResearchOutput } from '@/ai/flows/keyword-research';
import { type CheckKeywordCompetitionInput, type CheckKeywordCompetitionOutput } from '@/ai/flows/check-keyword-competition';
import { type FindRelatedKeywordsInput, type FindRelatedKeywordsOutput } from '@/ai/flows/find-related-keywords';
import { type GetLongTailKeywordSuggestionsInput, type GetLongTailKeywordSuggestionsOutput } from '@/ai/flows/get-long-tail-keyword-suggestions';
import { type GetKeywordRichDomainsInput, type GetKeywordRichDomainsOutput } from '@/ai/flows/get-keyword-rich-domains';
import { type BacklinkMakerInput, type BacklinkMakerOutput } from '@/ai/flows/backlink-maker';
import { type SeoKeywordCompetitionAnalysisInput, type SeoKeywordCompetitionAnalysisOutput } from '@/ai/flows/seo-keyword-competition-analysis';
import { type LiveKeywordAnalyzerInput, type LiveKeywordAnalyzerOutput } from '@/ai/flows/live-keyword-analyzer';
import { type KeywordOverviewInput, type KeywordOverviewOutput } from '@/ai/flows/keyword-overview';
import { type KeywordDifficultyCheckerInput, type KeywordDifficultyCheckerOutput } from '@/ai/flows/keyword-difficulty-checker';
import { type PaidKeywordFinderInput, type PaidKeywordFinderOutput } from '@/ai/flows/paid-keyword-finder';
import { type WebsiteLinkCountCheckerInput, type WebsiteLinkCountCheckerOutput } from '@/ai/flows/website-link-count-checker';
import { type WebsiteBrokenLinkCheckerInput, type WebsiteBrokenLinkCheckerOutput } from '@/ai/flows/website-broken-link-checker';
import { type LinkPriceCalculatorInput, type LinkPriceCalculatorOutput } from '@/ai/flows/link-price-calculator';
import { type ReciprocalLinkCheckerInput, type ReciprocalLinkCheckerOutput } from '@/ai/flows/reciprocal-link-checker';
import { type WebsiteSeoScoreCheckerInput, type WebsiteSeoScoreCheckerOutput } from '@/ai/flows/schemas/website-seo-score-checker';
import { type GooglePagerankCheckerInput, type GooglePagerankCheckerOutput } from '@/ai/flows/google-pagerank-checker';
import { type OnlinePingWebsiteToolInput, type OnlinePingWebsiteToolOutput } from '@/ai/flows/online-ping-website-tool';
import { type WebsiteLinkAnalyzerToolInput, type WebsiteLinkAnalyzerToolOutput } from '@/ai/flows/website-link-analyzer-tool';
import { type BrokenBacklinkCheckerInput, type BrokenBacklinkCheckerOutput } from '@/ai/flows/broken-backlink-checker';
import { type ValuableBacklinkCheckerInput, type ValuableBacklinkCheckerOutput } from '@/ai/flows/valuable-backlink-checker';
import { type BacklinksCompetitorsInput, type BacklinksCompetitorsOutput } from '@/ai/flows/backlinks-competitors';
import { type AnchorTextDistributionInput, type AnchorTextDistributionOutput } from '@/ai/flows/anchor-text-distribution';
import { type PageSpeedTestInput, type PageSpeedTestOutput } from '@/ai/flows/schemas/page-speed-test';
import { type WebsitePageSizeCheckerInput, type WebsitePageSizeCheckerOutput } from '@/ai/flows/website-page-size-checker';
import { type WebsitePageSnooperInput, type WebsitePageSnooperOutput } from '@/ai/flows/website-page-snooper';
import { type XmlSitemapGeneratorInput, type XmlSitemapGeneratorOutput } from '@/ai/flows/xml-sitemap-generator';
import { type UrlRewritingToolInput, type UrlRewritingToolOutput } from '@/ai/flows/url-rewriting-tool';
import { type AdsenseCalculatorInput, type AdsenseCalculatorOutput } from '@/ai/flows/schemas/adsense-calculator';
import { type OpenGraphGeneratorInput, type OpenGraphGeneratorOutput } from '@/ai/flows/schemas/open-graph-generator';
import { type MetaTagsAnalyzerInput, type MetaTagsAnalyzerOutput } from '@/ai/flows/schemas/meta-tags-analyzer';
import { type OpenGraphCheckerInput, type OpenGraphCheckerOutput } from '@/ai/flows/schemas/open-graph-checker';
import { type GetHttpHeadersInput, type GetHttpHeadersOutput } from '@/ai/flows/schemas/get-http-headers';
import { type ReverseIpLookupInput, type ReverseIpLookupOutput } from '@/ai/flows/schemas/reverse-ip-lookup';
import { type CheckServerStatusInput, type CheckServerStatusOutput } from '@/ai/flows/schemas/check-server-status';
import { type CodeToTextRatioCheckerInput, type CodeToTextRatioCheckerOutput } from '@/ai/flows/schemas/code-to-text-ratio-checker';
import { type AlexaRankComparisonInput, type AlexaRankComparisonOutput } from '@/ai/flows/schemas/alexa-rank-comparison';
import { type PageComparisonInput, type PageComparisonOutput } from '@/ai/flows/page-comparison';
import { type SpiderSimulatorInput, type SpiderSimulatorOutput } from './ai/flows/schemas/spider-simulator';
import { type WhoisLookupInput, type WhoisLookupOutput } from './ai/flows/schemas/whois-lookup';
import { type GoogleCacheCheckerInput, type GoogleCacheCheckerOutput } from './ai/flows/schemas/google-cache-checker';
import { type DomainAgeCheckerInput, type DomainAgeCheckerOutput } from './ai/flows/schemas/domain-age-checker';
import { type DomainAuthorityCheckerInput, type DomainAuthorityCheckerOutput } from './ai/flows/schemas/domain-authority-checker';
import { type DomainIpLookupInput, type DomainIpLookupOutput } from './ai/flows/schemas/domain-ip-lookup';
import { type EssayCheckerInput, type EssayCheckerOutput } from './ai/flows/schemas/essay-checker';
import { type ClassCIpCheckerInput, type ClassCIpCheckerOutput } from './ai/flows/schemas/class-c-ip-checker';
import { type SimilarSiteCheckerInput, type SimilarSiteCheckerOutput } from './ai/flows/schemas/similar-site-checker';
import { type DomainHostingCheckerInput, type DomainHostingCheckerOutput } from './ai/flows/schemas/domain-hosting-checker';
import { type FindDnsRecordsInput, type FindDnsRecordsOutput } from './ai/flows/schemas/find-dns-records';
import { type DomainToIpInput, type DomainToIpOutput } from './ai/flows/schemas/domain-to-ip';
import { type CheckBlacklistIpInput, type CheckBlacklistIpOutput } from './ai/flows/schemas/check-blacklist-ip';
import { type FindExpiredDomainsInput, type FindExpiredDomainsOutput } from './ai/flows/schemas/find-expired-domains';
import { type BulkDomainRatingCheckerInput, type BulkDomainRatingCheckerOutput } from './ai/flows/schemas/bulk-domain-rating-checker';
import { type IndexPagesCheckerInput, type IndexPagesCheckerOutput } from './ai/flows/schemas/index-pages-checker';
import { type SpamScoreCheckerInput, type SpamScoreCheckerOutput } from './ai/flows/schemas/spam-score-checker';
import { type ComparisonSearchInput, type ComparisonSearchOutput } from './ai/flows/schemas/comparison-search';
import { type PageAuthorityCheckerInput, type PageAuthorityCheckerOutput } from './ai/flows/schemas/page-authority-checker';
import { type MozrankCheckerInput, type MozrankCheckerOutput } from './ai/flows/schemas/mozrank-checker';
import { type GoogleIndexCheckerInput, type GoogleIndexCheckerOutput } from './ai/flows/schemas/google-index-checker';
import { type AlexaRankCheckerInput, type AlexaRankCheckerOutput } from './ai/flows/schemas/alexa-rank-checker';
import { type RedirectCheckerInput, type RedirectCheckerOutput } from './ai/flows/schemas/redirect-checker';
import { type CloakingCheckerInput, type CloakingCheckerOutput } from './ai/flows/schemas/cloaking-checker';
import { type GoogleMalwareCheckerInput, type GoogleMalwareCheckerOutput } from './ai/flows/schemas/google-malware-checker';
import { type FindFacebookIdInput, type FindFacebookIdOutput } from './ai/flows/schemas/find-facebook-id';
import { type CheckGzipCompressionInput, type CheckGzipCompressionOutput } from './ai/flows/schemas/check-gzip-compression';
import { type SslCheckerInput, type SslCheckerOutput } from './ai/flows/schemas/ssl-checker';
import { type FindBlogSitesInput, type FindBlogSitesOutput } from './ai/flows/schemas/find-blog-sites';
import { type AppsRankTrackingToolInput, type AppsRankTrackingToolOutput } from './ai/flows/schemas/apps-rank-tracking-tool';
import { type DomainNameSearchInput, type DomainNameSearchOutput } from './ai/flows/schemas/domain-name-search';
import { type WebsiteAnalysisInput, type WebsiteAnalysisOutput } from '@/ai/flows/schemas/website-analysis';
import { type BacklinkCheckerInput, type BacklinkCheckerOutput } from '@/ai/flows/schemas/backlink-checker';


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

export async function similarSiteCheckerAction(
  input: SimilarSiteCheckerInput
): Promise<{ success: true, data: SimilarSiteCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await similarSiteChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking similar sites:', error);
    return { success: false, error: 'Failed to find similar sites. Please try again later.' };
  }
}

export async function domainHostingCheckerAction(
  input: DomainHostingCheckerInput
): Promise<{ success: true, data: DomainHostingCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await domainHostingChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking domain hosting:', error);
    return { success: false, error: 'Failed to check domain hosting. Please try again later.' };
  }
}

export async function findDnsRecordsAction(
  input: FindDnsRecordsInput
): Promise<{ success: true, data: FindDnsRecordsOutput } | { success: false, error: string }> {
  try {
    const result = await findDnsRecords(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error finding DNS records:', error);
    return { success: false, error: 'Failed to find DNS records. Please try again later.' };
  }
}

export async function domainToIpAction(
  input: DomainToIpInput
): Promise<{ success: true, data: DomainToIpOutput } | { success: false, error: string }> {
  try {
    const result = await domainToIp(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error converting domain to IP:', error);
    return { success: false, error: 'Failed to convert domain to IP. Please try again later.' };
  }
}

export async function checkBlacklistIpAction(
  input: CheckBlacklistIpInput
): Promise<{ success: true, data: CheckBlacklistIpOutput } | { success: false, error: string }> {
  try {
    const result = await checkBlacklistIp(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking IP blacklist:', error);
    return { success: false, error: 'Failed to check IP blacklist. Please try again later.' };
  }
}

export async function findExpiredDomainsAction(
  input: FindExpiredDomainsInput
): Promise<{ success: true, data: FindExpiredDomainsOutput } | { success: false, error: string }> {
  try {
    const result = await findExpiredDomains(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error finding expired domains:', error);
    return { success: false, error: 'Failed to find expired domains. Please try again later.' };
  }
}

export async function bulkDomainRatingCheckerAction(
    input: BulkDomainRatingCheckerInput
  ): Promise<{ success: true, data: BulkDomainRatingCheckerOutput } | { success: false, error: string }> {
    try {
      const result = await bulkDomainRatingChecker(input);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error checking bulk domain ratings:', error);
      return { success: false, error: 'Failed to check bulk domain ratings. Please try again later.' };
    }
  }

export async function indexPagesCheckerAction(
    input: IndexPagesCheckerInput
    ): Promise<{ success: true, data: IndexPagesCheckerOutput } | { success: false, error: string }> {
    try {
        const result = await indexPagesChecker(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error checking indexed pages:', error);
        return { success: false, error: 'Failed to check indexed pages. Please try again later.' };
    }
}

export async function spamScoreCheckerAction(
    input: SpamScoreCheckerInput
    ): Promise<{ success: true, data: SpamScoreCheckerOutput } | { success: false, error: string }> {
    try {
        const result = await spamScoreChecker(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error checking spam score:', error);
        return { success: false, error: 'Failed to check spam score. Please try again later.' };
    }
}

export async function comparisonSearchAction(
  input: ComparisonSearchInput
): Promise<{ success: true, data: ComparisonSearchOutput } | { success: false, error: string }> {
  try {
    const result = await comparisonSearch(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error performing comparison search:', error);
    return { success: false, error: 'Failed to perform comparison search. Please try again later.' };
  }
}

export async function pageAuthorityCheckerAction(
  input: PageAuthorityCheckerInput
): Promise<{ success: true, data: PageAuthorityCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await pageAuthorityChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking page authority:', error);
    return { success: false, error: 'Failed to check page authority. Please try again later.' };
  }
}

export async function mozrankCheckerAction(
  input: MozrankCheckerInput
): Promise<{ success: true, data: MozrankCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await mozrankChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking MozRank:', error);
    return { success: false, error: 'Failed to check MozRank. Please try again later.' };
  }
}

export async function googleIndexCheckerAction(
    input: GoogleIndexCheckerInput
): Promise<{ success: true, data: GoogleIndexCheckerOutput } | { success: false, error: string }> {
    try {
        const result = await googleIndexChecker(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error checking Google index:', error);
        return { success: false, error: 'Failed to check Google index. Please try again later.' };
    }
}

export async function alexaRankCheckerAction(
  input: AlexaRankCheckerInput
): Promise<{ success: true, data: AlexaRankCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await alexaRankChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking Alexa rank:', error);
    return { success: false, error: 'Failed to check Alexa rank. Please try again later.' };
  }
}

export async function redirectCheckerAction(
    input: RedirectCheckerInput
): Promise<{ success: true, data: RedirectCheckerOutput } | { success: false, error: string }> {
    try {
        const result = await redirectChecker(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error checking redirects:', error);
        return { success: false, error: 'Failed to check redirects. Please try again later.' };
    }
}

export async function cloakingCheckerAction(
    input: CloakingCheckerInput
): Promise<{ success: true, data: CloakingCheckerOutput } | { success: false, error: string }> {
    try {
        const result = await cloakingChecker(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error checking for cloaking:', error);
        return { success: false, error: 'Failed to check for cloaking. Please try again later.' };
    }
}

export async function googleMalwareCheckerAction(
    input: GoogleMalwareCheckerInput
): Promise<{ success: true, data: GoogleMalwareCheckerOutput } | { success: false, error: string }> {
    try {
        const result = await googleMalwareChecker(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error checking for malware:', error);
        return { success: false, error: 'Failed to check for malware. Please try again later.' };
    }
}

export async function findFacebookIdAction(
  input: FindFacebookIdInput
): Promise<{ success: true, data: FindFacebookIdOutput } | { success: false, error: string }> {
  try {
    const result = await findFacebookId(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error finding Facebook ID:', error);
    return { success: false, error: 'Failed to find Facebook ID. Please try again later.' };
  }
}

export async function checkGzipCompressionAction(
  input: CheckGzipCompressionInput
): Promise<{ success: true, data: CheckGzipCompressionOutput } | { success: false, error: string }> {
  try {
    const result = await checkGzipCompression(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking GZIP compression:', error);
    return { success: false, error: 'Failed to check GZIP compression. Please try again later.' };
  }
}

export async function sslCheckerAction(
  input: SslCheckerInput
): Promise<{ success: true, data: SslCheckerOutput } | { success: false, error: string }> {
  try {
    const result = await sslChecker(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking SSL certificate:', error);
    return { success: false, error: 'Failed to check SSL certificate. Please try again later.' };
  }
}

export async function findBlogSitesAction(
  input: FindBlogSitesInput
): Promise<{ success: true, data: FindBlogSitesOutput } | { success: false, error: string }> {
  try {
    const result = await findBlogSites(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error finding blog sites:', error);
    return { success: false, error: 'Failed to find blog sites. Please try again later.' };
  }
}

export async function appsRankTrackingToolAction(
  input: AppsRankTrackingToolInput
): Promise<{ success: true, data: AppsRankTrackingToolOutput } | { success: false, error: string }> {
  try {
    const result = await appsRankTrackingTool(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error tracking app rank:', error);
    return { success: false, error: 'Failed to track app rank. Please try again later.' };
  }
}

export async function domainNameSearchAction(
    input: DomainNameSearchInput
  ): Promise<{ success: true, data: DomainNameSearchOutput } | { success: false, error: string }> {
    try {
      const result = await domainNameSearch(input);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error searching for domain name:', error);
      return { success: false, error: 'Failed to search for domain name. Please try again later.' };
    }
}

export async function websiteAnalysisAction(
  input: WebsiteAnalysisInput
): Promise<{ success: true, data: WebsiteAnalysisOutput } | { success: false, error: string }> {
  try {
    const result = await websiteAnalysis(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error performing website analysis:', error);
    return { success: false, error: error.message || 'Failed to perform analysis. Please try again later.' };
  }
}
