'use server';

/**
 * @fileOverview This file defines a Genkit flow for snooping on a webpage.
 *
 * It takes a URL and returns its source code and HTTP headers.
 *
 * @exports `websitePageSnooper` - An async function that takes a URL and returns a promise
 *  resolving to a `WebsitePageSnooperOutput` object.
 * @exports `WebsitePageSnooperInput` - The input type for the `websitePageSnooper` function.
 * @exports `WebsitePageSnooperOutput` - The output type for the `websitePageSnooper` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const WebsitePageSnooperInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to snoop on.'),
});
export type WebsitePageSnooperInput = z.infer<typeof WebsitePageSnooperInputSchema>;

const HeaderSchema = z.object({
    key: z.string(),
    value: z.string(),
});

// Define the output schema
const WebsitePageSnooperOutputSchema = z.object({
  sourceCode: z.string().describe('The full HTML source code of the page.'),
  headers: z.array(HeaderSchema).describe('The HTTP response headers.'),
});
export type WebsitePageSSnooperOutput = z.infer<typeof WebsitePageSnooperOutputSchema>;

// Define the wrapper function
export async function websitePageSnooper(input: WebsitePageSnooperInput): Promise<WebsitePageSSnooperOutput> {
  return websitePageSnooperFlow(input);
}

const fetchUrlContentTool = ai.defineTool(
    {
      name: 'fetchPageSourceAndHeaders',
      description: 'Fetches the source code and headers of a given URL.',
      inputSchema: z.object({ url: z.string().url() }),
      outputSchema: WebsitePageSnooperOutputSchema,
    },
    async ({ url }) => {
      // In a real app, you would fetch and parse the URL.
      // For demonstration, we are returning mock content.
      return {
        sourceCode: `<!DOCTYPE html>
<html>
<head>
  <title>Example Page</title>
  <meta name="description" content="This is an example page.">
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a paragraph.</p>
</body>
</html>`,
        headers: [
            { key: 'Content-Type', value: 'text/html; charset=utf-8' },
            { key: 'Content-Length', value: '123' },
            { key: 'Connection', value: 'keep-alive' },
            { key: 'Date', value: new Date().toUTCString() },
            { key: 'Server', value: 'MockServer/1.0' },
        ],
      };
    }
  );


// Define the prompt
const websitePageSnooperPrompt = ai.definePrompt({
  name: 'websitePageSnooperPrompt',
  input: {schema: WebsitePageSnooperInputSchema},
  output: {schema: WebsitePageSnooperOutputSchema},
  tools: [fetchUrlContentTool],
  prompt: `You are a web inspection tool. Use the 'fetchPageSourceAndHeaders' tool to get the source code and headers for the given URL. Return the data exactly as the tool provides it.

URL: {{{url}}}
`,
});

// Define the flow
const websitePageSnooperFlow = ai.defineFlow(
  {
    name: 'websitePageSnooperFlow',
    inputSchema: WebsitePageSnooperInputSchema,
    outputSchema: WebsitePageSnooperOutputSchema,
  },
  async input => {
    const {output} = await websitePageSnooperPrompt(input);
    return output!;
  }
);
