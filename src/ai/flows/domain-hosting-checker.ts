
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the hosting provider of a domain.
 *
 * @exports `domainHostingChecker` - An async function that takes a domain and returns a promise
 * resolving to a `DomainHostingCheckerOutput` object.
 */

import {ai} from '@/ai/genkit';
import { DomainHostingCheckerInputSchema, DomainHostingCheckerOutputSchema, type DomainHostingCheckerInput, type DomainHostingCheckerOutput } from './schemas/domain-hosting-checker';

export async function domainHostingChecker(input: DomainHostingCheckerInput): Promise<DomainHostingCheckerOutput> {
  return domainHostingCheckerFlow(input);
}

const domainHostingCheckerPrompt = ai.definePrompt({
  name: 'domainHostingCheckerPrompt',
  input: {schema: DomainHostingCheckerInputSchema},
  output: {schema: DomainHostingCheckerOutputSchema},
  prompt: `You are a web hosting detection tool. For the given domain, provide a plausible hosting provider. Common providers include GoDaddy, Bluehost, HostGator, SiteGround, Amazon Web Services, Google Cloud, etc. Also provide a plausible IP address.

Domain: {{{domain}}}
`,
});

const domainHostingCheckerFlow = ai.defineFlow(
  {
    name: 'domainHostingCheckerFlow',
    inputSchema: DomainHostingCheckerInputSchema,
    outputSchema: DomainHostingCheckerOutputSchema,
  },
  async input => {
    const {output} = await domainHostingCheckerPrompt(input);
    return output!;
  }
);
