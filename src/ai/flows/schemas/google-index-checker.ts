
import { z } from 'zod';

export const GoogleIndexCheckerInputSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});
export type GoogleIndexCheckerInput = z.infer<typeof GoogleIndexCheckerInputSchema>;

export const GoogleIndexCheckerOutputSchema = z.object({
  isIndexed: z.boolean().describe('Whether the page is indexed by Google.'),
  indexedOn: z.string().datetime().optional().describe('The date the page was last indexed.'),
});
export type GoogleIndexCheckerOutput = z.infer<typeof GoogleIndexCheckerOutputSchema>;
