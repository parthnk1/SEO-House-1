
import { z } from 'zod';

export const IndexPagesCheckerInputSchema = z.object({
  domain: z.string().describe('The domain to check for indexed pages.'),
});
export type IndexPagesCheckerInput = z.infer<typeof IndexPagesCheckerInputSchema>;

export const IndexPagesCheckerOutputSchema = z.object({
  indexedPages: z.number().describe('The estimated number of pages indexed by search engines.'),
  lastChecked: z.string().datetime().describe('The timestamp when the check was performed.'),
});
export type IndexPagesCheckerOutput = z.infer<typeof IndexPagesCheckerOutputSchema>;
