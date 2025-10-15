'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating keyword suggestions.
 *
 * It takes a keyword as input and returns a list of related keyword suggestions.
 *
 * @exports `getKeywordSuggestions` - An async function that takes a keyword and returns a promise
 *  resolving to a `GetKeywordSuggestionsOutput` object.
 * @exports `GetKeywordSuggestionsInput` - The input type for the `getKeywordSuggestions` function.
 * @exports `GetKeywordSuggestionsOutput` - The output type for the `getKeywordSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GetKeywordSuggestionsInputSchema = z.object({
  keyword: z.string().describe('The base keyword to generate suggestions from.'),
});
export type GetKeywordSuggestionsInput = z.infer<typeof GetKeywordSuggestionsInputSchema>;

// Define the output schema
const GetKeywordSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of suggested keywords.'),
});
export type GetKeywordSuggestionsOutput = z.infer<typeof GetKeywordSuggestionsOutputSchema>;

// Define the wrapper function
export async function getKeywordSuggestions(input: GetKeywordSuggestionsInput): Promise<GetKeywordSuggestionsOutput> {
  return getKeywordSuggestionsFlow(input);
}

// Define the prompt
const getKeywordSuggestionsPrompt = ai.definePrompt({
  name: 'getKeywordSuggestionsPrompt',
  input: {schema: GetKeywordSuggestionsInputSchema},
  output: {schema: GetKeywordSuggestionsOutputSchema},
  prompt: `You are an SEO expert. Generate a list of 10-15 related keyword suggestions for the following base keyword: {{{keyword}}}.
  
  Focus on providing a mix of related keywords, long-tail variations, and questions people might ask.
  `,
});

// Define the flow
const getKeywordSuggestionsFlow = ai.defineFlow(
  {
    name: 'getKeywordSuggestionsFlow',
    inputSchema: GetKeywordSuggestionsInputSchema,
    outputSchema: GetKeywordSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await getKeywordSuggestionsPrompt(input);
    return output!;
  }
);
