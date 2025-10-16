import { z } from 'zod';

// Define the input schema
export const AlexaRankComparisonInputSchema = z.object({
  domains: z.array(z.string().min(1, 'Domain cannot be empty')).min(1, 'Please enter at least one domain.'),
});
export type AlexaRankComparisonInput = z.infer<typeof AlexaRankComparisonInputSchema>;

const RankResultSchema = z.object({
    domain: z.string(),
    rank: z.number().describe('A simulated Alexa Rank.'),
});

// Define the output schema
export const AlexaRankComparisonOutputSchema = z.object({
  results: z.array(RankResultSchema),
});
export type AlexaRankComparisonOutput = z.infer<typeof AlexaRankComparisonOutputSchema>;
