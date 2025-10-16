'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the MozRank of a website.
 *
 * It takes a website URL and returns a simulated MozRank score from 0-10.
 *
 * @exports `mozrankChecker` - An async function that takes a URL and returns a promise
 *  resolving to a `MozrankCheckerOutput` object.
 */

import {ai} from '@/ai/genkit';
import { MozrankCheckerInputSchema, MozrankCheckerOutputSchema, type MozrankCheckerInput, type MozrankCheckerOutput } from './schemas/mozrank-checker';


export async function mozrankChecker(input: MozrankCheckerInput): Promise<MozrankCheckerOutput> {
  return mozrankCheckerFlow(input);
}


const mozrankCheckerPrompt = ai.definePrompt({
  name: 'mozrankCheckerPrompt',
  input: {schema: MozrankCheckerInputSchema},
  output: {schema: MozrankCheckerOutputSchema},
  prompt: `You are an SEO tool that simulates MozRank, a link popularity score. For the given URL, provide a realistic estimated MozRank score from 0 to 10.

Also, provide a short, one-sentence analysis explaining the score, considering factors like the quantity and quality of backlinks.

URL: {{{url}}}
`,
});


const mozrankCheckerFlow = ai.defineFlow(
  {
    name: 'mozrankCheckerFlow',
    inputSchema: MozrankCheckerInputSchema,
    outputSchema: MozrankCheckerOutputSchema,
  },
  async input => {
    const {output} = await mozrankCheckerPrompt(input);
    return output!;
  }
);
