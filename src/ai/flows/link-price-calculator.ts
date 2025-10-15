'use server';

/**
 * @fileOverview This file defines a Genkit flow for estimating the price of a backlink.
 *
 * It takes a website URL and returns an estimated price for a backlink from that site.
 *
 * @exports `linkPriceCalculator` - An async function that takes a URL and returns a promise
 *  resolving to a `LinkPriceCalculatorOutput` object.
 * @exports `LinkPriceCalculatorInput` - The input type for the `linkPriceCalculator` function.
 * @exports `LinkPriceCalculatorOutput` - The output type for the `linkPriceCalculator` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const LinkPriceCalculatorInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to estimate the backlink price for.'),
});
export type LinkPriceCalculatorInput = z.infer<typeof LinkPriceCalculatorInputSchema>;

// Define the output schema
const LinkPriceCalculatorOutputSchema = z.object({
  estimatedPrice: z.number().describe('The estimated price for a backlink in USD.'),
  domainAuthority: z.number().describe('The domain authority of the website (1-100).'),
  niche: z.string().describe('The perceived niche or topic of the website.'),
  reasoning: z.string().describe('A brief explanation of how the price was estimated.'),
});
export type LinkPriceCalculatorOutput = z.infer<typeof LinkPriceCalculatorOutputSchema>;

// Define the wrapper function
export async function linkPriceCalculator(input: LinkPriceCalculatorInput): Promise<LinkPriceCalculatorOutput> {
  return linkPriceCalculatorFlow(input);
}

// Define the prompt
const linkPriceCalculatorPrompt = ai.definePrompt({
  name: 'linkPriceCalculatorPrompt',
  input: {schema: LinkPriceCalculatorInputSchema},
  output: {schema: LinkPriceCalculatorOutputSchema},
  prompt: `You are an SEO expert who specializes in valuing backlinks. For the given website URL, estimate the price of a single "dofollow" backlink.

Provide:
- A realistic estimated price in USD.
- A plausible domain authority score (1-100).
- The primary niche or topic of the website.
- A brief, one-sentence reasoning for your price estimation, considering factors like authority, niche, and typical market rates.

URL: {{{url}}}
`,
});

// Define the flow
const linkPriceCalculatorFlow = ai.defineFlow(
  {
    name: 'linkPriceCalculatorFlow',
    inputSchema: LinkPriceCalculatorInputSchema,
    outputSchema: LinkPriceCalculatorOutputSchema,
  },
  async input => {
    const {output} = await linkPriceCalculatorPrompt(input);
    return output!;
  }
);
