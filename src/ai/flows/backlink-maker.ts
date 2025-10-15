'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating backlink opportunities.
 *
 * It takes a keyword and returns a list of suggested websites to get backlinks from.
 *
 * @exports `backlinkMaker` - An async function that takes a keyword and returns a promise
 *  resolving to a `BacklinkMakerOutput` object.
 * @exports `BacklinkMakerInput` - The input type for the `backlinkMaker` function.
 * @exports `BacklinkMakerOutput` - The output type for the `backlinkMaker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const BacklinkMakerInputSchema = z.object({
  keyword: z.string().describe('The keyword or topic for which to find backlink opportunities.'),
});
export type BacklinkMakerInput = z.infer<typeof BacklinkMakerInputSchema>;

// Define the output schema for a single suggestion
const BacklinkSuggestionSchema = z.object({
    url: z.string().url().describe('The URL of the suggested website.'),
    type: z.enum(['Blog', 'Forum', 'Directory', 'Social Media', 'Guest Post']).describe('The type of website or backlink opportunity.'),
    reason: z.string().describe('A brief explanation of why this is a good backlink opportunity.'),
});

// Define the output schema
const BacklinkMakerOutputSchema = z.object({
  suggestions: z.array(BacklinkSuggestionSchema).describe('A list of backlink suggestions.'),
});
export type BacklinkMakerOutput = z.infer<typeof BacklinkMakerOutputSchema>;

// Define the wrapper function
export async function backlinkMaker(input: BacklinkMakerInput): Promise<BacklinkMakerOutput> {
  return backlinkMakerFlow(input);
}

// Define the prompt
const backlinkMakerPrompt = ai.definePrompt({
  name: 'backlinkMakerPrompt',
  input: {schema: BacklinkMakerInputSchema},
  output: {schema: BacklinkMakerOutputSchema},
  prompt: `You are an SEO expert who helps users find backlink opportunities. Based on the provided keyword, generate a list of 10-15 realistic and high-quality websites where a user could potentially acquire a backlink.

For each suggestion, provide:
- The website URL.
- The type of opportunity (e.g., Blog, Forum, Directory, Guest Post).
- A short reason why it's a good place to get a link for the given keyword.

Keyword: {{{keyword}}}
`,
});

// Define the flow
const backlinkMakerFlow = ai.defineFlow(
  {
    name: 'backlinkMakerFlow',
    inputSchema: BacklinkMakerInputSchema,
    outputSchema: BacklinkMakerOutputSchema,
  },
  async input => {
    const {output} = await backlinkMakerPrompt(input);
    if (!output) {
      throw new Error('Failed to generate backlink suggestions');
    }
    return output;
  }
);
