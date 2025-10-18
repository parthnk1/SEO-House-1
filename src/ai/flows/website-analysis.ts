'use server';

import { ai } from '@/ai/genkit';
import { websiteSeoScoreChecker } from './website-seo-score-checker';
import { metaTagsAnalyzer } from './meta-tags-analyzer';
import { backlinkChecker } from './backlink-checker';
import { domainAuthorityChecker } from './domain-authority-checker';
import { pageSpeedTest } from './page-speed-test';
import {
  WebsiteAnalysisInputSchema,
  WebsiteAnalysisOutputSchema,
  type WebsiteAnalysisInput,
  type WebsiteAnalysisOutput,
} from './schemas/website-analysis';

export async function websiteAnalysis(input: WebsiteAnalysisInput): Promise<WebsiteAnalysisOutput> {
  return websiteAnalysisFlow(input);
}

const websiteAnalysisFlow = ai.defineFlow(
  {
    name: 'websiteAnalysisFlow',
    inputSchema: WebsiteAnalysisInputSchema,
    outputSchema: WebsiteAnalysisOutputSchema,
  },
  async ({ url }) => {
    
    const [seoScore, metaTags, backlinks, domainAuthority, pageSpeed] = await Promise.all([
        websiteSeoScoreChecker({ url }),
        metaTagsAnalyzer({ url }),
        backlinkChecker({ url }),
        domainAuthorityChecker({ domain: new URL(url).hostname }),
        pageSpeedTest({ url })
    ]);

    return {
        seoScore,
        metaTags,
        backlinks,
        domainAuthority,
        pageSpeed,
    };
  }
);
