'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking an essay.
 *
 * It takes essay text and returns a score and feedback.
 *
 * @exports `essayChecker` - An async function that takes an essay and returns a promise
 *  resolving to a `EssayCheckerOutput` object.
 * @exports `EssayCheckerInput` - The input type for the `essayChecker` function.
 * @exports `EssayCheckerOutput` - The output type for the `essayChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const EssayCheckerInputSchema = z.object({
  essay: z.string().min(50, 'Essay must be at least 50 characters long.'),
});
export type EssayCheckerInput = z.infer<typeof EssayCheckerInputSchema>;

export const EssayCheckerOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('A score from 0 to 100 for the essay.'),
  feedback: z.string().describe('Detailed feedback on the essay, including grammar, style, and clarity.'),
});
export type EssayCheckerOutput = z.infer<typeof EssayCheckerOutputSchema>;

export async function essayChecker(input: EssayCheckerInput): Promise<EssayCheckerOutput> {
  return essayCheckerFlow(input);
}

const essayCheckerPrompt = ai.definePrompt({
  name: 'essayCheckerPrompt',
  input: {schema: EssayCheckerInputSchema},
  output: {schema: EssayCheckerOutputSchema},
  prompt: `You are an expert essay reviewer. Analyze the following essay for grammar, spelling, style, clarity, and overall quality.

Provide a score from 0 to 100, where 100 is excellent.
Provide constructive feedback, highlighting strengths and areas for improvement. Format the feedback with markdown. Use headings for different sections like "Grammar & Spelling", "Style & Clarity", and "Overall Impression".

Essay:
{{{essay}}}
`,
});

const essayCheckerFlow = ai.defineFlow(
  {
    name: 'essayCheckerFlow',
    inputSchema: EssayCheckerInputSchema,
    outputSchema: EssayCheckerOutputSchema,
  },
  async input => {
    const {output} = await essayCheckerPrompt(input);
    return output!;
  }
);
