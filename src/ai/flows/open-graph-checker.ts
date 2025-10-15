'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking Open Graph meta tags of a website.
 *
 * @exports `openGraphChecker` - An async function that takes a URL and returns a promise
 * resolving to a `OpenGraphCheckerOutput` object.
 * @exports `OpenGraphCheckerInput` - The input type for the `openGraphChecker` function.
 * @exports `OpenGraphCheckerOutput` - The output type for the `openGraphChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const OpenGraphCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the page to analyze.'),
});
export type OpenGraphCheckerInput = z.infer<typeof OpenGraphCheckerInputSchema>;

export const OpenGraphCheckerOutputSchema = z.object({
  ogTitle: z.string().optional().describe('The content of the `og:title` tag.'),
  ogType: z.string().optional().describe('The content of the `og:type` tag.'),
  ogUrl: z.string().url().optional().describe('The content of the `og:url` tag.'),
  ogDescription: z.string().optional().describe('The content of the `og:description` tag.'),
  ogImage: z.string().url().optional().describe('The content of the `og:image` tag.'),
});
export type OpenGraphCheckerOutput = z.infer<typeof OpenGraphCheckerOutputSchema>;

export async function openGraphChecker(input: OpenGraphCheckerInput): Promise<OpenGraphCheckerOutput> {
  return openGraphCheckerFlow(input);
}


const fetchOpenGraphTool = ai.defineTool(
    {
      name: 'fetchOpenGraphTags',
      description: 'Fetches the Open Graph (OG) tags from a given URL.',
      inputSchema: OpenGraphCheckerInputSchema,
      outputSchema: OpenGraphCheckerOutputSchema,
    },
    async ({ url }) => {
      // In a real application, you'd fetch the URL and parse the HTML head for OG tags.
      // For this demo, we'll return mock data.
      return {
        ogTitle: 'Example Site for Social Sharing',
        ogType: 'website',
        ogUrl: url,
        ogDescription: 'A mock description for how this page would appear on social media platforms.',
        ogImage: 'https://picsum.photos/seed/ogimage/1200/630',
      };
    }
);


const openGraphCheckerFlow = ai.defineFlow(
  {
    name: 'openGraphCheckerFlow',
    inputSchema: OpenGraphCheckerInputSchema,
    outputSchema: OpenGraphCheckerOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `You are an SEO tool that checks Open Graph tags. Use the 'fetchOpenGraphTags' tool to get the OG tags for the provided URL. Return the data exactly as the tool provides it. URL: ${input.url}`,
      tools: [fetchOpenGraphTool],
      output: {
          schema: OpenGraphCheckerOutputSchema
      }
    });
    return output!;
  }
);
