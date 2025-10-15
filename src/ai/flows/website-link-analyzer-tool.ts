'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the links on a webpage.
 *
 * It takes a website URL and returns a detailed analysis of its internal, external, dofollow, and nofollow links.
 *
 * @exports `websiteLinkAnalyzerTool` - An async function that takes a URL and returns a promise
 *  resolving to a `WebsiteLinkAnalyzerToolOutput` object.
 * @exports `WebsiteLinkAnalyzerToolInput` - The input type for the `websiteLinkAnalyzerTool` function.
 * @exports `WebsiteLinkAnalyzerToolOutput` - The output type for the `websiteLinkAnalyzerTool` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const WebsiteLinkAnalyzerToolInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to analyze.'),
});
export type WebsiteLinkAnalyzerToolInput = z.infer<typeof WebsiteLinkAnalyzerToolInputSchema>;

// Define the output schema for a single link
const AnalyzedLinkSchema = z.object({
    url: z.string().url().describe('The URL of the link.'),
    anchorText: z.string().describe('The anchor text of the link.'),
    type: z.enum(['Internal', 'External']).describe('The type of the link.'),
    followType: z.enum(['dofollow', 'nofollow']).describe('Whether the link is dofollow or nofollow.'),
});

// Define the output schema
const WebsiteLinkAnalyzerToolOutputSchema = z.object({
  totalLinks: z.number().describe('Total number of links found.'),
  internalLinks: z.number().describe('Number of internal links.'),
  externalLinks: z.number().describe('Number of external links.'),
  dofollowLinks: z.number().describe('Number of dofollow links.'),
  nofollowLinks: z.number().describe('Number of nofollow links.'),
  links: z.array(AnalyzedLinkSchema).describe('A list of up to 20 analyzed links.'),
});
export type WebsiteLinkAnalyzerToolOutput = z.infer<typeof WebsiteLinkAnalyzerToolOutputSchema>;

// Define the wrapper function
export async function websiteLinkAnalyzerTool(input: WebsiteLinkAnalyzerToolInput): Promise<WebsiteLinkAnalyzerToolOutput> {
  return websiteLinkAnalyzerToolFlow(input);
}

// Define the prompt
const websiteLinkAnalyzerToolPrompt = ai.definePrompt({
  name: 'websiteLinkAnalyzerToolPrompt',
  input: {schema: WebsiteLinkAnalyzerToolInputSchema},
  output: {schema: WebsiteLinkAnalyzerToolOutputSchema},
  prompt: `You are an SEO link analyzer. For the given URL, simulate a crawl and analyze the links on the page.

Provide a realistic breakdown including:
- Total number of links.
- Number of internal links.
- Number of external links.
- Number of "dofollow" links.
- Number of "nofollow" links.
- A sample list of 10-15 links found on the page, each with its URL, anchor text, type (Internal/External), and follow type (dofollow/nofollow).

URL: {{{url}}}
`,
});

// Define the flow
const websiteLinkAnalyzerToolFlow = ai.defineFlow(
  {
    name: 'websiteLinkAnalyzerToolFlow',
    inputSchema: WebsiteLinkAnalyzerToolInputSchema,
    outputSchema: WebsiteLinkAnalyzerToolOutputSchema,
  },
  async input => {
    const {output} = await websiteLinkAnalyzerToolPrompt(input);
    return output!;
  }
);
