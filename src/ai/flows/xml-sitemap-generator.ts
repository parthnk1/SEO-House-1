'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an XML sitemap.
 *
 * It takes a base URL and generates a list of URLs to be included in a sitemap.
 *
 * @exports `xmlSitemapGenerator` - An async function that takes a URL and returns a promise
 *  resolving to a `XmlSitemapGeneratorOutput` object.
 * @exports `XmlSitemapGeneratorInput` - The input type for the `xmlSitemapGenerator` function.
 * @exports `XmlSitemapGeneratorOutput` - The output type for the `xmlSitemapGenerator` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const XmlSitemapGeneratorInputSchema = z.object({
  url: z.string().url().describe('The base URL of the website to generate a sitemap for.'),
});
export type XmlSitemapGeneratorInput = z.infer<typeof XmlSitemapGeneratorInputSchema>;

// Define the output schema
const XmlSitemapGeneratorOutputSchema = z.object({
  sitemapContent: z.string().describe('The full XML content of the generated sitemap.'),
});
export type XmlSitemapGeneratorOutput = z.infer<typeof XmlSitemapGeneratorOutputSchema>;

// Define the wrapper function
export async function xmlSitemapGenerator(input: XmlSitemapGeneratorInput): Promise<XmlSitemapGeneratorOutput> {
  return xmlSitemapGeneratorFlow(input);
}


const generateSitemapTool = ai.defineTool(
    {
        name: 'generateSitemapFromUrl',
        description: 'Generates a sitemap XML content from a base URL.',
        inputSchema: z.object({ url: z.string().url() }),
        outputSchema: XmlSitemapGeneratorOutputSchema,
    },
    async ({ url }) => {
        const today = new Date().toISOString().split('T')[0];
        const pages = [
            '/',
            '/about',
            '/blog',
            '/contact',
            '/services',
            '/blog/post-1',
            '/blog/post-2',
        ];

        const urlset = pages.map(page => 
            `
  <url>
    <loc>${new URL(page, url).href}</loc>
    <lastmod>${today}</lastmod>
    <priority>${page === '/' ? '1.00' : '0.80'}</priority>
  </url>`
        ).join('');

        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

        return { sitemapContent: sitemapContent.trim() };
    }
);


// Define the prompt
const xmlSitemapGeneratorPrompt = ai.definePrompt({
  name: 'xmlSitemapGeneratorPrompt',
  input: {schema: XmlSitemapGeneratorInputSchema},
  output: {schema: XmlSitemapGeneratorOutputSchema},
  tools: [generateSitemapTool],
  prompt: `You are an XML sitemap generator. Use the 'generateSitemapFromUrl' tool to create a sitemap for the given URL. Return the content exactly as the tool provides it.

URL: {{{url}}}
`,
});

// Define the flow
const xmlSitemapGeneratorFlow = ai.defineFlow(
  {
    name: 'xmlSitemapGeneratorFlow',
    inputSchema: XmlSitemapGeneratorInputSchema,
    outputSchema: XmlSitemapGeneratorOutputSchema,
  },
  async input => {
    const {output} = await xmlSitemapGeneratorPrompt(input);
    return output!;
  }
);
