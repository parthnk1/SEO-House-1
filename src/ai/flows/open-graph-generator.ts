'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating Open Graph meta tags.
 *
 * @exports `openGraphGenerator` - An async function that takes a URL and returns a promise
 * resolving to a `OpenGraphGeneratorOutput` object.
 * @exports `OpenGraphGeneratorInput` - The input type for the `openGraphGenerator` function.
 * @exports `OpenGraphGeneratorOutput` - The output type for the `openGraphGenerator` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const OpenGraphGeneratorInputSchema = z.object({
  url: z.string().url().describe('The URL of the page to generate Open Graph tags for.'),
  title: z.string().optional().describe('An optional title to use instead of the one from the page.'),
  description: z.string().optional().describe('An optional description to use instead of the one from the page.'),
});
export type OpenGraphGeneratorInput = z.infer<typeof OpenGraphGeneratorInputSchema>;

export const OpenGraphGeneratorOutputSchema = z.object({
  ogTitle: z.string().describe('The generated `og:title` tag content.'),
  ogType: z.string().describe('The generated `og:type` tag content, usually "website" or "article".'),
  ogUrl: z.string().url().describe('The generated `og:url` tag content.'),
  ogDescription: z.string().describe('The generated `og:description` tag content.'),
  ogImage: z.string().url().describe('A suggested `og:image` URL.'),
});
export type OpenGraphGeneratorOutput = z.infer<typeof OpenGraphGeneratorOutputSchema>;

export async function openGraphGenerator(input: OpenGraphGeneratorInput): Promise<OpenGraphGeneratorOutput> {
  return openGraphGeneratorFlow(input);
}

const openGraphGeneratorFlow = ai.defineFlow(
  {
    name: 'openGraphGeneratorFlow',
    inputSchema: OpenGraphGeneratorInputSchema,
    outputSchema: OpenGraphGeneratorOutputSchema,
  },
  async ({ url, title, description }) => {

    const prompt = `You are an SEO expert specializing in social media meta tags. Generate Open Graph tags for the given URL.

URL: ${url}
${title ? `Use this custom title: ${title}` : ''}
${description ? `Use this custom description: ${description}` : ''}

Based on the URL and any custom inputs, provide the following Open Graph tag content:
- og:title: A compelling title for social sharing.
- og:type: "website" or "article".
- og:url: The canonical URL of the page.
- og:description: A concise and engaging summary (max 155 characters).
- og:image: A plausible, high-quality image URL relevant to the content (e.g., from picsum.photos).
`;

    const { output } = await ai.generate({
      prompt: prompt,
      output: {
        schema: OpenGraphGeneratorOutputSchema
      }
    });

    return output!;
  }
);
