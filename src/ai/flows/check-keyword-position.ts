'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the keyword position of a website.
 *
 * It takes a website URL and a keyword as input and returns the position of the website
 * in the search results for that keyword.
 *
 * @exports `checkKeywordPosition` - An async function that takes a URL and keyword and returns a promise
 *  resolving to a `CheckKeywordPositionOutput` object.
 * @exports `CheckKeywordPositionInput` - The input type for the `checkKeywordPosition` function.
 * @exports `CheckKeywordPositionOutput` - The output type for the `checkKeywordPosition` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const CheckKeywordPositionInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to check.'),
  keyword: z.string().describe('The keyword to check the position for.'),
});
export type CheckKeywordPositionInput = z.infer<typeof CheckKeywordPositionInputSchema>;

// Define the output schema
const CheckKeywordPositionOutputSchema = z.object({
  position: z.number().describe('The position of the website in the search results. Returns 0 if not found in top 100.'),
});
export type CheckKeywordPositionOutput = z.infer<typeof CheckKeywordPositionOutputSchema>;

// Define the wrapper function
export async function checkKeywordPosition(input: CheckKeywordPositionInput): Promise<CheckKeywordPositionOutput> {
  return checkKeywordPositionFlow(input);
}

// This is a mock implementation. In a real-world scenario, this would
// use a service like Google Search API or a web scraper to get the actual position.
const checkKeywordPositionFlow = ai.defineFlow(
  {
    name: 'checkKeywordPositionFlow',
    inputSchema: CheckKeywordPositionInputSchema,
    outputSchema: CheckKeywordPositionOutputSchema,
  },
  async (input) => {
    // For demonstration purposes, we'll return a random position.
    // In a real application, you would integrate with a search API.
    const position = Math.floor(Math.random() * 100) + 1;
    return { position };
  }
);
