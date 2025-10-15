'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the size of a webpage.
 *
 * It takes a URL and returns its simulated total page size.
 *
 * @exports `websitePageSizeChecker` - An async function that takes a URL and returns a promise
 *  resolving to a `WebsitePageSizeCheckerOutput` object.
 * @exports `WebsitePageSizeCheckerInput` - The input type for the `websitePageSizeChecker` function.
 * @exports `WebsitePageSizeCheckerOutput` - The output type for the `websitePageSizeChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const WebsitePageSizeCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to check the size of.'),
});
export type WebsitePageSizeCheckerInput = z.infer<typeof WebsitePageSizeCheckerInputSchema>;

// Define the output schema
const WebsitePageSizeCheckerOutputSchema = z.object({
  pageSizeKB: z.number().describe('The total size of the page in kilobytes (KB).'),
  analysis: z.string().describe('A brief analysis of the page size.'),
});
export type WebsitePageSizeCheckerOutput = z.infer<typeof WebsitePageSizeCheckerOutputSchema>;

// Define the wrapper function
export async function websitePageSizeChecker(input: WebsitePageSizeCheckerInput): Promise<WebsitePageSizeCheckerOutput> {
  return websitePageSizeCheckerFlow(input);
}

// Define the prompt
const websitePageSizeCheckerPrompt = ai.definePrompt({
  name: 'websitePageSizeCheckerPrompt',
  input: {schema: WebsitePageSizeCheckerInputSchema},
  output: {schema: WebsitePageSizeCheckerOutputSchema},
  prompt: `You are a website performance analysis tool. For the given URL, provide a realistic estimated page size in kilobytes (KB). The size should be a plausible number, for example, between 500 KB and 5000 KB.

Also, provide a short, one-sentence analysis of the page size, indicating if it's good, average, or could be improved for better loading times.

URL: {{{url}}}
`,
});

// Define the flow
const websitePageSizeCheckerFlow = ai.defineFlow(
  {
    name: 'websitePageSizeCheckerFlow',
    inputSchema: WebsitePageSizeCheckerInputSchema,
    outputSchema: WebsitePageSizeCheckerOutputSchema,
  },
  async input => {
    const {output} = await websitePageSizeCheckerPrompt(input);
    return output!;
  }
);
