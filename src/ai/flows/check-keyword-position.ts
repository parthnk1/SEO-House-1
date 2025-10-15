'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the keyword position of a website.
 *
 * It takes a website URL and a keyword as input and returns the position of the website
 * in the search results for that keyword.
 *
 * @exports `checkKeywordPosition` - An async function that takes a URL and keyword and returns a promise
 *  resolving to a `CheckKeywordPositionOutput` object.
 * @exports `CheckKeywordPositionInput` - The input type for the `checkKeywordPosition` function.
 * @exports `CheckKeywordPositionOutput` - The output type for the `checkKeywordPosition` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const CheckKeywordPositionInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to check.'),
  keyword: z.string().describe('The keyword to check the position for.'),
});
export type CheckKeywordPositionInput = z.infer<typeof CheckKeywordPositionInputSchema>;

// Define the output schema
const CheckKeywordPositionOutputSchema = z.object({
  position: z.number().describe('The position of the website in the search results. Returns 0 if not found in top 100.'),
});
export type CheckKeywordPositionOutput = z.infer<typeof CheckKeywordPositionOutputSchema>;

// Define a tool for searching
const searchTool = ai.defineTool(
  {
    name: 'search',
    description: 'Performs a web search and returns a list of results.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.object({
      results: z.array(
        z.object({
          url: z.string().url(),
          title: z.string(),
          description: z.string(),
        })
      ),
    }),
  },
  async (input) => {
    // In a real application, this would call a real search API (e.g., Google Custom Search).
    // For demonstration, we'll return a mocked list of results that includes the target URL.
    const targetUrl = 'https://your-website.com'; // A known URL to check against
    const randomPosition = Math.floor(Math.random() * 20) + 1;
    
    const results = Array.from({ length: 25 }, (_, i) => {
        if (i + 1 === randomPosition) {
            return {
                url: targetUrl,
                title: 'Your Awesome Website',
                description: 'The best website on the internet for all your needs.'
            };
        }
        return {
            url: `https://example.com/page/${i + 1}`,
            title: `Example Title ${i + 1}`,
            description: `This is a mock search result number ${i + 1}.`,
        };
    });

    return { results };
  }
);


// Define the wrapper function
export async function checkKeywordPosition(input: CheckKeywordPositionInput): Promise<CheckKeywordPositionOutput> {
  return checkKeywordPositionFlow(input);
}

// Define the prompt that uses the search tool
const checkKeywordPositionPrompt = ai.definePrompt({
    name: 'checkKeywordPositionPrompt',
    input: { schema: CheckKeywordPositionInputSchema },
    output: { schema: CheckKeyword-position-output-schema },
    tools: [searchTool],
    prompt: `You are an SEO assistant. A user wants to know the search engine ranking for their website URL for a specific keyword.
    
    1. Use the 'search' tool with the provided keyword.
    2. In the search results, find the rank of the provided URL. The rank is its position in the list (1-indexed).
    3. If the URL is found, return its position.
    4. If the URL is not found in the results, return a position of 0.

    Keyword: {{{keyword}}}
    URL: {{{url}}}
    `,
});

// This is the main flow that orchestrates the process.
const checkKeywordPositionFlow = ai.defineFlow(
  {
    name: 'checkKeywordPositionFlow',
    inputSchema: CheckKeywordPositionInputSchema,
    outputSchema: CheckKeywordPositionOutputSchema,
  },
  async ({ url, keyword }) => {
    // The prompt now uses the tool to get the position.
    // However, to make it more deterministic for this example, we'll manually call the tool
    // and find the position. In a more advanced AI agent, the prompt above would be sufficient.
    const searchResults = await searchTool({ query: keyword });
    const targetDomain = new URL(url).hostname;

    const position = searchResults.results.findIndex(result => {
        try {
            return new URL(result.url).hostname === targetDomain;
        } catch {
            return false;
        }
    }) + 1;

    return { position: position > 0 ? position : 0 };
  }
);
