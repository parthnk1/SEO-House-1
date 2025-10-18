'use server';
import { z } from 'zod';

export const WebsiteSeoScoreCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to check.'),
});
export type WebsiteSeoScoreCheckerInput = z.infer<typeof WebsiteSeoScoreCheckerInputSchema>;

export const SeoFactorSchema = z.object({
    factor: z.string().describe('The SEO factor being analyzed (e.g., Title Tag, Mobile-Friendliness).'),
    score: z.number().min(0).max(100).describe('The score for this specific factor.'),
    status: z.enum(['Good', 'Needs Improvement', 'Poor']).describe('The status of this factor.'),
});

export const WebsiteSeoScoreCheckerOutputSchema = z.object({
  overallScore: z.number().min(0).max(100).describe('An overall SEO score from 0 to 100.'),
  analysis: z.array(SeoFactorSchema).describe('A list of key SEO factors and their scores.'),
});
export type WebsiteSeoScoreCheckerOutput = z.infer<typeof WebsiteSeoScoreCheckerOutputSchema>;
