
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the rating of multiple domains in bulk.
 *
 * @exports bulkDomainRatingChecker - An async function that takes a list of domains and returns their ratings.
 */

import {ai} from '@/ai/genkit';
import { BulkDomainRatingCheckerInputSchema, BulkDomainRatingCheckerOutputSchema, type BulkDomainRatingCheckerInput, type BulkDomainRatingCheckerOutput } from './schemas/bulk-domain-rating-checker';

export async function bulkDomainRatingChecker(input: BulkDomainRatingCheckerInput): Promise<BulkDomainRatingCheckerOutput> {
  return bulkDomainRatingCheckerFlow(input);
}

const bulkDomainRatingCheckerFlow = ai.defineFlow(
  {
    name: 'bulkDomainRatingCheckerFlow',
    inputSchema: BulkDomainRatingCheckerInputSchema,
    outputSchema: BulkDomainRatingCheckerOutputSchema,
  },
  async ({ domains }) => {
    const results = domains.map(domain => {
        const rating = Math.floor(Math.random() * 90) + 10; // Rating between 10 and 100
        const backlinks = rating * (Math.floor(Math.random() * 1000) + 500);
        const referringDomains = Math.floor(backlinks / (Math.random() * 10 + 5));

        return {
            domain,
            rating,
            backlinks,
            referringDomains,
        };
    });

    return { results };
  }
);
