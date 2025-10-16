
import { z } from 'zod';

export const DomainToIpInputSchema = z.object({
  domain: z.string().describe('The domain to convert to an IP address.'),
});
export type DomainToIpInput = z.infer<typeof DomainToIpInputSchema>;

export const DomainToIpOutputSchema = z.object({
  ipAddress: z.string().ip().describe('The simulated IP address of the domain.'),
  domain: z.string().describe('The original domain.'),
});
export type DomainToIpOutput = z.infer<typeof DomainToIpOutputSchema>;
