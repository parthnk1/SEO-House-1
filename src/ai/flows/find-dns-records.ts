
'use server';

/**
 * @fileOverview This file defines a Genkit flow for finding DNS records for a domain.
 *
 * @exports `findDnsRecords` - An async function that takes a domain and returns a promise
 * resolving to a `FindDnsRecordsOutput` object.
 */

import {ai} from '@/ai/genkit';
import { FindDnsRecordsInputSchema, FindDnsRecordsOutputSchema, type FindDnsRecordsInput, type FindDnsRecordsOutput } from './schemas/find-dns-records';

export async function findDnsRecords(input: FindDnsRecordsInput): Promise<FindDnsRecordsOutput> {
  return findDnsRecordsFlow(input);
}

const findDnsRecordsPrompt = ai.definePrompt({
  name: 'findDnsRecordsPrompt',
  input: {schema: FindDnsRecordsInputSchema},
  output: {schema: FindDnsRecordsOutputSchema},
  prompt: `You are a DNS record lookup tool. For the given domain, generate a list of plausible DNS records.

Include examples for the following record types:
- A
- CNAME (for www)
- MX
- TXT (e.g., for SPF and domain verification)
- NS

Domain: {{{domain}}}
`,
});

const findDnsRecordsFlow = ai.defineFlow(
  {
    name: 'findDnsRecordsFlow',
    inputSchema: FindDnsRecordsInputSchema,
    outputSchema: FindDnsRecordsOutputSchema,
  },
  async input => {
    const {output} = await findDnsRecordsPrompt(input);
    return output!;
  }
);
