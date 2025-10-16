'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating Open Graph meta tags.
 *
 * @exports `openGraphGenerator` - An async function that takes a URL and returns a promise
 * resolving to a `OpenGraphGeneratorOutput` object.
 */

import {ai} from '@/ai/genkit';
import { OpenGraphGeneratorInputSchema, OpenGraphGeneratorOutputSchema, type OpenGraphGeneratorInput, type OpenGraphGeneratorOutput } from './schemas/open-graph-generator';


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
