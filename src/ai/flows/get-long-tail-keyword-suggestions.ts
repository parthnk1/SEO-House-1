'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating long-tail keyword suggestions.
 *
 * It takes a keyword as input and returns a list of long-tail keyword suggestions.
 *
 * @exports `getLongTailKeywordSuggestions` - An async function that takes a keyword and returns a promise
 *  resolving to a `GetLongTailKeywordSuggestionsOutput` object.
 * @exports `GetLongTailKeywordSuggestionsInput` - The input type for the `getLongTailKeywordSuggestions` function.
 * @exports `GetLongTailKeywordSuggestionsOutput` - The output type for the `getLongTailKeywordSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GetLongTailKeywordSuggestionsInputSchema = z.object({
  keyword: z.string().describe('The base keyword to generate long-tail suggestions from.'),
});
export type GetLongTailKeywordSuggestionsInput = z.infer<typeof GetLongTailKeywordSuggestionsInputSchema>;

// Define the output schema
const GetLongTailKeywordSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of suggested long-tail keywords.'),
});
export type GetLongTailKeywordSuggestionsOutput = z.infer<typeof GetLongTailKeywordSuggestionsOutputSchema>;

// Define the wrapper function
export async function getLongTailKeywordSuggestions(input: GetLongTailKeywordSuggestionsInput): Promise<GetLongTailKeywordSuggestionsOutput> {
  return getLongTailKeywordSuggestionsFlow(input);
}

// Define the prompt
const getLongTailKeywordSuggestionsPrompt = ai.definePrompt({
  name: 'getLongTailKeywordSuggestionsPrompt',
  input: {schema: GetLongTailKeywordSuggestionsInputSchema},
  output: {schema: GetLongTailKeywordSuggestionsOutputSchema},
  prompt: `You are an SEO expert. For the given base keyword, generate a list of 10-15 long-tail keyword variations. These should be more specific phrases that users might search for.

Base Keyword: {{{keyword}}}
`,
});

// Define the flow
const getLongTailKeywordSuggestionsFlow = ai.defineFlow(
  {
    name: 'getLongTailKeywordSuggestionsFlow',
    inputSchema: GetLongTailKeywordSuggestionsInputSchema,
    outputSchema: GetLongTailKeywordSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await getLongTailKeywordSuggestionsPrompt(input);
    return output!;
  }
);
