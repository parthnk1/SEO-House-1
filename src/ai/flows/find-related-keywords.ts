'use server';

/**
 * @fileOverview This file defines a Genkit flow for finding related keywords.
 *
 * It takes a keyword and returns a list of semantically related keywords.
 *
 * @exports `findRelatedKeywords` - An async function that takes a keyword and returns a promise
 *  resolving to a `FindRelatedKeywordsOutput` object.
 * @exports `FindRelatedKeywordsInput` - The input type for the `findRelatedKeywords` function.
 * @exports `FindRelatedKeywordsOutput` - The output type for the `findRelatedKeywords` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const FindRelatedKeywordsInputSchema = z.object({
  keyword: z.string().describe('The base keyword to find related keywords for.'),
});
export type FindRelatedKeywordsInput = z.infer<typeof FindRelatedKeywordsInputSchema>;

// Define the output schema
const FindRelatedKeywordsOutputSchema = z.object({
  relatedKeywords: z.array(z.string()).describe('A list of semantically related keywords.'),
});
export type FindRelatedKeywordsOutput = z.infer<typeof FindRelatedKeywordsOutputSchema>;

// Define the wrapper function
export async function findRelatedKeywords(input: FindRelatedKeywordsInput): Promise<FindRelatedKeywordsOutput> {
  return findRelatedKeywordsFlow(input);
}

// Define the prompt
const findRelatedKeywordsPrompt = ai.definePrompt({
  name: 'findRelatedKeywordsPrompt',
  input: {schema: FindRelatedKeywordsInputSchema},
  output: {schema: FindRelatedKeywordsOutputSchema},
  prompt: `You are an SEO expert. For the given keyword, generate a list of 10-15 semantically related keywords. These should not be just long-tail variations, but truly related concepts and topics.

Base Keyword: {{{keyword}}}
`,
});

// Define the flow
const findRelatedKeywordsFlow = ai.defineFlow(
  {
    name: 'findRelatedKeywordsFlow',
    inputSchema: FindRelatedKeywordsInputSchema,
    outputSchema: FindRelatedKeywordsOutputSchema,
  },
  async input => {
    const {output} = await findRelatedKeywordsPrompt(input);
    return output!;
  }
);
