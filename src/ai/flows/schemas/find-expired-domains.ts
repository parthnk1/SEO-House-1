
import { z } from 'zod';

export const FindExpiredDomainsInputSchema = z.object({
  keyword: z.string().optional().describe('An optional keyword to find related expired domains.'),
});
export type FindExpiredDomainsInput = z.infer<typeof FindExpiredDomainsInputSchema>;

export const ExpiredDomainSchema = z.object({
    domainName: z.string().describe('The expired domain name.'),
    expiryDate: z.string().datetime().describe('The date the domain expired.'),
    originalRegistrationDate: z.string().datetime().describe('The original registration date of the domain.'),
});

export const FindExpiredDomainsOutputSchema = z.object({
  domains: z.array(ExpiredDomainSchema).describe('A list of expired domain names.'),
});
export type FindExpiredDomainsOutput = z.infer<typeof FindExpiredDomainsOutputSchema>;
