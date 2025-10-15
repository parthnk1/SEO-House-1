'use server';

/**
 * @fileOverview This file defines a Genkit flow for performing keyword research.
 *
 * It takes a topic or seed keyword and returns a list of related keywords
 * along with their estimated monthly search volume and competition level.
 *
 * @exports `keywordResearch` - An async function that takes a topic and returns a promise
 *  resolving to a `KeywordResearchOutput` object.
 * @exports `KeywordResearchInput` - The input type for the `keywordResearch` function.
 * @exports `KeywordResearchOutput` - The output type for the `keywordResearch` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const KeywordResearchInputSchema = z.object({
  topic: z.string().describe('The topic or seed keyword for research.'),
});
export type KeywordResearchInput = z.infer<typeof KeywordResearchInputSchema>;

// Define the output schema for a single keyword result
const KeywordResultSchema = z.object({
  keyword: z.string().describe('The suggested keyword.'),
  volume: z.number().describe('Estimated monthly search volume.'),
  competition: z.enum(['Low', 'Medium', 'High']).describe('The competition level for the keyword.'),
});

const KeywordResearchOutputSchema = z.object({
  results: z.array(KeywordResultSchema).describe('A list of keyword research results.'),
});
export type KeywordResearchOutput = z.infer<typeof KeywordResearchOutputSchema>;

// Define the wrapper function
export async function keywordResearch(input: KeywordResearchInput): Promise<KeywordResearchOutput> {
  return keywordResearchFlow(input);
}

// Define the prompt
const keywordResearchPrompt = ai.definePrompt({
  name: 'keywordResearchPrompt',
  input: {schema: KeywordResearchInputSchema},
  output: {schema: KeywordResearchOutputSchema},
  prompt: `You are an SEO expert specializing in keyword research. For the given topic, generate a list of 10-15 valuable keywords.
  
For each keyword, provide:
- A realistic estimated monthly search volume.
- A competition level (Low, Medium, or High).

Topic: {{{topic}}}
`,
});

// Define the flow
const keywordResearchFlow = ai.defineFlow(
  {
    name: 'keywordResearchFlow',
    inputSchema: KeywordResearchInputSchema,
    outputSchema: KeywordResearchOutputSchema,
  },
  async input => {
    const {output} = await keywordResearchPrompt(input);
    return output!;
  }
);
