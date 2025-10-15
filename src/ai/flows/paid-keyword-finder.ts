'use server';

/**
 * @fileOverview This file defines a Genkit flow for finding paid keywords a domain is likely bidding on.
 *
 * @exports `paidKeywordFinder` - An async function that takes a domain and returns a promise
 *  resolving to a `PaidKeywordFinderOutput` object.
 * @exports `PaidKeywordFinderInput` - The input type for the `paidKeywordFinder` function.
 * @exports `PaidKeywordFinderOutput` - The output type for the `paidKeywordFinder` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const PaidKeywordFinderInputSchema = z.object({
  domain: z.string().describe('The domain of the competitor to analyze.'),
});
export type PaidKeywordFinderInput = z.infer<typeof PaidKeywordFinderInputSchema>;

// Define the output schema for a single paid keyword
const PaidKeywordSchema = z.object({
    keyword: z.string().describe('The keyword the competitor is likely bidding on.'),
    cpc: z.number().describe('The estimated Cost Per Click (CPC) in USD.'),
    competition: z.enum(['Low', 'Medium', 'High']).describe('The competition level for this paid keyword.'),
});

// Define the output schema
const PaidKeywordFinderOutputSchema = z.object({
  keywords: z.array(PaidKeywordSchema).describe('A list of paid keywords found for the domain.'),
});
export type PaidKeywordFinderOutput = z.infer<typeof PaidKeywordFinderOutputSchema>;

// Define the wrapper function
export async function paidKeywordFinder(input: PaidKeywordFinderInput): Promise<PaidKeywordFinderOutput> {
  return paidKeywordFinderFlow(input);
}

// Define the prompt
const paidKeywordFinderPrompt = ai.definePrompt({
  name: 'paidKeywordFinderPrompt',
  input: {schema: PaidKeywordFinderInputSchema},
  output: {schema: PaidKeywordFinderOutputSchema},
  prompt: `You are an expert in paid search advertising. For the given competitor domain, generate a realistic list of 10-15 keywords they are likely bidding on in Google Ads.

For each keyword, provide:
- The keyword itself.
- A plausible estimated Cost Per Click (CPC) in USD.
- A competition level (Low, Medium, or High) for paid search.

Competitor Domain: {{{domain}}}
`,
});

// Define the flow
const paidKeywordFinderFlow = ai.defineFlow(
  {
    name: 'paidKeywordFinderFlow',
    inputSchema: PaidKeywordFinderInputSchema,
    outputSchema: PaidKeywordFinderOutputSchema,
  },
  async input => {
    const {output} = await paidKeywordFinderPrompt(input);
    return output!;
  }
);
