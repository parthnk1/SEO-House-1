import { z } from 'zod';

export const OpenGraphCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the page to analyze.'),
});
export type OpenGraphCheckerInput = z.infer<typeof OpenGraphCheckerInputSchema>;

export const OpenGraphCheckerOutputSchema = z.object({
  ogTitle: z.string().optional().describe('The content of the `og:title` tag.'),
  ogType: z.string().optional().describe('The content of the `og:type` tag.'),
  ogUrl: z.string().url().optional().describe('The content of the `og:url` tag.'),
  ogDescription: z.string().optional().describe('The content of the `og:description` tag.'),
  ogImage: z.string().url().optional().describe('The content of the `og:image` tag.'),
});
export type OpenGraphCheckerOutput = z.infer<typeof OpenGraphCheckerOutputSchema>;
