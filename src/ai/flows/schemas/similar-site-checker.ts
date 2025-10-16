
import { z } from 'zod';

// Define the input schema
export const SimilarSiteCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to find similar sites for.'),
});
export type SimilarSiteCheckerInput = z.infer<typeof SimilarSiteCheckerInputSchema>;

// Define the output schema for a single similar site
const SimilarSiteSchema = z.object({
    url: z.string().url().describe('The URL of the similar website.'),
    reason: z.string().describe('A brief explanation of why this site is considered similar.'),
});

// Define the output schema
export const SimilarSiteCheckerOutputSchema = z.object({
  similarSites: z.array(SimilarSiteSchema).describe('A list of similar websites found.'),
});
export type SimilarSiteCheckerOutput = z.infer<typeof SimilarSiteCheckerOutputSchema>;
