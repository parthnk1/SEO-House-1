
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the code to text ratio of a webpage.
 *
 * @exports `codeToTextRatioChecker` - An async function that takes a URL and returns a promise
 * resolving to a `CodeToTextRatioCheckerOutput` object.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CodeToTextRatioCheckerInputSchema, CodeToTextRatioCheckerOutputSchema, type CodeToTextRatioCheckerInput, type CodeToTextRatioCheckerOutput } from './schemas/code-to-text-ratio-checker';


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
