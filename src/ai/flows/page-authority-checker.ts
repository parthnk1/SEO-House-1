
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the Page Authority of a webpage.
 *
 * It takes a URL and returns a simulated Page Authority score from 1-100.
 *
 * @exports `pageAuthorityChecker` - An async function that takes a URL and returns a promise
 *  resolving to a `PageAuthorityCheckerOutput` object.
 * @exports `PageAuthorityCheckerInput` - The input type for the `pageAuthorityChecker` function.
 * @exports `PageAuthorityCheckerOutput` - The output type for the `pageAuthorityChecker` function.
 */

import {ai} from '@/ai/genkit';
import { PageAuthorityCheckerInputSchema, PageAuthorityCheckerOutputSchema, type PageAuthorityCheckerInput, type PageAuthorityCheckerOutput } from './schemas/page-authority-checker';

// Define the wrapper function
export async function pageAuthorityChecker(input: PageAuthorityCheckerInput): Promise<PageAuthorityCheckerOutput> {
  return pageAuthorityCheckerFlow(input);
}

// Define the prompt
const pageAuthorityCheckerPrompt = ai.definePrompt({
  name: 'pageAuthorityCheckerPrompt',
  input: {schema: PageAuthorityCheckerInputSchema},
  output: {schema: PageAuthorityCheckerOutputSchema},
  prompt: `You are an SEO tool that simulates Moz's Page Authority. For the given URL, provide a realistic estimated Page Authority score from 1 to 100.

Also, provide a short, one-sentence analysis explaining the score, considering factors like the quality and quantity of links pointing to this specific page.

URL: {{{url}}}
`,
});

// Define the flow
const pageAuthorityCheckerFlow = ai.defineFlow(
  {
    name: 'pageAuthorityCheckerFlow',
    inputSchema: PageAuthorityCheckerInputSchema,
    outputSchema: PageAuthorityCheckerOutputSchema,
  },
  async input => {
    const {output} = await pageAuthorityCheckerPrompt(input);
    return output!;
  }
);
