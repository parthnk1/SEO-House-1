
import { z } from 'zod';

export const MozrankCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the page to check the MozRank for.'),
});
export type MozrankCheckerInput = z.infer<typeof MozrankCheckerInputSchema>;

export const MozrankCheckerOutputSchema = z.object({
  mozRank: z.number().min(0).max(10).describe('A simulated MozRank score from 0 to 10.'),
  analysis: z.string().describe('A brief explanation of the factors contributing to the score.'),
});
export type MozrankCheckerOutput = z.infer<typeof MozrankCheckerOutputSchema>;
