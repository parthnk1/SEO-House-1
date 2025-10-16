
'use server';

/**
 * @fileOverview This file defines a Genkit flow for finding expired domain names.
 *
 * @exports `findExpiredDomains` - An async function that takes an optional keyword and returns a promise
 * resolving to a `FindExpiredDomainsOutput` object.
 */

import {ai} from '@/ai/genkit';
import { FindExpiredDomainsInputSchema, FindExpiredDomainsOutputSchema, type FindExpiredDomainsInput, type FindExpiredDomainsOutput } from './schemas/find-expired-domains';

export async function findExpiredDomains(input: FindExpiredDomainsInput): Promise<FindExpiredDomainsOutput> {
  return findExpiredDomainsFlow(input);
}

const findExpiredDomainsPrompt = ai.definePrompt({
  name: 'findExpiredDomainsPrompt',
  input: {schema: FindExpiredDomainsInputSchema},
  output: {schema: FindExpiredDomainsOutputSchema},
  prompt: `You are an expert domain name tool. Your task is to generate a list of 10-15 plausible, recently expired domain names.
  
{{#if keyword}}
The domains should be related to the keyword: {{{keyword}}}.
{{/if}}

For each domain, provide:
- The domain name.
- A realistic expiry date within the last 90 days.
- A plausible original registration date from 1-10 years ago.
`,
});

const findExpiredDomainsFlow = ai.defineFlow(
  {
    name: 'findExpiredDomainsFlow',
    inputSchema: FindExpiredDomainsInputSchema,
    outputSchema: FindExpiredDomainsOutputSchema,
  },
  async input => {
    const {output} = await findExpiredDomainsPrompt(input);
    return output!;
  }
);
