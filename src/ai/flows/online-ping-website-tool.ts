'use server';

/**
 * @fileOverview This file defines a Genkit flow for pinging a website to search engines.
 *
 * It takes a website URL and simulates pinging major search engines to request a crawl.
 *
 * @exports `onlinePingWebsiteTool` - An async function that takes a URL and returns a promise
 *  resolving to a `OnlinePingWebsiteToolOutput` object.
 * @exports `OnlinePingWebsiteToolInput` - The input type for the `onlinePingWebsiteTool` function.
 * @exports `OnlinePingWebsiteToolOutput` - The output type for the `onlinePingWebsiteTool` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const OnlinePingWebsiteToolInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to ping.'),
});
export type OnlinePingWebsiteToolInput = z.infer<typeof OnlinePingWebsiteToolInputSchema>;

// Define the output schema for a single ping result
const PingResultSchema = z.object({
    engine: z.string().describe('The name of the search engine pinged.'),
    success: z.boolean().describe('Whether the ping was successful.'),
    message: z.string().describe('The result message from the search engine.'),
});

// Define the output schema
const OnlinePingWebsiteToolOutputSchema = z.object({
  results: z.array(PingResultSchema).describe('A list of ping results from various search engines.'),
});
export type OnlinePingWebsiteToolOutput = z.infer<typeof OnlinePingWebsiteToolOutputSchema>;

// Define the wrapper function
export async function onlinePingWebsiteTool(input: OnlinePingWebsiteToolInput): Promise<OnlinePingWebsiteToolOutput> {
  return onlinePingWebsiteToolFlow(input);
}

// Define the prompt
const onlinePingWebsiteToolPrompt = ai.definePrompt({
  name: 'onlinePingWebsiteToolPrompt',
  input: {schema: OnlinePingWebsiteToolInputSchema},
  output: {schema: OnlinePingWebsiteToolOutputSchema},
  prompt: `You are a web utility that simulates pinging a website URL to various search engines. For the given URL, generate a list of results as if you pinged major search engines like Google, Bing, and Yahoo.

For each engine, provide:
- The engine name.
- A success status (true for all).
- A success message like "Thanks for the ping." or "Sitemap notification received."

URL: {{{url}}}
`,
});

// Define the flow
const onlinePingWebsiteToolFlow = ai.defineFlow(
  {
    name: 'onlinePingWebsiteToolFlow',
    inputSchema: OnlinePingWebsiteToolInputSchema,
    outputSchema: OnlinePingWebsiteToolOutputSchema,
  },
  async input => {
    const {output} = await onlinePingWebsiteToolPrompt(input);
    return output!;
  }
);
