
import { z } from 'zod';

export const PageAuthorityCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the page to check the authority of.'),
});
export type PageAuthorityCheckerInput = z.infer<typeof PageAuthorityCheckerInputSchema>;

export const PageAuthorityCheckerOutputSchema = z.object({
  pageAuthority: z.number().min(1).max(100).describe('A simulated Page Authority score from 1 to 100.'),
  analysis: z.string().describe('A brief explanation of the factors contributing to the score.'),
});
export type PageAuthorityCheckerOutput = z.infer<typeof PageAuthorityCheckerOutputSchema>;
