import { z } from 'genkit';

export const ReverseIpLookupInputSchema = z.object({
  domain: z.string().describe('The domain to perform a reverse IP lookup on.'),
});
export type ReverseIpLookupInput = z.infer<typeof ReverseIpLookupInputSchema>;

export const ReverseIpLookupOutputSchema = z.object({
  ipAddress: z.string().ip().describe('The IP address of the domain.'),
  domains: z.array(z.string()).describe('A list of other domains hosted on the same IP address.'),
});
export type ReverseIpLookupOutput = z.infer<typeof ReverseIpLookupOutputSchema>;
