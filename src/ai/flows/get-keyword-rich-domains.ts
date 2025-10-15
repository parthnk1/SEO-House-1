'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting keyword-rich domain names.
 *
 * It takes a keyword and returns a list of suggested domain names with different TLDs.
 *
 * @exports `getKeywordRichDomains` - An async function that takes keywords and returns a promise
 *  resolving to a `GetKeywordRichDomainsOutput` object.
 * @exports `GetKeywordRichDomainsInput` - The input type for the `getKeywordRichDomains` function.
 * @exports `GetKeywordRichDomainsOutput` - The output type for the `getKeywordRichDomains` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GetKeywordRichDomainsInputSchema = z.object({
  keywords: z.string().describe('The keywords to base the domain suggestions on.'),
});
export type GetKeywordRichDomainsInput = z.infer<typeof GetKeywordRichDomainsInputSchema>;

// Define the output schema for a single domain suggestion
const DomainSuggestionSchema = z.object({
    domainName: z.string().describe('The suggested domain name.'),
    tld: z.string().describe('The top-level domain (e.g., .com, .net, .org).'),
    available: z.boolean().describe('A mock availability status.'),
});

// Define the output schema
const GetKeywordRichDomainsOutputSchema = z.object({
  suggestions: z.array(DomainSuggestionSchema).describe('A list of suggested domain names.'),
});
export type GetKeywordRichDomainsOutput = z.infer<typeof GetKeywordRichDomainsOutputSchema>;

// Define the wrapper function
export async function getKeywordRichDomains(input: GetKeywordRichDomainsInput): Promise<GetKeywordRichDomainsOutput> {
  return getKeywordRichDomainsFlow(input);
}

// Define the prompt
const getKeywordRichDomainsPrompt = ai.definePrompt({
  name: 'getKeywordRichDomainsPrompt',
  input: {schema: GetKeywordRichDomainsInputSchema},
  output: {schema: GetKeywordRichDomainsOutputSchema},
  prompt: `You are a domain name suggestion expert. Based on the following keywords, generate a list of 10-15 creative and brandable domain name suggestions.
  
Include a mix of TLDs like .com, .io, .ai, .co, and .net. For each suggestion, provide a mock availability status (assume most are available).

Keywords: {{{keywords}}}
`,
});

// Define the flow
const getKeywordRichDomainsFlow = ai.defineFlow(
  {
    name: 'getKeywordRichDomainsFlow',
    inputSchema: GetKeywordRichDomainsInputSchema,
    outputSchema: GetKeywordRichDomainsOutputSchema,
  },
  async input => {
    const {output} = await getKeywordRichDomainsPrompt(input);
    return output!;
  }
);
