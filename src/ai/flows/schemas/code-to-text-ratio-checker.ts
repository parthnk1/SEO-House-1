
import { z } from 'zod';

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
