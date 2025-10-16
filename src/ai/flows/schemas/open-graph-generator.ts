import { z } from 'zod';

export const OpenGraphGeneratorInputSchema = z.object({
  url: z.string().url().describe('The URL of the page to generate Open Graph tags for.'),
  title: z.string().optional().describe('An optional title to use instead of the one from the page.'),
  description: z.string().optional().describe('An optional description to use instead of the one from the page.'),
});
export type OpenGraphGeneratorInput = z.infer<typeof OpenGraphGeneratorInputSchema>;

export const OpenGraphGeneratorOutputSchema = z.object({
  ogTitle: z.string().describe('The generated `og:title` tag content.'),
  ogType: z.string().describe('The generated `og:type` tag content, usually "website" or "article".'),
  ogUrl: z.string().url().describe('The generated `og:url` tag content.'),
  ogDescription: z.string().describe('The generated `og:description` tag content.'),
  ogImage: z.string().url().describe('A suggested `og:image` URL.'),
});
export type OpenGraphGeneratorOutput = z.infer<typeof OpenGraphGeneratorOutputSchema>;
