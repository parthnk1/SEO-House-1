'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing meta tags of a website.
 *
 * @exports `metaTagsAnalyzer` - An async function that takes a URL and returns a promise
 * resolving to a `MetaTagsAnalyzerOutput` object.
 * @exports `MetaTagsAnalyzerInput` - The input type for the `metaTagsAnalyzer` function.
 * @exports `MetaTagsAnalyzerOutput` - The output type for the `metaTagsAnalyzer` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const MetaTagsAnalyzerInputSchema = z.object({
  url: z.string().url().describe('The URL of the page to analyze.'),
});
export type MetaTagsAnalyzerInput = z.infer<typeof MetaTagsAnalyzerInputSchema>;

export const MetaTagsAnalyzerOutputSchema = z.object({
  title: z.string().describe('The content of the <title> tag.'),
  description: z.string().describe('The content of the meta description tag.'),
  keywords: z.string().optional().describe('The content of the meta keywords tag, if present.'),
  viewport: z.string().optional().describe('The content of the meta viewport tag.'),
  robots: z.string().optional().describe('The content of the meta robots tag.'),
});
export type MetaTagsAnalyzerOutput = z.infer<typeof MetaTagsAnalyzerOutputSchema>;

export async function metaTagsAnalyzer(input: MetaTagsAnalyzerInput): Promise<MetaTagsAnalyzerOutput> {
  return metaTagsAnalyzerFlow(input);
}


const fetchMetaTagsTool = ai.defineTool(
    {
      name: 'fetchMetaTags',
      description: 'Fetches the meta tags from a given URL.',
      inputSchema: MetaTagsAnalyzerInputSchema,
      outputSchema: MetaTagsAnalyzerOutputSchema,
    },
    async ({ url }) => {
      // In a real application, you'd fetch the URL and parse the HTML head.
      // For this demo, we'll return mock data.
      return {
        title: 'Example SEO Site - Tools for Success',
        description: 'Your one-stop shop for free SEO tools to boost your website\'s ranking and performance.',
        keywords: 'seo, tools, keyword research, backlink checker',
        viewport: 'width=device-width, initial-scale=1.0',
        robots: 'index, follow',
      };
    }
);


const metaTagsAnalyzerFlow = ai.defineFlow(
  {
    name: 'metaTagsAnalyzerFlow',
    inputSchema: MetaTagsAnalyzerInputSchema,
    outputSchema: MetaTagsAnalyzerOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `You are an SEO meta tag analyzer. Use the 'fetchMetaTags' tool to get the meta tags for the provided URL. Return the data exactly as the tool provides it. URL: ${input.url}`,
      tools: [fetchMetaTagsTool],
      output: {
          schema: MetaTagsAnalyzerOutputSchema
      }
    });
    return output!;
  }
);
