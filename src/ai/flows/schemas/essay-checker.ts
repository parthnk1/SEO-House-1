import { z } from 'zod';

export const EssayCheckerInputSchema = z.object({
  essay: z.string().min(50, 'Essay must be at least 50 characters long.'),
});
export type EssayCheckerInput = z.infer<typeof EssayCheckerInputSchema>;

export const EssayCheckerOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('A score from 0 to 100 for the essay.'),
  feedback: z.string().describe('Detailed feedback on the essay, including grammar, style, and clarity.'),
});
export type EssayCheckerOutput = z.infer<typeof EssayCheckerOutputSchema>;
