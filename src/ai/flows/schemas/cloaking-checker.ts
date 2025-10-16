import { z } from 'zod';

export const CloakingCheckerInputSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});
export type CloakingCheckerInput = z.infer<typeof CloakingCheckerInputSchema>;

export const CloakingCheckerOutputSchema = z.object({
  isCloaking: z.boolean().describe('Whether the website is suspected of cloaking.'),
  analysis: z.string().describe('A brief analysis of the findings.'),
});
export type CloakingCheckerOutput = z.infer<typeof CloakingCheckerOutputSchema>;
