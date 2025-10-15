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
