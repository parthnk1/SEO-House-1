
'use server';

/**
 * @fileOverview This file defines a Genkit flow for converting a domain to an IP address.
 *
 * @exports `domainToIp` - An async function that takes a domain and returns its IP address.
 */

import {ai} from '@/ai/genkit';
import { DomainToIpInputSchema, DomainToIpOutputSchema, type DomainToIpInput, type DomainToIpOutput } from './schemas/domain-to-ip';

export async function domainToIp(input: DomainToIpInput): Promise<DomainToIpOutput> {
  return domainToIpFlow(input);
}

const domainToIpFlow = ai.defineFlow(
  {
    name: 'domainToIpFlow',
    inputSchema: DomainToIpInputSchema,
    outputSchema: DomainToIpOutputSchema,
  },
  async ({ domain }) => {
    // In a real application, you would use a DNS lookup.
    // For this demo, we'll generate a plausible, random IP address.
    const ipAddress = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    return {
      ipAddress,
      domain,
    };
  }
);
