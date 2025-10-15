'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the status of a web server.
 *
 * @exports `checkServerStatus` - An async function that takes a domain and returns a promise
 * resolving to a `CheckServerStatusOutput` object.
 * @exports `CheckServerStatusInput` - The input type for the `checkServerStatus` function.
 * @exports `CheckServerStatusOutput` - The output type for the `checkServerStatus` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const CheckServerStatusInputSchema = z.object({
  domain: z.string().describe('The domain to check the server status for.'),
});
export type CheckServerStatusInput = z.infer<typeof CheckServerStatusInputSchema>;

export const CheckServerStatusOutputSchema = z.object({
    isOnline: z.boolean().describe('Whether the server is online and responding.'),
    httpStatusCode: z.number().optional().describe('The HTTP status code returned by the server.'),
    responseTimeMs: z.number().optional().describe('The server response time in milliseconds.'),
    ipAddress: z.string().ip().optional().describe('The IP address of the server.'),
});
export type CheckServerStatusOutput = z.infer<typeof CheckServerStatusOutputSchema>;

export async function checkServerStatus(input: CheckServerStatusInput): Promise<CheckServerStatusOutput> {
  return checkServerStatusFlow(input);
}

const checkServerStatusFlow = ai.defineFlow(
  {
    name: 'checkServerStatusFlow',
    inputSchema: CheckServerStatusInputSchema,
    outputSchema: CheckServerStatusOutputSchema,
  },
  async ({ domain }) => {
    // In a real application, you would make an HTTP request to the domain.
    // For this demo, we'll simulate the check.
    const isOnline = Math.random() > 0.1; // 90% chance of being online
    
    if (isOnline) {
        return {
            isOnline: true,
            httpStatusCode: 200,
            responseTimeMs: Math.floor(Math.random() * 800) + 50, // 50-850ms
            ipAddress: `192.0.2.${Math.floor(Math.random() * 254) + 1}`,
        };
    } else {
        return {
            isOnline: false,
        };
    }
  }
);
