import { z } from 'zod';

export const ClassCIpCheckerInputSchema = z.object({
  domain1: z.string().describe('The first domain to check.'),
  domain2: z.string().describe('The second domain to check.'),
});
export type ClassCIpCheckerInput = z.infer<typeof ClassCIpCheckerInputSchema>;

const DomainIpInfoSchema = z.object({
    domain: z.string(),
    ipAddress: z.string().ip(),
    classCBlock: z.string(),
});

export const ClassCIpCheckerOutputSchema = z.object({
  domain1Info: DomainIpInfoSchema,
  domain2Info: DomainIpInfoSchema,
  sameClassC: z.boolean().describe('Whether the two domains are in the same Class C IP block.'),
});
export type ClassCIpCheckerOutput = z.infer<typeof ClassCIpCheckerOutputSchema>;
