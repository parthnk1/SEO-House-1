import { z } from 'zod';

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
