'use server';

/**
 * @fileOverview This file defines a Genkit flow for comparing the Alexa Rank of multiple websites.
 *
 * @exports `alexaRankComparison` - An async function that takes a list of domains and returns a promise
 * resolving to a `AlexaRankComparisonOutput` object.
 * @exports `AlexaRankComparisonInput` - The input type for the `alexaRankComparison` function.
 * @exports `AlexaRankComparisonOutput` - The output type for the `alexaRankComparison` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
export const AlexaRankComparisonInputSchema = z.object({
  domains: z.array(z.string().min(1, 'Domain cannot be empty')).min(1, 'Please enter at least one domain.'),
});
export type AlexaRankComparisonInput = z.infer<typeof AlexaRankComparisonInputSchema>;

const RankResultSchema = z.object({
    domain: z.string(),
    rank: z.number().describe('A simulated Alexa Rank.'),
});

// Define the output schema
export const AlexaRankComparisonOutputSchema = z.object({
  results: z.array(RankResultSchema),
});
export type AlexaRankComparisonOutput = z.infer<typeof AlexaRankComparisonOutputSchema>;

// Define the wrapper function
export async function alexaRankComparison(input: AlexaRankComparisonInput): Promise<AlexaRankComparisonOutput> {
  return alexaRankComparisonFlow(input);
}

// Define the flow
const alexaRankComparisonFlow = ai.defineFlow(
  {
    name: 'alexaRankComparisonFlow',
    inputSchema: AlexaRankComparisonInputSchema,
    outputSchema: AlexaRankComparisonOutputSchema,
  },
  async ({ domains }) => {
    // In a real application, you would use an API to get Alexa ranks.
    // For this demo, we'll generate random, plausible ranks.
    const results = domains.map(domain => ({
      domain,
      rank: Math.floor(Math.random() * 100000) + 1,
    }));

    // Sort by rank, ascending
    results.sort((a, b) => a.rank - b.rank);

    return { results };
  }
);
