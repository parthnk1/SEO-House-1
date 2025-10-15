'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the code to text ratio of a webpage.
 *
 * @exports `codeToTextRatioChecker` - An async function that takes a URL and returns a promise
 * resolving to a `CodeToTextRatioCheckerOutput` object.
 * @exports `CodeToTextRatioCheckerInput` - The input type for the `codeToTextRatioChecker` function.
 * @exports `CodeToTextRatioCheckerOutput` - The output type for the `codeToTextRatioChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const CodeToTextRatioCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to analyze.'),
});
export type CodeToTextRatioCheckerInput = z.infer<typeof CodeToTextRatioCheckerInputSchema>;

export const CodeToTextRatioCheckerOutputSchema = z.object({
  textRatio: z.number().describe('The percentage of text on the page.'),
  codeSize: z.number().describe('The size of the HTML code in bytes.'),
  textSize: z.number().describe('The size of the visible text in bytes.'),
  totalSize: z.number().describe('The total size of the page in bytes.'),
});
export type CodeToTextRatioCheckerOutput = z.infer<typeof CodeToTextRatioCheckerOutputSchema>;

export async function codeToTextRatioChecker(input: CodeToTextRatioCheckerInput): Promise<CodeToTextRatioCheckerOutput> {
  return codeToTextRatioCheckerFlow(input);
}

const codeToTextRatioCheckerFlow = ai.defineFlow(
  {
    name: 'codeToTextRatioCheckerFlow',
    inputSchema: CodeToTextRatioCheckerInputSchema,
    outputSchema: CodeToTextRatioCheckerOutputSchema,
  },
  async ({ url }) => {
    // In a real application, you would fetch the HTML from the URL.
    // For this demo, we'll simulate the data.
    const mockHtmlContent = `
      <!DOCTYPE html>
      <html>
        <head><title>My Awesome Page</title></head>
        <body>
          <h1>Welcome</h1>
          <p>This is some great content about SEO. It is important to have a good amount of text.</p>
        </body>
      </html>
    `;

    const codeSize = mockHtmlContent.length;
    const textContent = 'Welcome This is some great content about SEO. It is important to have a good amount of text.';
    const textSize = textContent.length;
    const totalSize = codeSize;
    const textRatio = totalSize > 0 ? (textSize / totalSize) * 100 : 0;

    return {
      textRatio: parseFloat(textRatio.toFixed(2)),
      codeSize,
      textSize,
      totalSize,
    };
  }
);
