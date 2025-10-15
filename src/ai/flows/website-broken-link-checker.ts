'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking for broken links on a website.
 *
 * It takes a website URL and returns a list of broken links found.
 *
 * @exports `websiteBrokenLinkChecker` - An async function that takes a URL and returns a promise
 *  resolving to a `WebsiteBrokenLinkCheckerOutput` object.
 * @exports `WebsiteBrokenLinkCheckerInput` - The input type for the `websiteBrokenLinkChecker` function.
 * @exports `WebsiteBrokenLinkCheckerOutput` - The output type for the `websiteBrokenLinkChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const WebsiteBrokenLinkCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to check for broken links.'),
});
export type WebsiteBrokenLinkCheckerInput = z.infer<typeof WebsiteBrokenLinkCheckerInputSchema>;


// Define the output schema
const BrokenLinkSchema = z.object({
    linkUrl: z.string().url().describe('The URL of the broken link.'),
    sourcePage: z.string().url().describe('The page where the broken link was found.'),
    httpStatusCode: z.number().describe('The HTTP status code of the broken link (e.g., 404, 500).'),
});

const WebsiteBrokenLinkCheckerOutputSchema = z.object({
    brokenLinks: z.array(BrokenLinkSchema).describe('A list of broken links found on the website.'),
    totalLinksScanned: z.number().describe('The total number of links scanned.'),
});
export type WebsiteBrokenLinkCheckerOutput = z.infer<typeof WebsiteBrokenLinkCheckerOutputSchema>;

// Define the wrapper function
export async function websiteBrokenLinkChecker(input: WebsiteBrokenLinkCheckerInput): Promise<WebsiteBrokenLinkCheckerOutput> {
  return websiteBrokenLinkCheckerFlow(input);
}


const fetchAndFindBrokenLinksTool = ai.defineTool(
    {
      name: 'fetchAndFindBrokenLinks',
      description: 'Crawls a given URL, checks for broken links, and returns them.',
      inputSchema: z.object({ url: z.string().url() }),
      outputSchema: WebsiteBrokenLinkCheckerOutputSchema,
    },
    async ({ url }) => {
        // This is a mock. In a real application, you would crawl the site
        // and check the status of each link.
        return {
            totalLinksScanned: 158,
            brokenLinks: [
                { linkUrl: `https://example.com/non-existent-page`, sourcePage: `${url}/blog/post-1`, httpStatusCode: 404 },
                { linkUrl: `https://another-site.com/moved-permanently`, sourcePage: `${url}/about`, httpStatusCode: 404 },
                { linkUrl: `${url}/internal/broken-path`, sourcePage: `${url}/contact`, httpStatusCode: 404 },
                { linkUrl: `https://a-third-site.org/server-error`, sourcePage: `${url}/blog/post-2`, httpStatusCode: 500 },
            ],
      };
    }
);


// Define the prompt
const websiteBrokenLinkCheckerPrompt = ai.definePrompt({
  name: 'websiteBrokenLinkCheckerPrompt',
  input: {schema: WebsiteBrokenLinkCheckerInputSchema},
  output: {schema: WebsiteBrokenLinkCheckerOutputSchema},
  tools: [fetchAndFindBrokenLinksTool],
  prompt: `You are an SEO tool that finds broken links on a website.

1.  Use the 'fetchAndFindBrokenLinks' tool to crawl the provided URL.
2.  Return the results exactly as the tool provides them.

URL: {{{url}}}
`,
});

// Define the flow
const websiteBrokenLinkCheckerFlow = ai.defineFlow(
  {
    name: 'websiteBrokenLinkCheckerFlow',
    inputSchema: WebsiteBrokenLinkCheckerInputSchema,
    outputSchema: WebsiteBrokenLinkCheckerOutputSchema,
  },
  async input => {
    const {output} = await websiteBrokenLinkCheckerPrompt(input);
    return output!;
  }
);
