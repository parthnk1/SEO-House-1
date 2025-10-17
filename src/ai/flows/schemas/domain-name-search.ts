
import { z } from 'zod';

export const DomainNameSearchInputSchema = z.object({
  query: z.string().min(1, 'Please enter a search query.'),
});
export type DomainNameSearchInput = z.infer<typeof DomainNameSearchInputSchema>;

const DomainSuggestionSchema = z.object({
    domainName: z.string().describe('The suggested domain name including the TLD.'),
    available: z.boolean().describe('A mock availability status (true for available, false for taken).'),
});

export const DomainNameSearchOutputSchema = z.object({
  suggestions: z.array(DomainSuggestionSchema).describe('A list of domain name suggestions.'),
});
export type DomainNameSearchOutput = z.infer<typeof DomainNameSearchOutputSchema>;
