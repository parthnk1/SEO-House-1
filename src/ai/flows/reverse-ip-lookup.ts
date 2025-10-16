'use server';

/**
 * @fileOverview This file defines a Genkit flow for performing a reverse IP lookup.
 *
 * @exports `reverseIpLookup` - An async function that takes a domain and returns a promise
 * resolving to a `ReverseIpLookupOutput` object.
 */

import {ai} from '@/ai/genkit';
import { type ReverseIpLookupInput, ReverseIpLookupInputSchema, type ReverseIpLookupOutput, ReverseIpLookupOutputSchema } from './schemas/reverse-ip-lookup';

export async function reverseIpLookup(input: ReverseIpLookupInput): Promise<ReverseIpLookupOutput> {
  return reverseIpLookupFlow(input);
}

const reverseIpLookupPrompt = ai.definePrompt({
  name: 'reverseIpLookupPrompt',
  input: {schema: ReverseIpLookupInputSchema},
  output: {schema: ReverseIpLookupOutputSchema},
  prompt: `You are an IP address and domain information tool. For the given domain, provide a realistic IP address.
  
Then, generate a list of 5-10 other plausible but fake domain names that could be hosted on the same IP address.

Domain: {{{domain}}}
`,
});

const reverseIpLookupFlow = ai.defineFlow(
  {
    name: 'reverseIpLookupFlow',
    inputSchema: ReverseIpLookupInputSchema,
    outputSchema: ReverseIpLookupOutputSchema,
  },
  async input => {
    const {output} = await reverseIpLookupPrompt(input);
    return output!;
  }
);
