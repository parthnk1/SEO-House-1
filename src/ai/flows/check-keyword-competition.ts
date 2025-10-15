'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking keyword competition.
 *
 * It takes a keyword and returns an analysis of its competition level,
 * including a score and a list of top competing pages.
 *
 * @exports `checkKeywordCompetition` - An async function that takes a keyword and returns a promise
 *  resolving to a `CheckKeywordCompetitionOutput` object.
 * @exports `CheckKeywordCompetitionInput` - The input type for the `checkKeywordCompetition` function.
 * @exports `CheckKeywordCompetitionOutput` - The output type for the `checkKeywordCompetition` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const CheckKeywordCompetitionInputSchema = z.object({
  keyword: z.string().describe('The keyword to analyze for competition.'),
});
export type CheckKeywordCompetitionInput = z.infer<typeof CheckKeywordCompetitionInputSchema>;

// Define the output schema for a single competitor
const CompetitorSchema = z.object({
    rank: z.number().describe('The search result rank.'),
    url: z.string().url().describe('The URL of the competing page.'),
    domainAuthority: z.number().describe('A score (1-100) representing the domain\'s authority.'),
});

// Define the output schema
const CheckKeywordCompetitionOutputSchema = z.object({
  competitionScore: z.number().describe('A score from 0 to 100, where 100 is most competitive.'),
  competitionLevel: z.enum(['Low', 'Medium', 'High']).describe('The overall competition level.'),
  topCompetitors: z.array(CompetitorSchema).describe('A list of top competing pages.'),
});
export type CheckKeywordCompetitionOutput = z.infer<typeof CheckKeywordCompetitionOutputSchema>;

// Define the wrapper function
export async function checkKeywordCompetition(input: CheckKeywordCompetitionInput): Promise<CheckKeywordCompetitionOutput> {
  return checkKeywordCompetitionFlow(input);
}

// Define the prompt
const checkKeywordCompetitionPrompt = ai.definePrompt({
  name: 'checkKeywordCompetitionPrompt',
  input: {schema: CheckKeywordCompetitionInputSchema},
  output: {schema: CheckKeywordCompetitionOutputSchema},
  prompt: `You are an SEO competition analyst. For the given keyword, generate a realistic competition analysis.
  
Provide:
- A competition score (0-100).
- A competition level (Low, Medium, or High).
- A list of 5-10 top competing URLs, each with a plausible rank and domain authority score.

Keyword: {{{keyword}}}
`,
});

// Define the flow
const checkKeywordCompetitionFlow = ai.defineFlow(
  {
    name: 'checkKeywordCompetitionFlow',
    inputSchema: CheckKeywordCompetitionInputSchema,
    outputSchema: CheckKeywordCompetitionOutputSchema,
  },
  async input => {
    const {output} = await checkKeywordCompetitionPrompt(input);
    return output!;
  }
);
