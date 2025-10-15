'use server';

/**
 * @fileOverview This file defines a Genkit flow for identifying valuable backlinks.
 *
 * It takes a website URL and returns a list of the most valuable backlinks.
 *
 * @exports `valuableBacklinkChecker` - An async function that takes a URL and returns a promise
 *  resolving to a `ValuableBacklinkCheckerOutput` object.
 * @exports `ValuableBacklinkCheckerInput` - The input type for the `valuableBacklinkChecker` function.
 * @exports `ValuableBacklinkCheckerOutput` - The output type for the `valuableBacklinkChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const ValuableBacklinkCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to check for valuable backlinks.'),
});
export type ValuableBacklinkCheckerInput = z.infer<typeof ValuableBacklinkCheckerInputSchema>;

// Define the output schema for a single valuable backlink
const ValuableBacklinkSchema = z.object({
    sourceUrl: z.string().url().describe('The URL of the page containing the backlink.'),
    domainAuthority: z.number().describe('The authority of the linking domain (1-100).'),
    relevance: z.string().describe('A brief explanation of why the backlink is relevant.'),
    valueScore: z.number().describe('A score from 1-100 representing the backlink\'s overall value.'),
});

// Define the output schema
const ValuableBacklinkCheckerOutputSchema = z.object({
  valuableBacklinks: z.array(ValuableBacklinkSchema).describe('A list of the most valuable backlinks found for the given URL.'),
});
export type ValuableBacklinkCheckerOutput = z.infer<typeof ValuableBacklinkCheckerOutputSchema>;

// Define the wrapper function
export async function valuableBacklinkChecker(input: ValuableBacklinkCheckerInput): Promise<ValuableBacklinkCheckerOutput> {
  return valuableBacklinkCheckerFlow(input);
}

// Define the prompt
const valuableBacklinkCheckerPrompt = ai.definePrompt({
  name: 'valuableBacklinkCheckerPrompt',
  input: {schema: ValuableBacklinkCheckerInputSchema},
  output: {schema: ValuableBacklinkCheckerOutputSchema},
  prompt: `You are an SEO expert who identifies high-value backlinks. For the given URL, generate a list of 5-7 of its most valuable backlinks.

For each backlink, provide:
- A plausible source URL.
- A high domain authority score (70-95).
- A short reason for its relevance (e.g., "From a high-authority industry blog").
- A value score (1-100) representing its overall importance.

URL: {{{url}}}
`,
});

// Define the flow
const valuableBacklinkCheckerFlow = ai.defineFlow(
  {
    name: 'valuableBacklinkCheckerFlow',
    inputSchema: ValuableBacklinkCheckerInputSchema,
    outputSchema: ValuableBacklinkCheckerOutputSchema,
  },
  async input => {
    const {output} = await valuableBacklinkCheckerPrompt(input);
    return output!;
  }
);
