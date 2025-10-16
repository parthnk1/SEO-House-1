
'use server';

/**
 * @fileOverview This file defines a Genkit flow for performing a comparison search across multiple simulated search engines.
 *
 * @exports `comparisonSearch` - An async function that takes a search query and returns a promise
 * resolving to a `ComparisonSearchOutput` object.
 */

import {ai} from '@/ai/genkit';
import { ComparisonSearchInputSchema, ComparisonSearchOutputSchema, type ComparisonSearchInput, type ComparisonSearchOutput } from './schemas/comparison-search';

export async function comparisonSearch(input: ComparisonSearchInput): Promise<ComparisonSearchOutput> {
  return comparisonSearchFlow(input);
}

const comparisonSearchPrompt = ai.definePrompt({
  name: 'comparisonSearchPrompt',
  input: {schema: ComparisonSearchInputSchema},
  output: {schema: ComparisonSearchOutputSchema},
  prompt: `You are a meta-search engine. For the given search query, generate a list of 5-7 plausible search results for each of the following three search engines: Google, Bing, and DuckDuckGo.

For each result, provide a realistic title, URL, and a short description.

Query: {{{query}}}
`,
});

const comparisonSearchFlow = ai.defineFlow(
  {
    name: 'comparisonSearchFlow',
    inputSchema: ComparisonSearchInputSchema,
    outputSchema: ComparisonSearchOutputSchema,
  },
  async input => {
    const {output} = await comparisonSearchPrompt(input);
    return output!;
  }
);
