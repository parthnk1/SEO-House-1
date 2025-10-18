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
import { WebsiteSeoScoreCheckerInputSchema, WebsiteSeoScoreCheckerOutputSchema, type WebsiteSeoScoreCheckerInput, type WebsiteSeoScoreCheckerOutput } from './schemas/website-seo-score-checker';


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
