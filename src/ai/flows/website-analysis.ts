
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { websiteSeoScoreChecker, WebsiteSeoScoreCheckerOutputSchema } from './website-seo-score-checker';
import { metaTagsAnalyzer, MetaTagsAnalyzerOutputSchema } from './meta-tags-analyzer';
import { backlinkChecker, BacklinkCheckerOutputSchema } from './backlink-checker';
import { domainAuthorityChecker, DomainAuthorityCheckerOutputSchema } from './domain-authority-checker';
import { pageSpeedTest, PageSpeedTestOutputSchema } from './page-speed-test';

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
