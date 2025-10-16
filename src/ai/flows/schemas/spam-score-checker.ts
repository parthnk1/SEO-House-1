
import { z } from 'zod';

export const SpamScoreCheckerInputSchema = z.object({
  domain: z.string().describe('The domain to check the spam score for.'),
});
export type SpamScoreCheckerInput = z.infer<typeof SpamScoreCheckerInputSchema>;

export const SpamScoreCheckerOutputSchema = z.object({
  spamScore: z.number().min(0).max(100).describe('A score from 0-100 indicating the spamminess of the domain.'),
  analysis: z.string().describe('A brief analysis of the factors contributing to the spam score.'),
});
export type SpamScoreCheckerOutput = z.infer<typeof SpamScoreCheckerOutputSchema>;
