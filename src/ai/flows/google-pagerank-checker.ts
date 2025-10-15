'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the Google PageRank of a website.
 *
 * It takes a website URL and returns a simulated PageRank score from 0-10.
 *
 * @exports `googlePagerankChecker` - An async function that takes a URL and returns a promise
 *  resolving to a `GooglePagerankCheckerOutput` object.
 * @exports `GooglePagerankCheckerInput` - The input type for the `googlePagerankChecker` function.
 * @exports `GooglePagerankCheckerOutput` - The output type for the `googlePagerankChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GooglePagerankCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to check.'),
});
export type GooglePagerankCheckerInput = z.infer<typeof GooglePagerankCheckerInputSchema>;

// Define the output schema
const GooglePagerankCheckerOutputSchema = z.object({
  pageRank: z.number().min(0).max(10).describe('A simulated PageRank score from 0 to 10.'),
  analysis: z.string().describe('A brief explanation of the factors contributing to the score.'),
});
export type GooglePagerankCheckerOutput = z.infer<typeof GooglePagerankCheckerOutputSchema>;

// Define the wrapper function
export async function googlePagerankChecker(input: GooglePagerankCheckerInput): Promise<GooglePagerankCheckerOutput> {
  return googlePagerankCheckerFlow(input);
}

// Define the prompt
const googlePagerankCheckerPrompt = ai.definePrompt({
  name: 'googlePagerankCheckerPrompt',
  input: {schema: GooglePagerankCheckerInputSchema},
  output: {schema: GooglePagerankCheckerOutputSchema},
  prompt: `You are an SEO tool that simulates Google PageRank, a metric that is no longer public. For the given URL, provide a realistic estimated PageRank score from 0 to 10.

Also, provide a short, one-sentence analysis explaining the score, considering factors like backlink quality and quantity, and domain authority.

URL: {{{url}}}
`,
});

// Define the flow
const googlePagerankCheckerFlow = ai.defineFlow(
  {
    name: 'googlePagerankCheckerFlow',
    inputSchema: GooglePagerankCheckerInputSchema,
    outputSchema: GooglePagerankCheckerOutputSchema,
  },
  async input => {
    const {output} = await googlePagerankCheckerPrompt(input);
    return output!;
  }
);
