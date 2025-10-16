
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking if a website is cloaking.
 *
 * It takes a website URL and returns a simulated analysis of whether the site is
 * showing different content to search engines versus users.
 *
 * @exports `cloakingChecker` - An async function that takes a URL and returns a promise
 *  resolving to a `CloakingCheckerOutput` object.
 * @exports `CloakingCheckerInput` - The input type for the `cloakingChecker` function.
 * @exports `CloakingCheckerOutput` - The output type for the `cloakingChecker` function.
 */

import {ai} from '@/ai/genkit';
import { CloakingCheckerInputSchema, CloakingCheckerOutputSchema, type CloakingCheckerInput, type CloakingCheckerOutput } from './schemas/cloaking-checker';

// Define the wrapper function
export async function cloakingChecker(input: CloakingCheckerInput): Promise<CloakingCheckerOutput> {
  return cloakingCheckerFlow(input);
}

// Define the prompt
const cloakingCheckerPrompt = ai.definePrompt({
  name: 'cloakingCheckerPrompt',
  input: {schema: CloakingCheckerInputSchema},
  output: {schema: CloakingCheckerOutputSchema},
  prompt: `You are an SEO security tool that detects cloaking. For the given URL, simulate a check for cloaking.
  
There is a small chance (about 10%) that cloaking is detected.
If cloaking is detected, set isCloaking to true and provide a brief analysis explaining the suspicion (e.g., "Discrepancies found between user-agent headers.").
If not, set isCloaking to false and provide an analysis stating that no evidence of cloaking was found.

URL: {{{url}}}
`,
});

// Define the flow
const cloakingCheckerFlow = ai.defineFlow(
  {
    name: 'cloakingCheckerFlow',
    inputSchema: CloakingCheckerInputSchema,
    outputSchema: CloakingCheckerOutputSchema,
  },
  async input => {
    const {output} = await cloakingCheckerPrompt(input);
    return output!;
  }
);
