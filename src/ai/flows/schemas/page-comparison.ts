import { z } from 'zod';

export const PageComparisonInputSchema = z.object({
  url1: z.string().url(),
  url2: z.string().url(),
});
export type PageComparisonInput = z.infer<typeof PageComparisonInputSchema>;

const PageDataSchema = z.object({
    title: z.string().describe('The title of the page.'),
    description: z.string().describe('The meta description of the page.'),
    wordCount: z.number().describe('The total word count of the page.'),
    imageCount: z.number().describe('The number of images on the page.'),
});

export const PageComparisonOutputSchema = z.object({
  page1: PageDataSchema.describe('The analysis of the first URL.'),
  page2: PageDataSchema.describe('The analysis of the second URL.'),
});
export type PageComparisonOutput = z.infer<typeof PageComparisonOutputSchema>;
