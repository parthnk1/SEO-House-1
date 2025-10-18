import { z } from 'zod';
import { WebsiteSeoScoreCheckerOutputSchema } from './website-seo-score-checker';
import { MetaTagsAnalyzerOutputSchema } from './meta-tags-analyzer';
import { BacklinkCheckerOutputSchema } from './backlink-checker';
import { DomainAuthorityCheckerOutputSchema } from './domain-authority-checker';
import { PageSpeedTestOutputSchema } from './page-speed-test';

export const WebsiteAnalysisInputSchema = z.object({
  url: z.string().url(),
});
export type WebsiteAnalysisInput = z.infer<typeof WebsiteAnalysisInputSchema>;

const SeoImprovementSchema = z.object({
    category: z.string().describe('The area of SEO this improvement belongs to (e.g., "On-Page", "Performance", "Backlinks").'),
    suggestion: z.string().describe('A specific, actionable suggestion for improvement.'),
    priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the suggestion.'),
});

export const WebsiteAnalysisOutputSchema = z.object({
  seoScore: WebsiteSeoScoreCheckerOutputSchema,
  metaTags: MetaTagsAnalyzerOutputSchema,
  backlinks: BacklinkCheckerOutputSchema,
  domainAuthority: DomainAuthorityCheckerOutputSchema,
  pageSpeed: PageSpeedTestOutputSchema,
  improvements: z.array(SeoImprovementSchema).describe('A prioritized list of actionable SEO improvement suggestions.'),
});
export type WebsiteAnalysisOutput = z.infer<typeof WebsiteAnalysisOutputSchema>;
