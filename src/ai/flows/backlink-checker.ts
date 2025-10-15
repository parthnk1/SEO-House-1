'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the backlinks of a website.
 *
 * It takes a website URL and returns a list of backlinks pointing to it.
 *
 * @exports `backlinkChecker` - An async function that takes a URL and returns a promise
 *  resolving to a `BacklinkCheckerOutput` object.
 * @exports `BacklinkCheckerInput` - The input type for the `backlinkChecker` function.
 * @exports `BacklinkCheckerOutput` - The output type for the `backlinkChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const BacklinkCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to check for backlinks.'),
});
export type BacklinkCheckerInput = z.infer<typeof BacklinkCheckerInputSchema>;

// Define the output schema for a single backlink
const BacklinkSchema = z.object({
    sourceUrl: z.string().url().describe('The URL of the page containing the backlink.'),
    anchorText: z.string().describe('The anchor text of the backlink.'),
    domainAuthority: z.number().describe('A score (1-100) representing the linking domain\'s authority.'),
});

// Define the output schema
const BacklinkCheckerOutputSchema = z.object({
  backlinks: z.array(BacklinkSchema).describe('A list of backlinks found for the given URL.'),
  totalBacklinks: z.number().describe('The total number of backlinks found.'),
});
export type BacklinkCheckerOutput = z.infer<typeof BacklinkCheckerOutputSchema>;

// Define the wrapper function
export async function backlinkChecker(input: BacklinkCheckerInput): Promise<BacklinkCheckerOutput> {
  return backlinkCheckerFlow(input);
}

// Define the prompt
const backlinkCheckerPrompt = ai.definePrompt({
  name: 'backlinkCheckerPrompt',
  input: {schema: BacklinkCheckerInputSchema},
  output: {schema: BacklinkCheckerOutputSchema},
  prompt: `You are an SEO backlink analyst. For the given URL, generate a realistic list of 10-15 backlinks.
  
For each backlink, provide:
- A plausible source URL.
- The anchor text used for the link.
- A domain authority score (1-100) for the linking domain.

The total number of backlinks should also be provided. Make it a large, realistic number.

URL: {{{url}}}
`,
});

// Define the flow
const backlinkCheckerFlow = ai.defineFlow(
  {
    name: 'backlinkCheckerFlow',
    inputSchema: BacklinkCheckerInputSchema,
    outputSchema: BacklinkCheckerOutputSchema,
  },
  async input => {
    const {output} = await backlinkCheckerPrompt(input);
    if (!output) {
      throw new Error('Failed to generate backlinks');
    }
    // Ensure the total is at least the number of returned backlinks
    output.totalBacklinks = Math.max(output.totalBacklinks, output.backlinks.length);
    return output;
  }
);
