
import { z } from 'zod';

// Define the input schema
export const AlexaRankCheckerInputSchema = z.object({
  domain: z.string().refine(val => /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(val), {
    message: 'Please enter a valid domain name (e.g., example.com).',
  }),
});
export type AlexaRankCheckerInput = z.infer<typeof AlexaRankCheckerInputSchema>;


// Define the output schema
export const AlexaRankCheckerOutputSchema = z.object({
  rank: z.number().describe('A simulated Alexa Rank.'),
  analysis: z.string().describe('A brief explanation of the result.'),
});
export type AlexaRankCheckerOutput = z.infer<typeof AlexaRankCheckerOutputSchema>;
