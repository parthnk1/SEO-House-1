
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the spam score of a website.
 *
 * @exports spamScoreChecker - An async function that takes a domain and returns its spam score.
 */

import {ai} from '@/ai/genkit';
import { SpamScoreCheckerInputSchema, SpamScoreCheckerOutputSchema, type SpamScoreCheckerInput, type SpamScoreCheckerOutput } from './schemas/spam-score-checker';

export async function spamScoreChecker(input: SpamScoreCheckerInput): Promise<SpamScoreCheckerOutput> {
  return spamScoreCheckerFlow(input);
}

const spamScoreCheckerPrompt = ai.definePrompt({
  name: 'spamScoreCheckerPrompt',
  input: {schema: SpamScoreCheckerInputSchema},
  output: {schema: SpamScoreCheckerOutputSchema},
  prompt: `You are an SEO tool that simulates a "Spam Score" for a domain. For the given domain, generate a plausible spam score from 0 to 100, where 0 is excellent and 100 is very spammy.
  
Also, provide a short, one-sentence analysis of the primary factors contributing to this score (e.g., low-quality backlinks, thin content, keyword stuffing).

Domain: {{{domain}}}
`,
});

const spamScoreCheckerFlow = ai.defineFlow(
  {
    name: 'spamScoreCheckerFlow',
    inputSchema: SpamScoreCheckerInputSchema,
    outputSchema: SpamScoreCheckerOutputSchema,
  },
  async input => {
    const {output} = await spamScoreCheckerPrompt(input);
    return output!;
  }
);
