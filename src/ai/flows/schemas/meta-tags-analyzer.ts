'use server';

import { z } from 'zod';

export const MetaTagsAnalyzerInputSchema = z.object({
  url: z.string().url().describe('The URL of the page to analyze.'),
});
export type MetaTagsAnalyzerInput = z.infer<typeof MetaTagsAnalyzerInputSchema>;

export const MetaTagsAnalyzerOutputSchema = z.object({
  title: z.string().describe('The content of the <title> tag.'),
  description: z.string().describe('The content of the meta description tag.'),
  keywords: z.string().optional().describe('The content of the meta keywords tag, if present.'),
  viewport: z.string().optional().describe('The content of the meta viewport tag.'),
  robots: z.string().optional().describe('The content of the meta robots tag.'),
});
export type MetaTagsAnalyzerOutput = z.infer<typeof MetaTagsAnalyzerOutputSchema>;
