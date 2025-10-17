
import { z } from 'zod';

// Define the input schema
export const SslCheckerInputSchema = z.object({
  domain: z.string().refine((val) => /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(val), {
    message: 'Please enter a valid domain name (e.g., example.com).',
  }),
});
export type SslCheckerInput = z.infer<typeof SslCheckerInputSchema>;

// Define the output schema
export const SslCheckerOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the SSL certificate is currently valid.'),
  issuer: z.string().describe('The organization that issued the certificate.'),
  subjectName: z.string().describe('The primary domain name the certificate is issued to.'),
  validFrom: z.string().datetime().describe('The start date of the certificate\'s validity.'),
  validTo: z.string().datetime().describe('The expiry date of the certificate.'),
  daysRemaining: z.number().describe('The number of days until the certificate expires.'),
});
export type SslCheckerOutput = z.infer<typeof SslCheckerOutputSchema>;
