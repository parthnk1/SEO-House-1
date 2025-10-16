import { z } from 'zod';

export const WhoisLookupInputSchema = z.object({
  domain: z.string().describe('The domain to perform the WHOIS lookup on.'),
});
export type WhoisLookupInput = z.infer<typeof WhoisLookupInputSchema>;

export const WhoisLookupOutputSchema = z.object({
    registrar: z.string().describe('The registrar of the domain.'),
    registrationDate: z.string().datetime().describe('The date the domain was registered.'),
    expirationDate: z.string().datetime().describe('The date the domain will expire.'),
    updatedDate: z.string().datetime().describe('The date the domain was last updated.'),
    nameServers: z.array(z.string()).describe('A list of name servers for the domain.'),
    rawText: z.string().describe('The raw WHOIS text output.'),
});
export type WhoisLookupOutput = z.infer<typeof WhoisLookupOutputSchema>;
