'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing anchor text distribution.
 *
 * It takes a domain and returns a breakdown of the anchor texts used in its backlinks.
 *
 * @exports `anchorTextDistribution` - An async function that takes a domain and returns a promise
 *  resolving to a `AnchorTextDistributionOutput` object.
 * @exports `AnchorTextDistributionInput` - The input type for the `anchorTextDistribution` function.
 * @exports `AnchorTextDistributionOutput` - The output type for the `anchorTextDistribution` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const AnchorTextDistributionInputSchema = z.object({
  domain: z.string().describe('The domain to analyze for anchor text distribution.'),
});
export type AnchorTextDistributionInput = z.infer<typeof AnchorTextDistributionInputSchema>;

// Define the output schema for a single anchor text
const AnchorTextSchema = z.object({
    anchorText: z.string().describe('The anchor text found.'),
    count: z.number().describe('The number of times this anchor text was found.'),
    percentage: z.number().describe('The percentage of total backlinks using this anchor text.'),
});

// Define the output schema
const AnchorTextDistributionOutputSchema = z.object({
  distribution: z.array(AnchorTextSchema).describe('A list of anchor texts and their distribution.'),
});
export type AnchorTextDistributionOutput = z.infer<typeof AnchorTextDistributionOutputSchema>;

// Define the wrapper function
export async function anchorTextDistribution(input: AnchorTextDistributionInput): Promise<AnchorTextDistributionOutput> {
  return anchorTextDistributionFlow(input);
}

// Define the prompt
const anchorTextDistributionPrompt = ai.definePrompt({
  name: 'anchorTextDistributionPrompt',
  input: {schema: AnchorTextDistributionInputSchema},
  output: {schema: AnchorTextDistributionOutputSchema},
  prompt: `You are an SEO tool that analyzes the anchor text distribution for a given domain. Generate a realistic list of 10-15 anchor texts.

For each anchor text, provide:
- The anchor text itself (include branded, generic, naked URL, and keyword-rich examples).
- A plausible count for how many times it appears.
- The percentage of the total, ensuring the percentages for the top items add up to a reasonable number (e.g., 40-60%), not 100%.

Domain: {{{domain}}}
`,
});

// Define the flow
const anchorTextDistributionFlow = ai.defineFlow(
  {
    name: 'anchorTextDistributionFlow',
    inputSchema: AnchorTextDistributionInputSchema,
    outputSchema: AnchorTextDistributionOutputSchema,
  },
  async input => {
    const {output} = await anchorTextDistributionPrompt(input);
    return output!;
  }
);
