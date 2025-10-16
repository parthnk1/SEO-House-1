import { z } from 'zod';

export const GoogleCacheCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL to check the Google cache for.'),
});
export type GoogleCacheCheckerInput = z.infer<typeof GoogleCacheCheckerInputSchema>;

export const GoogleCacheCheckerOutputSchema = z.object({
  isCached: z.boolean().describe('Whether the page is in Google\'s cache.'),
  cacheDate: z.string().datetime().optional().describe('The date the cache was taken.'),
  cacheUrl: z.string().url().optional().describe('The URL to the cached version of the page.'),
});
export type GoogleCacheCheckerOutput = z.infer<typeof GoogleCacheCheckerOutputSchema>;
