
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking URL redirects.
 *
 * It takes a URL and returns the chain of redirects it follows.
 *
 * @exports `redirectChecker` - An async function that takes a URL and returns a promise
 *  resolving to a `RedirectCheckerOutput` object.
 */

import {ai} from '@/ai/genkit';
import { RedirectCheckerInputSchema, RedirectCheckerOutputSchema, type RedirectCheckerInput, type RedirectCheckerOutput } from './schemas/redirect-checker';

export async function redirectChecker(input: RedirectCheckerInput): Promise<RedirectCheckerOutput> {
  return redirectCheckerFlow(input);
}

const redirectCheckerPrompt = ai.definePrompt({
  name: 'redirectCheckerPrompt',
  input: {schema: RedirectCheckerInputSchema},
  output: {schema: RedirectCheckerOutputSchema},
  prompt: `You are an SEO tool that traces URL redirects. For the given starting URL, generate a plausible redirect chain.

If there are redirects, create a chain of 2-3 steps. The final step should have a 200 status code. Intermediate steps should have 301 or 302 status codes.

If the URL does not redirect, return a single step with a 200 status code.

Example with redirect:
1. http://example.com (301) -> https://example.com
2. https://example.com (301) -> https://www.example.com
3. https://www.example.com (200)

Example with no redirect:
1. https://www.example.com (200)

Starting URL: {{{url}}}
`,
});

const redirectCheckerFlow = ai.defineFlow(
  {
    name: 'redirectCheckerFlow',
    inputSchema: RedirectCheckerInputSchema,
    outputSchema: RedirectCheckerOutputSchema,
  },
  async input => {
    const {output} = await redirectCheckerPrompt(input);
    return output!;
  }
);
