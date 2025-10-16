'use server';

/**
 * @fileOverview This file defines a Genkit flow for looking up the IP address of a domain.
 *
 * @exports `domainIpLookup` - An async function that takes a domain and returns a promise
 * resolving to a `DomainIpLookupOutput` object.
 * @exports `DomainIpLookupInput` - The input type for the `domainIpLookup` function.
 * @exports `DomainIpLookupOutput` - The output type for the `domainIpLookup` function.
 */

import {ai} from '@/ai/genkit';
import { DomainIpLookupInputSchema, DomainIpLookupOutputSchema, type DomainIpLookupInput, type DomainIpLookupOutput } from './schemas/domain-ip-lookup';

export async function domainIpLookup(input: DomainIpLookupInput): Promise<DomainIpLookupOutput> {
  return domainIpLookupFlow(input);
}

const domainIpLookupFlow = ai.defineFlow(
  {
    name: 'domainIpLookupFlow',
    inputSchema: DomainIpLookupInputSchema,
    outputSchema: DomainIpLookupOutputSchema,
  },
  async ({ domain }) => {
    // In a real application, you would use a DNS lookup.
    // For this demo, we'll generate a plausible, random IP address.
    const ipAddress = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    return {
      ipAddress,
    };
  }
);
