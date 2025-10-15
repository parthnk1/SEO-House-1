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


const fetchUrlContentTool = ai.defineTool(
    {
      name: 'fetchUrlContent',
      description: 'Fetches the text content of a given URL. This only returns the text, not the HTML.',
      inputSchema: z.object({ url: z.string().url() }),
      outputSchema: z.object({ content: z.string() }),
    },
    async ({ url }) => {
      // In a real app, you would fetch and parse the URL.
      // For demonstration, we are returning mock content.
      return {
        content: `
          Welcome to SEO Powerhouse, your one-stop shop for the best free SEO tools. 
          We offer a suite of tools including keyword research, backlink analysis, and rank tracking. 
          Our mission is to make search engine optimization accessible to everyone, from beginners to experts. 
          Improve your website's visibility and climb the search rankings with our powerful, easy-to-use utilities.
        `,
      };
    }
  );

// Define the prompt
const generateMetaTagsPrompt = ai.definePrompt({
  name: 'generateMetaTagsPrompt',
  input: {schema: GenerateMetaTagsInputSchema},
  output: {schema: GenerateMetaTagsOutputSchema},
  tools: [fetchUrlContentTool],
  prompt: `You are an SEO expert. Your task is to generate optimized meta tags for a given website URL.

1.  Use the \`fetchUrlContent\` tool to get the content of the page at the provided URL.
2.  Analyze the content to understand the page's topic, purpose, and main keywords.
3.  Based on your analysis, create a compelling and concise meta title.
4.  Write an engaging meta description that accurately summarizes the page and encourages clicks.
5.  Suggest a list of relevant, comma-separated keywords.

Return the results in the specified format.

URL: {{{url}}}
`,
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
