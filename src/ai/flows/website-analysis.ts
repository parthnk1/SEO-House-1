'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
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

const analysisPrompt = ai.definePrompt({
    name: 'websiteAnalysisPrompt',
    input: { schema: z.object({ analysisData: WebsiteAnalysisOutputSchema.omit({ improvements: true }) }) },
    output: { schema: WebsiteAnalysisOutputSchema.pick({ improvements: true }) },
    prompt: `You are an expert SEO analyst. Based on the following comprehensive website analysis data, generate a list of prioritized, actionable improvement suggestions.

Focus on the most impactful changes the user can make. Provide 3-5 high-priority suggestions.

Analysis Data:
- SEO Score: {{analysisData.seoScore.overallScore}}/100
- SEO Factors: {{JSON.stringify(analysisData.seoScore.analysis)}}
- Meta Tags: {{JSON.stringify(analysisData.metaTags)}}
- Page Speed Score: {{analysisData.pageSpeed.performanceScore}}/100
- Page Speed Metrics: {{JSON.stringify(analysisData.pageSpeed.metrics)}}
- Domain Authority: {{analysisData.domainAuthority.domainAuthority}}
- Backlinks: {{analysisData.backlinks.totalBacklinks}}

Generate a list of improvement suggestions.`,
});


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

    const analysisData = {
        seoScore,
        metaTags,
        backlinks,
        domainAuthority,
        pageSpeed,
    };
    
    const { output } = await analysisPrompt({ analysisData });

    return {
        ...analysisData,
        improvements: output?.improvements || [],
    };
  }
);
