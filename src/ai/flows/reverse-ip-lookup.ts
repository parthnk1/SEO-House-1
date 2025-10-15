'use server';

/**
 * @fileOverview This file defines a Genkit flow for performing a reverse IP lookup.
 *
 * @exports `reverseIpLookup` - An async function that takes a domain and returns a promise
 * resolving to a `ReverseIpLookupOutput` object.
 * @exports `ReverseIpLookupInput` - The input type for the `reverseIpLookup` function.
 * @exports `ReverseIpLookupOutput` - The output type for the `reverseIpLookup` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
export const ReverseIpLookupInputSchema = z.object({
  domain: z.string().describe('The domain to perform a reverse IP lookup on.'),
});
export type ReverseIpLookupInput = z.infer<typeof ReverseIpLookupInputSchema>;

// Define the output schema
export const ReverseIpLookupOutputSchema = z.object({
  ipAddress: z.string().ip().describe('The IP address of the domain.'),
  domains: z.array(z.string()).describe('A list of other domains hosted on the same IP address.'),
});
export type ReverseIpLookupOutput = z.infer<typeof ReverseIpLookupOutputSchema>;

// Define the wrapper function
export async function reverseIpLookup(input: ReverseIpLookupInput): Promise<ReverseIpLookupOutput> {
  return reverseIpLookupFlow(input);
}

// Define the prompt
const reverseIpLookupPrompt = ai.definePrompt({
  name: 'reverseIpLookupPrompt',
  input: {schema: ReverseIpLookupInputSchema},
  output: {schema: ReverseIpLookupOutputSchema},
  prompt: `You are an IP address and domain information tool. For the given domain, provide a realistic IP address.
  
Then, generate a list of 5-10 other plausible but fake domain names that could be hosted on the same IP address.

Domain: {{{domain}}}
`,
});

// Define the flow
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
