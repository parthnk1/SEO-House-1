'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the backlink profiles of competitors.
 *
 * It takes a competitor's domain and returns a summary of their backlink profile.
 *
 * @exports `backlinksCompetitors` - An async function that takes a domain and returns a promise
 *  resolving to a `BacklinksCompetitorsOutput` object.
 * @exports `BacklinksCompetitorsInput` - The input type for the `backlinksCompetitors` function.
 * @exports `BacklinksCompetitorsOutput` - The output type for the `backlinksCompetitors` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const BacklinksCompetitorsInputSchema = z.object({
  domain: z.string().describe('The domain of the competitor to analyze.'),
});
export type BacklinksCompetitorsInput = z.infer<typeof BacklinksCompetitorsInputSchema>;

// Define the output schema for a single backlink source
const BacklinkSourceSchema = z.object({
    sourceUrl: z.string().url().describe('The URL of the page linking to the competitor.'),
    domainAuthority: z.number().describe('The authority of the linking domain (1-100).'),
    anchorText: z.string().describe('The anchor text used in the link.'),
});

// Define the output schema
const BacklinksCompetitorsOutputSchema = z.object({
  totalBacklinks: z.number().describe('The total number of backlinks the competitor has.'),
  referringDomains: z.number().describe('The number of unique domains linking to the competitor.'),
  topBacklinks: z.array(BacklinkSourceSchema).describe('A list of the top 5-10 most valuable backlinks.'),
});
export type BacklinksCompetitorsOutput = z.infer<typeof BacklinksCompetitorsOutputSchema>;

// Define the wrapper function
export async function backlinksCompetitors(input: BacklinksCompetitorsInput): Promise<BacklinksCompetitorsOutput> {
  return backlinksCompetitorsFlow(input);
}

// Define the prompt
const backlinksCompetitorsPrompt = ai.definePrompt({
  name: 'backlinksCompetitorsPrompt',
  input: {schema: BacklinksCompetitorsInputSchema},
  output: {schema: BacklinksCompetitorsOutputSchema},
  prompt: `You are an SEO expert analyzing competitor backlink profiles. For the given domain, generate a realistic backlink analysis.

Provide:
- A plausible, large number for the total backlinks.
- A realistic number for the total unique referring domains.
- A list of 5-10 high-quality, plausible backlinks, each with a source URL, a high domain authority score (60-95), and relevant anchor text.

Competitor Domain: {{{domain}}}
`,
});

// Define the flow
const backlinksCompetitorsFlow = ai.defineFlow(
  {
    name: 'backlinksCompetitorsFlow',
    inputSchema: BacklinksCompetitorsInputSchema,
    outputSchema: BacklinksCompetitorsOutputSchema,
  },
  async input => {
    const {output} = await backlinksCompetitorsPrompt(input);
    return output!;
  }
);
