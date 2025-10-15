'use server';

/**
 * @fileOverview This file defines a Genkit flow for performing an in-depth SEO keyword competition analysis.
 *
 * It takes a keyword and returns a detailed analysis including top competitors,
 * their content strengths/weaknesses, and actionable SEO advice.
 *
 * @exports `seoKeywordCompetitionAnalysis` - An async function that takes a keyword and returns a promise
 *  resolving to a `SeoKeywordCompetitionAnalysisOutput` object.
 * @exports `SeoKeywordCompetitionAnalysisInput` - The input type for the `seoKeywordCompetitionAnalysis` function.
 * @exports `SeoKeywordCompetitionAnalysisOutput` - The output type for the `seoKeywordCompetitionAnalysis` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SeoKeywordCompetitionAnalysisInputSchema = z.object({
  keyword: z.string().describe('The keyword to analyze for competition.'),
});
export type SeoKeywordCompetitionAnalysisInput = z.infer<typeof SeoKeywordCompetitionAnalysisInputSchema>;

// Define the output schema for a single competitor
const CompetitorAnalysisSchema = z.object({
    url: z.string().url().describe('The URL of the competing page.'),
    title: z.string().describe('The title of the competing page.'),
    strengths: z.array(z.string()).describe('List of content strengths for this competitor.'),
    weaknesses: z.array(z.string()).describe('List of content weaknesses or opportunities for this competitor.'),
});

// Define the output schema
const SeoKeywordCompetitionAnalysisOutputSchema = z.object({
  overallDifficulty: z.number().min(0).max(100).describe('A score from 0 to 100, where 100 is most difficult.'),
  competitors: z.array(CompetitorAnalysisSchema).describe('A detailed analysis of the top 3-5 competitors.'),
  actionableAdvice: z.array(z.string()).describe('Actionable advice on how to outrank the competition.'),
});
export type SeoKeywordCompetitionAnalysisOutput = z.infer<typeof SeoKeywordCompetitionAnalysisOutputSchema>;

// Define the wrapper function
export async function seoKeywordCompetitionAnalysis(input: SeoKeywordCompetitionAnalysisInput): Promise<SeoKeywordCompetitionAnalysisOutput> {
  return seoKeywordCompetitionAnalysisFlow(input);
}

// Define the prompt
const seoKeywordCompetitionAnalysisPrompt = ai.definePrompt({
  name: 'seoKeywordCompetitionAnalysisPrompt',
  input: {schema: SeoKeywordCompetitionAnalysisInputSchema},
  output: {schema: SeoKeywordCompetitionAnalysisOutputSchema},
  prompt: `You are a world-class SEO strategist. For the given keyword, perform an in-depth competitive analysis.
  
Provide:
- An overall difficulty score (0-100) to rank for this keyword.
- A detailed analysis of the top 3-5 competing URLs. For each competitor, identify their title, 2-3 key content strengths, and 2-3 content weaknesses or opportunities where we can do better.
- A list of 3-4 actionable pieces of advice on how a new piece of content could outrank these competitors. Focus on content gaps, user intent, and unique value propositions.

Keyword: {{{keyword}}}
`,
});

// Define the flow
const seoKeywordCompetitionAnalysisFlow = ai.defineFlow(
  {
    name: 'seoKeywordCompetitionAnalysisFlow',
    inputSchema: SeoKeywordCompetitionAnalysisInputSchema,
    outputSchema: SeoKeywordCompetitionAnalysisOutputSchema,
  },
  async input => {
    const {output} = await seoKeywordCompetitionAnalysisPrompt(input);
    return output!;
  }
);
