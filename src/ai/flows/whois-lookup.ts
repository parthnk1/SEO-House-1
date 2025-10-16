'use server';

/**
 * @fileOverview This file defines a Genkit flow for performing a WHOIS lookup on a domain.
 *
 * It takes a domain and returns simulated WHOIS information.
 *
 * @exports `whoisLookup` - An async function that takes a domain and returns a promise
 * resolving to a `WhoisLookupOutput` object.
 */

import {ai} from '@/ai/genkit';
import { WhoisLookupInputSchema, WhoisLookupOutputSchema, type WhoisLookupInput, type WhoisLookupOutput } from './schemas/whois-lookup';


export async function whoisLookup(input: WhoisLookupInput): Promise<WhoisLookupOutput> {
  return whoisLookupFlow(input);
}


const whoisLookupPrompt = ai.definePrompt({
    name: 'whoisLookupPrompt',
    input: {schema: WhoisLookupInputSchema},
    output: {schema: WhoisLookupOutputSchema},
    prompt: `You are a WHOIS information tool. For the given domain, generate a realistic-looking WHOIS record.

    - **Registrar:** Provide a common registrar name (e.g., GoDaddy, Namecheap, Google).
    - **Dates:** Generate a plausible registration date (within the last 10 years), an expiration date (1-2 years from now), and an updated date (within the last year).
    - **Name Servers:** Provide 2-4 plausible name server hostnames (e.g., ns1.registrar.com).
    - **Raw Text:** Generate a larger block of text that looks like a raw WHOIS query result, including all the above information plus fictional registrant/admin/tech contact details (use "REDACTED FOR PRIVACY" for personal info).

    Domain: {{{domain}}}
    `,
});


const whoisLookupFlow = ai.defineFlow(
  {
    name: 'whoisLookupFlow',
    inputSchema: WhoisLookupInputSchema,
    outputSchema: WhoisLookupOutputSchema,
  },
  async input => {
    const {output} = await whoisLookupPrompt(input);
    return output!;
  }
);
