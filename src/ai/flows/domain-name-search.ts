
'use server';

/**
 * @fileOverview This file defines a Genkit flow for searching for domain names.
 *
 * It takes a keyword or search term and returns a list of suggested domain names
 * with their availability status.
 *
 * @exports `domainNameSearch` - An async function that takes a query and returns a promise
 *  resolving to a `DomainNameSearchOutput` object.
 */

import {ai} from '@/ai/genkit';
import { DomainNameSearchInputSchema, DomainNameSearchOutputSchema, type DomainNameSearchInput, type DomainNameSearchOutput } from './schemas/domain-name-search';

export async function domainNameSearch(input: DomainNameSearchInput): Promise<DomainNameSearchOutput> {
  return domainNameSearchFlow(input);
}

const domainNameSearchPrompt = ai.definePrompt({
  name: 'domainNameSearchPrompt',
  input: {schema: DomainNameSearchInputSchema},
  output: {schema: DomainNameSearchOutputSchema},
  prompt: `You are a creative domain name suggestion tool. Based on the provided query, generate a list of 10-15 domain name ideas.

- Include a variety of Top-Level Domains (TLDs) like .com, .io, .ai, .co, .net, and .org.
- For each suggestion, provide a mock availability status. Assume about half are available and half are taken.
- Try to be creative, combining keywords, adding prefixes/suffixes, and generating brandable names.

Query: {{{query}}}
`,
});

const domainNameSearchFlow = ai.defineFlow(
  {
    name: 'domainNameSearchFlow',
    inputSchema: DomainNameSearchInputSchema,
    outputSchema: DomainNameSearchOutputSchema,
  },
  async input => {
    const {output} = await domainNameSearchPrompt(input);
    return output!;
  }
);
