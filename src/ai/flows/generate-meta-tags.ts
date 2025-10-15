'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating meta tags for a website.
 *
 * It takes a website URL as input and returns suggested meta tags (title, description, keywords).
 *
 * @exports `generateMetaTags` - An async function that takes a URL and returns a promise
 *  resolving to a `GenerateMetaTagsOutput` object.
 * @exports `GenerateMetaTagsInput` - The input type for the `generateMetaTags` function.
 * @exports `GenerateMetaTagsOutput` - The output type for the `generateMetaTags` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateMetaTagsInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to analyze.'),
});
export type GenerateMetaTagsInput = z.infer<typeof GenerateMetaTagsInputSchema>;

// Define the output schema
const GenerateMetaTagsOutputSchema = z.object({
  title: z.string().describe('Suggested meta title for the website.'),
  description: z.string().describe('Suggested meta description for the website.'),
  keywords: z.string().describe('Suggested meta keywords for the website, comma separated.'),
});
export type GenerateMetaTagsOutput = z.infer<typeof GenerateMetaTagsOutputSchema>;

// Define the wrapper function
export async function generateMetaTags(input: GenerateMetaTagsInput): Promise<GenerateMetaTagsOutput> {
  return generateMetaTagsFlow(input);
}

// Define the prompt
const generateMetaTagsPrompt = ai.definePrompt({
  name: 'generateMetaTagsPrompt',
  input: {schema: GenerateMetaTagsInputSchema},
  output: {schema: GenerateMetaTagsOutputSchema},
  prompt: `You are an SEO expert. Generate meta tags for the website at the following URL: {{{url}}}.

Analyze the website content and suggest a title, description, and keywords that are relevant and would improve the website's search engine ranking.  The keywords should be a comma separated list.

Title:
{{output.title}}

Description:
{{output.description}}

Keywords:
{{output.keywords}}`,
});

// Define the flow
const generateMetaTagsFlow = ai.defineFlow(
  {
    name: 'generateMetaTagsFlow',
    inputSchema: GenerateMetaTagsInputSchema,
    outputSchema: GenerateMetaTagsOutputSchema,
  },
  async input => {
    const {output} = await generateMetaTagsPrompt(input);
    return output!;
  }
);
