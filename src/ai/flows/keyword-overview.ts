'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing a comprehensive overview of a keyword.
 *
 * It takes a keyword and returns its search volume, competition, difficulty, and CPC.
 *
 * @exports `keywordOverview` - An async function that takes a keyword and returns a promise
 *  resolving to a `KeywordOverviewOutput` object.
 * @exports `KeywordOverviewInput` - The input type for the `keywordOverview` function.
 * @exports `KeywordOverviewOutput` - The output type for the `keywordOverview` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const KeywordOverviewInputSchema = z.object({
  keyword: z.string().describe('The keyword to get an overview for.'),
});
export type KeywordOverviewInput = z.infer<typeof KeywordOverviewInputSchema>;

// Define the output schema
const KeywordOverviewOutputSchema = z.object({
  volume: z.number().describe('Estimated monthly search volume.'),
  competition: z.enum(['Low', 'Medium', 'High']).describe('The competition level for the keyword.'),
  difficulty: z.number().min(0).max(100).describe('A score from 0 to 100 indicating how difficult it is to rank for the keyword.'),
  cpc: z.number().describe('The average Cost Per Click (CPC) for this keyword in USD.'),
});
export type KeywordOverviewOutput = z.infer<typeof KeywordOverviewOutputSchema>;

// Define the wrapper function
export async function keywordOverview(input: KeywordOverviewInput): Promise<KeywordOverviewOutput> {
  return keywordOverviewFlow(input);
}

// Define the prompt
const keywordOverviewPrompt = ai.definePrompt({
  name: 'keywordOverviewPrompt',
  input: {schema: KeywordOverviewInputSchema},
  output: {schema: KeywordOverviewOutputSchema},
  prompt: `You are an SEO expert. For the given keyword, provide a comprehensive overview.
  
Generate realistic data for the following fields:
- volume: Estimated monthly search volume.
- competition: 'Low', 'Medium', or 'High'.
- difficulty: A score from 0 to 100.
- cpc: An estimated Cost Per Click in USD.

Keyword: {{{keyword}}}
`,
});

// Define the flow
const keywordOverviewFlow = ai.defineFlow(
  {
    name: 'keywordOverviewFlow',
    inputSchema: KeywordOverviewInputSchema,
    outputSchema: KeywordOverviewOutputSchema,
  },
  async input => {
    const {output} = await keywordOverviewPrompt(input);
    return output!;
  }
);
