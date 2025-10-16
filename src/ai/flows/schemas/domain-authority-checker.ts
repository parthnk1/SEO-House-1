import { z } from 'zod';

export const DomainAuthorityCheckerInputSchema = z.object({
  domain: z.string().describe('The domain to check the authority of.'),
});
export type DomainAuthorityCheckerInput = z.infer<typeof DomainAuthorityCheckerInputSchema>;

export const DomainAuthorityCheckerOutputSchema = z.object({
  domainAuthority: z.number().min(0).max(100).describe('A simulated Domain Authority score from 0 to 100.'),
  linkingDomains: z.number().describe('The simulated number of unique domains linking to this site.'),
  totalBacklinks: z.number().describe('The simulated total number of backlinks.'),
});
export type DomainAuthorityCheckerOutput = z.infer<typeof DomainAuthorityCheckerOutputSchema>;
