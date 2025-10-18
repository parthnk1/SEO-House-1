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

export const WebsiteAnalysisOutputSchema = z.object({
  seoScore: WebsiteSeoScoreCheckerOutputSchema,
  metaTags: MetaTagsAnalyzerOutputSchema,
  backlinks: BacklinkCheckerOutputSchema,
  domainAuthority: DomainAuthorityCheckerOutputSchema,
  pageSpeed: PageSpeedTestOutputSchema,
});
export type WebsiteAnalysisOutput = z.infer<typeof WebsiteAnalysisOutputSchema>;
