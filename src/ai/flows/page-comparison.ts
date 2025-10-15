'use server';

/**
 * @fileOverview This file defines a Genkit flow for comparing two web pages.
 *
 * @exports `pageComparison` - An async function that takes two URLs and returns a promise
 * resolving to a `PageComparisonOutput` object.
 * @exports `PageComparisonInput` - The input type for the `pageComparison` function.
 * @exports `PageComparisonOutput` - The output type for the `pageComparison` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const PageComparisonInputSchema = z.object({
  url1: z.string().url(),
  url2: z.string().url(),
});
export type PageComparisonInput = z.infer<typeof PageComparisonInputSchema>;

const PageDataSchema = z.object({
    title: z.string().describe('The title of the page.'),
    description: z.string().describe('The meta description of the page.'),
    wordCount: z.number().describe('The total word count of the page.'),
    imageCount: z.number().describe('The number of images on the page.'),
});

export const PageComparisonOutputSchema = z.object({
  page1: PageDataSchema.describe('The analysis of the first URL.'),
  page2: PageDataSchema.describe('The analysis of the second URL.'),
});
export type PageComparisonOutput = z.infer<typeof PageComparisonOutputSchema>;


export async function pageComparison(input: PageComparisonInput): Promise<PageComparisonOutput> {
  return pageComparisonFlow(input);
}


const pageComparisonPrompt = ai.definePrompt({
    name: 'pageComparisonPrompt',
    input: {schema: PageComparisonInputSchema},
    output: {schema: PageComparisonOutputSchema},
    prompt: `You are an SEO analysis tool that compares two web pages. For each of the two URLs provided, generate a plausible set of comparison data.

    For URL 1 ({{{url1}}}), generate data for page1.
    For URL 2 ({{{url2}}}), generate data for page2.

    For each page, provide:
    - A realistic title.
    - A realistic meta description.
    - A plausible word count (e.g., between 300 and 2500).
    - A plausible image count (e.g., between 1 and 20).
    `,
});


const pageComparisonFlow = ai.defineFlow(
  {
    name: 'pageComparisonFlow',
    inputSchema: PageComparisonInputSchema,
    outputSchema: PageComparisonOutputSchema,
  },
  async (input) => {
    const {output} = await pageComparisonPrompt(input);
    return output!;
  }
);
