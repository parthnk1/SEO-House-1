
import { z } from 'zod';

export const BulkDomainRatingCheckerInputSchema = z.object({
  domains: z.array(z.string().refine(val => /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(val), {
    message: 'Invalid domain format.',
  })).min(1, 'Please enter at least one domain.'),
});
export type BulkDomainRatingCheckerInput = z.infer<typeof BulkDomainRatingCheckerInputSchema>;

const DomainRatingSchema = z.object({
    domain: z.string(),
    rating: z.number().min(0).max(100),
    backlinks: z.number(),
    referringDomains: z.number(),
});

export const BulkDomainRatingCheckerOutputSchema = z.object({
  results: z.array(DomainRatingSchema),
});
export type BulkDomainRatingCheckerOutput = z.infer<typeof BulkDomainRatingCheckerOutputSchema>;
