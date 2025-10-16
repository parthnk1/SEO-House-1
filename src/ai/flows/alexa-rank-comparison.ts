'use server';

/**
 * @fileOverview This file defines a Genkit flow for comparing the Alexa Rank of multiple websites.
 *
 * @exports `alexaRankComparison` - An async function that takes a list of domains and returns a promise
 * resolving to a `AlexaRankComparisonOutput` object.
 */

import {ai} from '@/ai/genkit';
import { AlexaRankComparisonInputSchema, AlexaRankComparisonOutputSchema, type AlexaRankComparisonInput, type AlexaRankComparisonOutput } from './schemas/alexa-rank-comparison';


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
