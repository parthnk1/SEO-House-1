'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the Google Cache of a website.
 *
 * @exports `googleCacheChecker` - An async function that takes a URL and returns a promise
 * resolving to a `GoogleCacheCheckerOutput` object.
 * @exports `GoogleCacheCheckerInput` - The input type for the `googleCacheChecker` function.
 * @exports `GoogleCacheCheckerOutput` - The output type for the `googleCacheChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

export async function googleCacheChecker(input: GoogleCacheCheckerInput): Promise<GoogleCacheCheckerOutput> {
  return googleCacheCheckerFlow(input);
}

const googleCacheCheckerFlow = ai.defineFlow(
  {
    name: 'googleCacheCheckerFlow',
    inputSchema: GoogleCacheCheckerInputSchema,
    outputSchema: GoogleCacheCheckerOutputSchema,
  },
  async ({ url }) => {
    // In a real application, you'd try to access the Google Cache URL.
    // For this demo, we'll simulate it.
    const isCached = Math.random() > 0.1; // 90% chance of being cached

    if (isCached) {
      const cacheDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString();
      return {
        isCached: true,
        cacheDate,
        cacheUrl: `http://webcache.googleusercontent.com/search?q=cache:${url}`,
      };
    } else {
      return {
        isCached: false,
      };
    }
  }
);
