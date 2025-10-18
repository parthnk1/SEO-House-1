'use server';

/**
 * @fileOverview This file defines a Genkit flow for testing the page speed of a website.
 *
 * It takes a URL and returns a simulated performance score and metrics.
 *
 * @exports `pageSpeedTest` - An async function that takes a URL and returns a promise
 *  resolving to a `PageSpeedTestOutput` object.
 * @exports `PageSpeedTestInput` - The input type for the `pageSpeedTest` function.
 * @exports `PageSpeedTestOutput` - The output type for the `pageSpeedTest` function.
 */

import {ai} from '@/ai/genkit';
import { PageSpeedTestInputSchema, PageSpeedTestOutputSchema, type PageSpeedTestInput, type PageSpeedTestOutput } from './schemas/page-speed-test';

// Define the wrapper function
export async function pageSpeedTest(input: PageSpeedTestInput): Promise<PageSpeedTestOutput> {
  return pageSpeedTestFlow(input);
}

// Define the prompt
const pageSpeedTestPrompt = ai.definePrompt({
  name: 'pageSpeedTestPrompt',
  input: {schema: PageSpeedTestInputSchema},
  output: {schema: PageSpeedTestOutputSchema},
  prompt: `You are a website performance analysis tool. For the given URL, simulate a page speed test and generate realistic performance metrics.

Provide:
- An overall performance score (0-100).
- A list of 5-6 key performance metrics like 'First Contentful Paint (FCP)', 'Largest Contentful Paint (LCP)', 'Time to Interactive (TTI)', and 'Cumulative Layout Shift (CLS)'.
- For each metric, provide a realistic value (e.g., "1.2s", "2.5s", "0.05") and a rating ('Good', 'Needs Improvement', or 'Poor').

URL: {{{url}}}
`,
});

// Define the flow
const pageSpeedTestFlow = ai.defineFlow(
  {
    name: 'pageSpeedTestFlow',
    inputSchema: PageSpeedTestInputSchema,
    outputSchema: PageSpeedTestOutputSchema,
  },
  async input => {
    const {output} = await pageSpeedTestPrompt(input);
    return output!;
  }
);
