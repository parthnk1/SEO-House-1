
'use server';

/**
 * @fileOverview This file defines a Genkit flow for finding similar websites.
 *
 * It takes a website URL and returns a list of similar sites based on content and topic.
 *
 * @exports `similarSiteChecker` - An async function that takes a URL and returns a promise
 *  resolving to a `SimilarSiteCheckerOutput` object.
 * @exports `SimilarSiteCheckerInput` - The input type for the `similarSiteChecker` function.
 * @exports `SimilarSiteCheckerOutput` - The output type for the `similarSiteChecker` function.
 */

import {ai} from '@/ai/genkit';
import { SimilarSiteCheckerInputSchema, SimilarSiteCheckerOutputSchema, type SimilarSiteCheckerInput, type SimilarSiteCheckerOutput } from './schemas/similar-site-checker';

// Define the wrapper function
export async function similarSiteChecker(input: SimilarSiteCheckerInput): Promise<SimilarSiteCheckerOutput> {
  return similarSiteCheckerFlow(input);
}

// Define the prompt
const similarSiteCheckerPrompt = ai.definePrompt({
  name: 'similarSiteCheckerPrompt',
  input: {schema: SimilarSiteCheckerInputSchema},
  output: {schema: SimilarSiteCheckerOutputSchema},
  prompt: `You are an SEO and market analysis expert. For the given URL, generate a list of 5-7 similar or competing websites.

For each similar site, provide:
- A plausible URL for the site.
- A brief reason for the similarity (e.g., "Covers the same niche," "Direct competitor in the same market," "Offers similar products/services").

URL: {{{url}}}
`,
});

// Define the flow
const similarSiteCheckerFlow = ai.defineFlow(
  {
    name: 'similarSiteCheckerFlow',
    inputSchema: SimilarSiteCheckerInputSchema,
    outputSchema: SimilarSiteCheckerOutputSchema,
  },
  async input => {
    const {output} = await similarSiteCheckerPrompt(input);
    return output!;
  }
);
