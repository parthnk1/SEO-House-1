'use server';

/**
 * @fileOverview This file defines a Genkit flow for counting links on a website.
 *
 * It takes a website URL and returns the total, internal, and external link counts.
 *
 * @exports `websiteLinkCountChecker` - An async function that takes a URL and returns a promise
 *  resolving to a `WebsiteLinkCountCheckerOutput` object.
 * @exports `WebsiteLinkCountCheckerInput` - The input type for the `websiteLinkCountChecker` function.
 * @exports `WebsiteLinkCountCheckerOutput` - The output type for the `websiteLinkCountChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const WebsiteLinkCountCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to check for links.'),
});
export type WebsiteLinkCountCheckerInput = z.infer<typeof WebsiteLinkCountCheckerInputSchema>;


// Define the output schema
const WebsiteLinkCountCheckerOutputSchema = z.object({
    totalLinks: z.number().describe('The total number of links on the page.'),
    internalLinks: z.number().describe('The number of internal links.'),
    externalLinks: z.number().describe('The number of external links.'),
    links: z.array(z.object({
        url: z.string().url(),
        type: z.enum(['internal', 'external'])
    })).describe('A list of up to 20 example links found on the page.')
});
export type WebsiteLinkCountCheckerOutput = z.infer<typeof WebsiteLinkCountCheckerOutputSchema>;

// Define the wrapper function
export async function websiteLinkCountChecker(input: WebsiteLinkCountCheckerInput): Promise<WebsiteLinkCountCheckerOutput> {
  return websiteLinkCountCheckerFlow(input);
}


const fetchUrlContentTool = ai.defineTool(
    {
      name: 'fetchUrlContentForLinkCounting',
      description: 'Fetches the HTML content of a given URL for the purpose of counting links.',
      inputSchema: z.object({ url: z.string().url() }),
      outputSchema: z.object({ htmlContent: z.string() }),
    },
    async ({ url }) => {
        // This is a mock. In a real application, you would fetch the actual HTML content.
        return {
            htmlContent: `
                <html>
                    <head><title>Sample Page</title></head>
                    <body>
                        <h1>Link Counting Example</h1>
                        <a href="/about">About Us</a>
                        <a href="https://www.google.com">Google</a>
                        <a href="/services/development">Development Services</a>
                        <a href="${url}/contact">Contact Us</a>
                        <a href="https://www.github.com">GitHub</a>
                        <a href="https://example.com/other-page">Another External Link</a>
                        <a href="#section">Section Anchor</a>
                        <a href="mailto:test@example.com">Email Us</a>
                    </body>
                </html>
            `,
      };
    }
);


// Define the prompt
const websiteLinkCountCheckerPrompt = ai.definePrompt({
  name: 'websiteLinkCountCheckerPrompt',
  input: {schema: WebsiteLinkCountCheckerInputSchema},
  output: {schema: WebsiteLinkCountCheckerOutputSchema},
  tools: [fetchUrlContentTool],
  prompt: `You are an SEO tool that counts the number of links on a webpage.

1.  Use the 'fetchUrlContentForLinkCounting' tool to get the HTML of the provided URL.
2.  Parse the HTML to find all anchor (\`<a>\`) tags with an \`href\` attribute.
3.  Count the total number of valid HTTP/HTTPS links. Ignore mailto, tel, and anchor links (starting with #).
4.  Categorize each link as 'internal' or 'external'. A link is internal if it points to the same domain as the provided URL. Otherwise, it's external.
5.  Count the number of internal and external links.
6.  Return the total, internal, and external link counts, along with a sample list of up to 20 links found.

URL: {{{url}}}
`,
});

// Define the flow
const websiteLinkCountCheckerFlow = ai.defineFlow(
  {
    name: 'websiteLinkCountCheckerFlow',
    inputSchema: WebsiteLinkCountCheckerInputSchema,
    outputSchema: WebsiteLinkCountCheckerOutputSchema,
  },
  async input => {
    // A more advanced agent could interpret the prompt directly.
    // For this demonstration, we'll implement the logic manually.
    const { htmlContent } = await fetchUrlContentTool({ url: input.url });
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi;
    let match;
    const allLinks = [];

    while ((match = linkRegex.exec(htmlContent)) !== null) {
      allLinks.push(match[1]);
    }
    
    const pageUrl = new URL(input.url);
    const pageHostname = pageUrl.hostname;

    let internalLinks = 0;
    let externalLinks = 0;
    const links: { url: string; type: 'internal' | 'external' }[] = [];

    for (const link of allLinks) {
        if (!link || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:')) {
            continue;
        }

        try {
            const absoluteUrl = new URL(link, input.url);
            if (absoluteUrl.protocol !== 'http:' && absoluteUrl.protocol !== 'https:') {
                continue;
            }

            let type: 'internal' | 'external';
            if (absoluteUrl.hostname === pageHostname) {
                internalLinks++;
                type = 'internal';
            } else {
                externalLinks++;
                type = 'external';
            }

            if (links.length < 20) {
                links.push({ url: absoluteUrl.toString(), type });
            }
        } catch (e) {
            // Ignore invalid URLs
        }
    }


    return {
        totalLinks: internalLinks + externalLinks,
        internalLinks,
        externalLinks,
        links,
    };
  }
);
