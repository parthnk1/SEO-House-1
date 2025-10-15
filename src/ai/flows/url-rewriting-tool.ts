'use server';

/**
 * @fileOverview This file defines a Genkit flow for rewriting URLs to be more SEO-friendly.
 *
 * @exports `urlRewritingTool` - An async function that takes a URL and returns a promise
 *  resolving to a `UrlRewritingToolOutput` object.
 * @exports `UrlRewritingToolInput` - The input type for the `urlRewritingTool` function.
 * @exports `UrlRewritingToolOutput` - The output type for the `urlRewritingTool` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const UrlRewritingToolInputSchema = z.object({
  url: z.string().url().describe('The URL to rewrite.'),
});
export type UrlRewritingToolInput = z.infer<typeof UrlRewritingToolInputSchema>;

// Define the output schema
const UrlRewritingToolOutputSchema = z.object({
  rewrittenUrl: z.string().describe('The rewritten, SEO-friendly URL.'),
  explanation: z.string().describe('A brief explanation of the changes made.'),
});
export type UrlRewritingToolOutput = z.infer<typeof UrlRewritingToolOutputSchema>;

// Define the wrapper function
export async function urlRewritingTool(input: UrlRewritingToolInput): Promise<UrlRewritingToolOutput> {
  return urlRewritingToolFlow(input);
}

// Define the prompt
const urlRewritingToolPrompt = ai.definePrompt({
  name: 'urlRewritingToolPrompt',
  input: {schema: UrlRewritingToolInputSchema},
  output: {schema: UrlRewritingToolOutputSchema},
  prompt: `You are an SEO expert. Rewrite the given URL to be more SEO-friendly.
  
  URL: {{{url}}}

  For example, if the URL is "https://example.com/product_id=123?category=4", a good rewritten URL would be "https://example.com/products/widget-pro".

  Provide the rewritten URL and a short explanation of why the new URL is better for SEO.
  `,
});

// Define the flow
const urlRewritingToolFlow = ai.defineFlow(
  {
    name: 'urlRewritingToolFlow',
    inputSchema: UrlRewritingToolInputSchema,
    outputSchema: UrlRewritingToolOutputSchema,
  },
  async input => {
    const {output} = await urlRewritingToolPrompt(input);
    return output!;
  }
);
