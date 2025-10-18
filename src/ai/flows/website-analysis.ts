'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { websiteSeoScoreChecker } from './website-seo-score-checker';
import { metaTagsAnalyzer } from './meta-tags-analyzer';
import { backlinkChecker } from './backlink-checker';
import { type BacklinkCheckerOutput, BacklinkCheckerOutputSchema } from './schemas/backlink-checker';
import { domainAuthorityChecker } from './domain-authority-checker';
import { type DomainAuthorityCheckerOutput, DomainAuthorityCheckerOutputSchema } from './schemas/domain-authority-checker';
import { pageSpeedTest } from './page-speed-test';
import { type PageSpeedTestOutput, PageSpeedTestOutputSchema } from './schemas/page-speed-test';
import { type MetaTagsAnalyzerOutput, MetaTagsAnalyzerOutputSchema } from './schemas/meta-tags-analyzer';
import { type WebsiteSeoScoreCheckerOutput, WebsiteSeoScoreCheckerOutputSchema } from './schemas/website-seo-score-checker';

export const WebsiteAnalysisInputSchema = z.object({
  url: z.string().url(),
});
export type WebsiteAnalysisInput = z.infer<typeof WebsiteAnalysisInputSchema>;

export const WebsiteAnalysisOutputSchema = z.object({
  seoScore: WebsiteSeoScoreCheckerOutputSchema,
  metaTags: MetaTagsAnalyzerOutputSchema,
  backlinks: BacklinkCheckerOutputSchema,
  domainAuthority: DomainAuthorityCheckerOutputSchema,
  pageSpeed: PageSpeedTestOutputSchema,
});
export type WebsiteAnalysisOutput = z.infer<typeof WebsiteAnalysisOutputSchema>;

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
