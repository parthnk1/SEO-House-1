'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the SEO score of a website.
 *
 * It takes a website URL and returns an SEO score from 1-100 and a brief analysis.
 *
 * @exports `websiteSeoScoreChecker` - An async function that takes a URL and returns a promise
 *  resolving to a `WebsiteSeoScoreCheckerOutput` object.
 * @exports `WebsiteSeoScoreCheckerInput` - The input type for the `websiteSeoScoreChecker` function.
 * @exports `WebsiteSeoScoreCheckerOutput` - The output type for the `websiteSeoScoreChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const WebsiteSeoScoreCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to check.'),
});
export type WebsiteSeoScoreCheckerInput = z.infer<typeof WebsiteSeoScoreCheckerInputSchema>;

// Define the output schema for a single analysis point
const SeoFactorSchema = z.object({
    factor: z.string().describe('The SEO factor being analyzed (e.g., Title Tag, Mobile-Friendliness).'),
    score: z.number().min(0).max(100).describe('The score for this specific factor.'),
    status: z.enum(['Good', 'Needs Improvement', 'Poor']).describe('The status of this factor.'),
});

// Define the output schema
const WebsiteSeoScoreCheckerOutputSchema = z.object({
  overallScore: z.number().min(0).max(100).describe('An overall SEO score from 0 to 100.'),
  analysis: z.array(SeoFactorSchema).describe('A list of key SEO factors and their scores.'),
});
export type WebsiteSeoScoreCheckerOutput = z.infer<typeof WebsiteSeoScoreCheckerOutputSchema>;

// Define the wrapper function
export async function websiteSeoScoreChecker(input: WebsiteSeoScoreCheckerInput): Promise<WebsiteSeoScoreCheckerOutput> {
  return websiteSeoScoreCheckerFlow(input);
}

// Define the prompt
const websiteSeoScoreCheckerPrompt = ai.definePrompt({
  name: 'websiteSeoScoreCheckerPrompt',
  input: {schema: WebsiteSeoScoreCheckerInputSchema},
  output: {schema: WebsiteSeoScoreCheckerOutputSchema},
  prompt: `You are an SEO analysis tool. For the given website URL, generate a realistic SEO score and a breakdown of key factors.

Provide:
- An overall SEO score from 0 to 100.
- A list of 5-7 key SEO factors (like 'Meta Title', 'Meta Description', 'Mobile-Friendliness', 'Page Speed', 'Backlink Quality', 'Content Quality').
- For each factor, provide a score (0-100) and a status ('Good', 'Needs Improvement', or 'Poor').

URL: {{{url}}}
`,
});

// Define the flow
const websiteSeoScoreCheckerFlow = ai.defineFlow(
  {
    name: 'websiteSeoScoreCheckerFlow',
    inputSchema: WebsiteSeoScoreCheckerInputSchema,
    outputSchema: WebsiteSeoScoreCheckerOutputSchema,
  },
  async input => {
    const {output} = await websiteSeoScoreCheckerPrompt(input);
    return output!;
  }
);
