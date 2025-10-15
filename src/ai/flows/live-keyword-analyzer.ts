'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing keyword usage on a live webpage.
 *
 * It takes a URL and returns an analysis of keywords found on the page.
 *
 * @exports `liveKeywordAnalyzer` - An async function that takes a URL and returns a promise
 *  resolving to a `LiveKeywordAnalyzerOutput` object.
 * @exports `LiveKeywordAnalyzerInput` - The input type for the `liveKeywordAnalyzer` function.
 * @exports `LiveKeywordAnalyzerOutput` - The output type for the `liveKeywordAnalyzer` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const LiveKeywordAnalyzerInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to analyze.'),
});
export type LiveKeywordAnalyzerInput = z.infer<typeof LiveKeywordAnalyzerInputSchema>;

// Define the output schema for a single keyword
const KeywordAnalysisSchema = z.object({
  keyword: z.string().describe('The keyword found on the page.'),
  count: z.number().describe('How many times the keyword appeared.'),
  inTitle: z.boolean().describe('Whether the keyword appears in the page title.'),
  inHeadings: z.boolean().describe('Whether the keyword appears in any headings (h1-h6).'),
});


// Define the output schema
const LiveKeywordAnalyzerOutputSchema = z.object({
  title: z.string().describe('The title of the webpage.'),
  analysis: z.array(KeywordAnalysisSchema).describe('An analysis of the top 5-10 keywords.'),
});
export type LiveKeywordAnalyzerOutput = z.infer<typeof LiveKeywordAnalyzerOutputSchema>;

// Define the wrapper function
export async function liveKeywordAnalyzer(input: LiveKeywordAnalyzerInput): Promise<LiveKeywordAnalyzerOutput> {
  return liveKeywordAnalyzerFlow(input);
}

const fetchAndAnalyzeTool = ai.defineTool(
    {
      name: 'fetchAndAnalyzeContent',
      description: 'Fetches the content of a URL and analyzes its keywords.',
      inputSchema: z.object({ url: z.string().url() }),
      outputSchema: LiveKeywordAnalyzerOutputSchema,
    },
    async ({ url }) => {
      // In a real application, you would fetch and parse the HTML from the URL.
      // For this demo, we'll return mock data.
      return {
        title: "The Ultimate Guide to Advanced SEO Techniques",
        analysis: [
          { keyword: "SEO", count: 12, inTitle: true, inHeadings: true },
          { keyword: "link building", count: 8, inTitle: false, inHeadings: true },
          { keyword: "keyword research", count: 6, inTitle: false, inHeadings: true },
          { keyword: "technical SEO", count: 4, inTitle: false, inHeadings: false },
          { keyword: "content strategy", count: 3, inTitle: false, inHeadings: false },
          { keyword: "SERP", count: 5, inTitle: false, inHeadings: false },
        ]
      };
    }
  );

// Define the prompt
const liveKeywordAnalyzerPrompt = ai.definePrompt({
  name: 'liveKeywordAnalyzerPrompt',
  input: {schema: LiveKeywordAnalyzerInputSchema},
  output: {schema: LiveKeywordAnalyzerOutputSchema},
  tools: [fetchAndAnalyzeTool],
  prompt: `You are an SEO analyst. Use the 'fetchAndAnalyzeContent' tool to analyze the provided URL.
  
  Return the analysis exactly as the tool provides it.

  URL: {{{url}}}
`,
});

// Define the flow
const liveKeywordAnalyzerFlow = ai.defineFlow(
  {
    name: 'liveKeywordAnalyzerFlow',
    inputSchema: LiveKeywordAnalyzerInputSchema,
    outputSchema: LiveKeywordAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await liveKeywordAnalyzerPrompt(input);
    return output!;
  }
);
