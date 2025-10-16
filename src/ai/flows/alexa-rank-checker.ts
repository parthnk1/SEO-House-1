
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the Alexa Rank of a website.
 *
 * It takes a website URL and returns a simulated Alexa Rank.
 *
 * @exports `alexaRankChecker` - An async function that takes a domain and returns a promise
 *  resolving to a `AlexaRankCheckerOutput` object.
 * @exports `AlexaRankCheckerInput` - The input type for the `alexaRankChecker` function.
 * @exports `AlexaRankCheckerOutput` - The output type for the `alexaRankChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AlexaRankCheckerInputSchema, AlexaRankCheckerOutputSchema, type AlexaRankCheckerInput, type AlexaRankCheckerOutput } from './schemas/alexa-rank-checker';

// Define the wrapper function
export async function alexaRankChecker(input: AlexaRankCheckerInput): Promise<AlexaRankCheckerOutput> {
  return alexaRankCheckerFlow(input);
}

// Define the flow
const alexaRankCheckerFlow = ai.defineFlow(
  {
    name: 'alexaRankCheckerFlow',
    inputSchema: AlexaRankCheckerInputSchema,
    outputSchema: AlexaRankCheckerOutputSchema,
  },
  async ({ domain }) => {
    // Since Alexa Rank is deprecated, we simulate a plausible rank.
    // We'll generate a random number, skewed towards larger numbers as lower ranks are more common.
    const rank = Math.floor(Math.pow(Math.random(), 3) * 1000000) + 1;

    return {
      rank,
      analysis: `The simulated Alexa Rank for ${domain} is ${rank.toLocaleString()}. Lower numbers indicate higher popularity. Note: Alexa's public rank was retired in 2022; this is an estimation.`,
    };
  }
);
