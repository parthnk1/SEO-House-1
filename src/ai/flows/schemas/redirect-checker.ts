
import { z } from 'zod';

export const RedirectCheckerInputSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});
export type RedirectCheckerInput = z.infer<typeof RedirectCheckerInputSchema>;

export const RedirectStepSchema = z.object({
    url: z.string().url(),
    statusCode: z.number(),
    statusText: z.string(),
});

export const RedirectCheckerOutputSchema = z.object({
  redirectChain: z.array(RedirectStepSchema).describe('The chain of redirects found.'),
});
export type RedirectCheckerOutput = z.infer<typeof RedirectCheckerOutputSchema>;
