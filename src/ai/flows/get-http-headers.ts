'use server';

/**
 * @fileOverview This file defines a Genkit flow for fetching HTTP headers.
 *
 * @exports `getHttpHeaders` - An async function that takes a URL and returns a promise
 * resolving to a `GetHttpHeadersOutput` object.
 * @exports `GetHttpHeadersInput` - The input type for the `getHttpHeaders` function.
 * @exports `GetHttpHeadersOutput` - The output type for the `getHttpHeaders` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GetHttpHeadersInputSchema = z.object({
  url: z.string().url().describe('The URL of the page to fetch headers from.'),
});
export type GetHttpHeadersInput = z.infer<typeof GetHttpHeadersInputSchema>;

const HeaderSchema = z.object({
    key: z.string(),
    value: z.string(),
});

export const GetHttpHeadersOutputSchema = z.object({
  headers: z.array(HeaderSchema).describe('The HTTP response headers.'),
});
export type GetHttpHeadersOutput = z.infer<typeof GetHttpHeadersOutputSchema>;

export async function getHttpHeaders(input: GetHttpHeadersInput): Promise<GetHttpHeadersOutput> {
  return getHttpHeadersFlow(input);
}


const fetchHeadersTool = ai.defineTool(
    {
      name: 'fetchHeaders',
      description: 'Fetches the HTTP response headers from a given URL.',
      inputSchema: GetHttpHeadersInputSchema,
      outputSchema: GetHttpHeadersOutputSchema,
    },
    async ({ url }) => {
      // In a real application, you'd make an HTTP HEAD request.
      // For this demo, we'll return mock data.
      return {
        headers: [
            { key: 'Content-Type', value: 'text/html; charset=utf-8' },
            { key: 'Content-Length', value: '12345' },
            { key: 'Connection', value: 'keep-alive' },
            { key: 'Date', value: new Date().toUTCString() },
            { key: 'Server', value: 'MockServer/1.0' },
            { key: 'Cache-Control', value: 'public, max-age=3600' },
            { key: 'ETag', value: '"ab123-cd456-ef789"' },
        ],
      };
    }
);


const getHttpHeadersFlow = ai.defineFlow(
  {
    name: 'getHttpHeadersFlow',
    inputSchema: GetHttpHeadersInputSchema,
    outputSchema: GetHttpHeadersOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `You are a web inspection tool. Use the 'fetchHeaders' tool to get the HTTP headers for the provided URL. Return the data exactly as the tool provides it. URL: ${input.url}`,
      tools: [fetchHeadersTool],
      output: {
          schema: GetHttpHeadersOutputSchema
      }
    });
    return output!;
  }
);
