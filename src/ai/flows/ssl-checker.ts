
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the SSL certificate of a website.
 *
 * It takes a domain and returns a simulated SSL certificate details.
 *
 * @exports `sslChecker` - An async function that takes a domain and returns a promise
 *  resolving to a `SslCheckerOutput` object.
 * @exports `SslCheckerInput` - The input type for the `sslChecker` function.
 * @exports `SslCheckerOutput` - The output type for the `sslChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { SslCheckerInputSchema, SslCheckerOutputSchema, type SslCheckerInput, type SslCheckerOutput } from './schemas/ssl-checker';

// Define the wrapper function
export async function sslChecker(input: SslCheckerInput): Promise<SslCheckerOutput> {
  return sslCheckerFlow(input);
}

// Define the prompt
const sslCheckerPrompt = ai.definePrompt({
  name: 'sslCheckerPrompt',
  input: {schema: SslCheckerInputSchema},
  output: {schema: SslCheckerOutputSchema},
  prompt: `You are a security tool that simulates an SSL certificate check for a domain.

For the given domain, generate realistic details for an SSL certificate.
- The certificate should usually be valid.
- Generate a plausible issuer (e.g., Let's Encrypt, GoDaddy, DigiCert).
- The subject name should match the domain.
- The validity dates should be realistic (e.g., valid from some time in the past, expires some time in the future).
- Calculate the days remaining until expiry.

Domain: {{{domain}}}
`,
});


// Define the flow
const sslCheckerFlow = ai.defineFlow(
  {
    name: 'sslCheckerFlow',
    inputSchema: SslCheckerInputSchema,
    outputSchema: SslCheckerOutputSchema,
  },
  async input => {
    const {output} = await sslCheckerPrompt(input);
    return output!;
  }
);
