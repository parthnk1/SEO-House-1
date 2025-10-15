'use server';

/**
 * @fileOverview This file defines a Genkit flow for simulating a search engine spider.
 *
 * It takes a URL and returns a simplified view of the page, including text content and links.
 *
 * @exports `spiderSimulator` - An async function that takes a URL and returns a promise
 * resolving to a `SpiderSimulatorOutput` object.
 * @exports `SpiderSimulatorInput` - The input type for the `spiderSimulator` function.
 * @exports `SpiderSimulatorOutput` - The output type for the `spiderSimulator` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SpiderSimulatorInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to simulate.'),
});
export type SpiderSimulatorInput = z.infer<typeof SpiderSimulatorInputSchema>;

const LinkSchema = z.object({
    url: z.string().url(),
    anchorText: z.string(),
});

export const SpiderSimulatorOutputSchema = z.object({
    title: z.string(),
    textContent: z.string(),
    links: z.array(LinkSchema),
});
export type SpiderSimulatorOutput = z.infer<typeof SpiderSimulatorOutputSchema>;

export async function spiderSimulator(input: SpiderSimulatorInput): Promise<SpiderSimulatorOutput> {
  return spiderSimulatorFlow(input);
}

const spiderSimulatorFlow = ai.defineFlow(
  {
    name: 'spiderSimulatorFlow',
    inputSchema: SpiderSimulatorInputSchema,
    outputSchema: SpiderSimulatorOutputSchema,
  },
  async ({ url }) => {
    // In a real application, you would fetch the URL and parse the HTML.
    // For this demo, we'll return mock data.
    return {
      title: 'Simulated Page Title for Spider View',
      textContent: `This is the primary text content of the page. Spiders focus on the text to understand the page's topic. They generally ignore complex styling and scripts. Important keywords should be present here. Another paragraph of text would follow, containing more valuable information for the search engine to index.`,
      links: [
        { url: new URL('/about', url).toString(), anchorText: 'About Us' },
        { url: new URL('/services', url).toString(), anchorText: 'Our Services' },
        { url: 'https://example.com/external-link', anchorText: 'An External Resource' },
      ],
    };
  }
);
