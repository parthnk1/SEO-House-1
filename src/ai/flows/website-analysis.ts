
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
import { type WebsiteSeoScoreCheckerOutput } from './schemas/website-seo-score-checker';
import { type MetaTagsAnalyzerOutput } from './schemas/meta-tags-analyzer';
import { type BacklinkCheckerOutput } from './schemas/backlink-checker';
import { type DomainAuthorityCheckerOutput } from './schemas/domain-authority-checker';
import { type PageSpeedTestOutput } from './schemas/page-speed-test';


export async function websiteAnalysis(input: WebsiteAnalysisInput): Promise<WebsiteAnalysisOutput> {
  return websiteAnalysisFlow(input);
}

const analysisPrompt = ai.definePrompt({
    name: 'websiteAnalysisPrompt',
    input: { schema: z.object({
        overallSeoScore: z.number(),
        seoFactors: z.string(),
        metaTags: z.string(),
        pageSpeedScore: z.number(),
        pageSpeedMetrics: z.string(),
        domainAuthority: z.number(),
        totalBacklinks: z.number(),
    }) },
    output: { schema: WebsiteAnalysisOutputSchema.pick({ improvements: true }) },
    prompt: `You are an expert SEO analyst. Based on the following comprehensive website analysis data, generate a list of prioritized, actionable improvement suggestions.

Focus on the most impactful changes the user can make. Provide 3-5 high-priority suggestions.

Analysis Data:
- SEO Score: {{overallSeoScore}}/100
- SEO Factors: {{seoFactors}}
- Meta Tags: {{metaTags}}
- Page Speed Score: {{pageSpeedScore}}/100
- Page Speed Metrics: {{pageSpeedMetrics}}
- Domain Authority: {{domainAuthority}}
- Backlinks: {{totalBacklinks}}

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
    
    const { output } = await analysisPrompt({ 
      overallSeoScore: seoScore.overallScore,
      seoFactors: JSON.stringify(seoScore.analysis),
      metaTags: JSON.stringify(metaTags),
      pageSpeedScore: pageSpeed.performanceScore,
      pageSpeedMetrics: JSON.stringify(pageSpeed.metrics),
      domainAuthority: domainAuthority.domainAuthority,
      totalBacklinks: backlinks.totalBacklinks,
    });

    return {
        ...analysisData,
        improvements: output?.improvements || [],
    };
  }
);
