'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the keyword density of a website.
 *
 * It takes a website URL and a keyword as input and returns the density of the keyword on the page.
 *
 * @exports `checkKeywordDensity` - An async function that takes a URL and keyword and returns a promise
 *  resolving to a `CheckKeywordDensityOutput` object.
 * @exports `CheckKeywordDensityInput` - The input type for the `checkKeywordDensity` function.
 * @exports `CheckKeywordDensityOutput` - The output type for the `checkKeywordDensity` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const CheckKeywordDensityInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to check.'),
  keyword: z.string().describe('The keyword to check the density for.'),
});
export type CheckKeywordDensityInput = z.infer<typeof CheckKeywordDensityInputSchema>;

// Define the output schema
const CheckKeywordDensityOutputSchema = z.object({
  density: z.number().describe('The keyword density as a percentage.'),
  totalWords: z.number().describe('Total words on the page.'),
  keywordCount: z.number().describe('Number of times the keyword appears.'),
});
export type CheckKeywordDensityOutput = z.infer<typeof CheckKeywordDensityOutputSchema>;


// Define the wrapper function
export async function checkKeywordDensity(input: CheckKeywordDensityInput): Promise<CheckKeywordDensityOutput> {
  return checkKeywordDensityFlow(input);
}

// In a real application, you'd fetch the content of the URL.
// For this example, we'll use a mock text.
const fetchUrlContentTool = ai.defineTool(
    {
      name: 'fetchUrlContent',
      description: 'Fetches the text content of a given URL.',
      inputSchema: z.object({ url: z.string().url() }),
      outputSchema: z.object({ content: z.string() }),
    },
    async ({ url }) => {
      return {
        content: `
          Welcome to the world of advanced SEO tools. Our primary mission is to provide the best SEO tools
          to help your website rank higher. SEO is a complex field, but with the right tools, you can master it.
          This sample text will be analyzed for keyword density. The term 'SEO' appears multiple times to allow
          for a good density calculation. Remember that good SEO is not just about keyword stuffing, but about
          providing valuable content to your users. We believe our SEO tools will empower you to do just that.
          This is a sample text for testing the SEO keyword density.
        `,
      };
    }
);

// Define the prompt that uses the tool
const checkKeywordDensityPrompt = ai.definePrompt({
    name: 'checkKeywordDensityPrompt',
    input: { schema: CheckKeywordDensityInputSchema },
    output: { schema: CheckKeywordDensityOutputSchema },
    tools: [fetchUrlContentTool],
    prompt: `You are an SEO expert. A user wants to calculate the keyword density for a given URL and keyword.

    1. Use the 'fetchUrlContent' tool to get the text content of the provided URL.
    2. Count the total number of words in the content.
    3. Count how many times the specified keyword appears in the content (case-insensitive).
    4. Calculate the keyword density as a percentage: (Keyword Count / Total Words) * 100.
    5. Return the density, total word count, and keyword count.

    URL: {{{url}}}
    Keyword: {{{keyword}}}
    `,
});


// This is the main flow that orchestrates the process.
const checkKeywordDensityFlow = ai.defineFlow(
  {
    name: 'checkKeywordDensityFlow',
    inputSchema: CheckKeywordDensityInputSchema,
    outputSchema: CheckKeywordDensityOutputSchema,
  },
  async ({ url, keyword }) => {
    // Manually implement the logic for this demonstration.
    // An advanced agent could interpret the prompt directly.
    const { content } = await fetchUrlContentTool({ url });

    const words = content.trim().split(/\s+/);
    const totalWords = words.length;

    const lowercasedContent = content.toLowerCase();
    const lowercasedKeyword = keyword.toLowerCase();

    const keywordCount = (lowercasedContent.match(new RegExp(`\\b${lowercasedKeyword}\\b`, 'g')) || []).length;

    const density = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;

    return {
        density: parseFloat(density.toFixed(2)),
        totalWords,
        keywordCount,
    };
  }
);
