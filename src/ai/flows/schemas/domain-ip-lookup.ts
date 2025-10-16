import { z } from 'zod';

export const DomainIpLookupInputSchema = z.object({
  domain: z.string().describe('The domain to look up the IP address for.'),
});
export type DomainIpLookupInput = z.infer<typeof DomainIpLookupInputSchema>;

export const DomainIpLookupOutputSchema = z.object({
  ipAddress: z.string().ip().describe('The simulated IP address of the domain.'),
});
export type DomainIpLookupOutput = z.infer<typeof DomainIpLookupOutputSchema>;
