
'use server';

/**
 * @fileOverview This file defines a Genkit flow for finding blog sites related to a keyword.
 *
 * It takes a keyword or topic and returns a list of relevant blogs.
 *
 * @exports `findBlogSites` - An async function that takes a topic and returns a promise
 *  resolving to a `FindBlogSitesOutput` object.
 * @exports `FindBlogSitesInput` - The input type for the `findBlogSites` function.
 * @exports `FindBlogSitesOutput` - The output type for the `findBlogSites` function.
 */

import {ai} from '@/ai/genkit';
import { FindBlogSitesInputSchema, FindBlogSitesOutputSchema, type FindBlogSitesInput, type FindBlogSitesOutput } from './schemas/find-blog-sites';

// Define the wrapper function
export async function findBlogSites(input: FindBlogSitesInput): Promise<FindBlogSitesOutput> {
  return findBlogSitesFlow(input);
}

// Define the prompt
const findBlogSitesPrompt = ai.definePrompt({
  name: 'findBlogSitesPrompt',
  input: {schema: FindBlogSitesInputSchema},
  output: {schema: FindBlogSitesOutputSchema},
  prompt: `You are an expert in content marketing and SEO. For the given topic, generate a list of 10-15 popular and relevant blogs.

For each blog, provide:
- The name of the blog.
- The main URL of the blog.
- A brief, one-sentence description of what the blog is about.

Topic: {{{topic}}}
`,
});

// Define the flow
const findBlogSitesFlow = ai.defineFlow(
  {
    name: 'findBlogSitesFlow',
    inputSchema: FindBlogSitesInputSchema,
    outputSchema: FindBlogSitesOutputSchema,
  },
  async input => {
    const {output} = await findBlogSitesPrompt(input);
    return output!;
  }
);
