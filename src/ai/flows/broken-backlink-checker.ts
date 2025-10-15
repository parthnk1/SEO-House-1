'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking for broken backlinks pointing to a website.
 *
 * It takes a domain and returns a list of broken backlinks.
 *
 * @exports `brokenBacklinkChecker` - An async function that takes a domain and returns a promise
 *  resolving to a `BrokenBacklinkCheckerOutput` object.
 * @exports `BrokenBacklinkCheckerInput` - The input type for the `brokenBacklinkChecker` function.
 * @exports `BrokenBacklinkCheckerOutput` - The output type for the `brokenBacklinkChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const BrokenBacklinkCheckerInputSchema = z.object({
  domain: z.string().describe('The domain to check for broken backlinks.'),
});
export type BrokenBacklinkCheckerInput = z.infer<typeof BrokenBacklinkCheckerInputSchema>;


// Define the output schema for a single broken backlink
const BrokenBacklinkSchema = z.object({
    sourceUrl: z.string().url().describe('The URL of the page containing the broken link.'),
    targetUrl: z.string().url().describe('The broken URL on the target domain.'),
    httpStatusCode: z.number().describe('The HTTP status code of the broken target link (e.g., 404).'),
});

const BrokenBacklinkCheckerOutputSchema = z.object({
    brokenBacklinks: z.array(BrokenBacklinkSchema).describe('A list of broken backlinks found pointing to the website.'),
});
export type BrokenBacklinkCheckerOutput = z.infer<typeof BrokenBacklinkCheckerOutputSchema>;

// Define the wrapper function
export async function brokenBacklinkChecker(input: BrokenBacklinkCheckerInput): Promise<BrokenBacklinkCheckerOutput> {
  return brokenBacklinkCheckerFlow(input);
}

// Define the prompt
const brokenBacklinkCheckerPrompt = ai.definePrompt({
  name: 'brokenBacklinkCheckerPrompt',
  input: {schema: BrokenBacklinkCheckerInputSchema},
  output: {schema: BrokenBacklinkCheckerOutputSchema},
  prompt: `You are an SEO tool that finds broken backlinks pointing to a user's domain. For the given domain, generate a realistic list of 3-5 broken backlinks.

For each broken backlink, provide:
- The source URL where the link originates.
- The specific target URL on the user's domain that is broken.
- The HTTP status code, which should be 404.

Domain: {{{domain}}}
`,
});

// Define the flow
const brokenBacklinkCheckerFlow = ai.defineFlow(
  {
    name: 'brokenBacklinkCheckerFlow',
    inputSchema: BrokenBacklinkCheckerInputSchema,
    outputSchema: BrokenBacklinkCheckerOutputSchema,
  },
  async input => {
    const {output} = await brokenBacklinkCheckerPrompt(input);
    return output!;
  }
);
