
import { z } from 'zod';

export const DomainHostingCheckerInputSchema = z.object({
  domain: z.string().describe('The domain to check the hosting provider for.'),
});
export type DomainHostingCheckerInput = z.infer<typeof DomainHostingCheckerInputSchema>;

export const DomainHostingCheckerOutputSchema = z.object({
  hostingProvider: z.string().describe('The name of the hosting provider.'),
  ipAddress: z.string().ip().describe('The IP address of the server.'),
});
export type DomainHostingCheckerOutput = z.infer<typeof DomainHostingCheckerOutputSchema>;
