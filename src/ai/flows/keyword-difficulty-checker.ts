'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the difficulty of a keyword.
 *
 * It takes a keyword and returns a difficulty score from 1-100.
 *
 * @exports `keywordDifficultyChecker` - An async function that takes a keyword and returns a promise
 *  resolving to a `KeywordDifficultyCheckerOutput` object.
 * @exports `KeywordDifficultyCheckerInput` - The input type for the `keywordDifficultyChecker` function.
 * @exports `KeywordDifficultyCheckerOutput` - The output type for the `keywordDifficultyChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const KeywordDifficultyCheckerInputSchema = z.object({
  keyword: z.string().describe('The keyword to check the difficulty for.'),
});
export type KeywordDifficultyCheckerInput = z.infer<typeof KeywordDifficultyCheckerInputSchema>;

// Define the output schema
const KeywordDifficultyCheckerOutputSchema = z.object({
  difficultyScore: z.number().min(0).max(100).describe('A score from 0 to 100 indicating how difficult it is to rank for the keyword.'),
  analysis: z.string().describe('A brief analysis of why the keyword has this difficulty score.'),
});
export type KeywordDifficultyCheckerOutput = z.infer<typeof KeywordDifficultyCheckerOutputSchema>;

// Define the wrapper function
export async function keywordDifficultyChecker(input: KeywordDifficultyCheckerInput): Promise<KeywordDifficultyCheckerOutput> {
  return keywordDifficultyCheckerFlow(input);
}

// Define the prompt
const keywordDifficultyCheckerPrompt = ai.definePrompt({
  name: 'keywordDifficultyCheckerPrompt',
  input: {schema: KeywordDifficultyCheckerInputSchema},
  output: {schema: KeywordDifficultyCheckerOutputSchema},
  prompt: `You are an SEO expert. For the given keyword, provide a keyword difficulty analysis.
  
Generate realistic data for the following fields:
- difficultyScore: A score from 0 to 100, where 100 is most difficult.
- analysis: A short, one or two sentence explanation for the score, mentioning factors like competition from high-authority domains, search intent, and content quality required.

Keyword: {{{keyword}}}
`,
});

// Define the flow
const keywordDifficultyCheckerFlow = ai.defineFlow(
  {
    name: 'keywordDifficultyCheckerFlow',
    inputSchema: KeywordDifficultyCheckerInputSchema,
    outputSchema: KeywordDifficultyCheckerOutputSchema,
  },
  async input => {
    const {output} = await keywordDifficultyCheckerPrompt(input);
    return output!;
  }
);
