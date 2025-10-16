import { z } from 'zod';

export const GetHttpHeadersInputSchema = z.object({
  url: z.string().url().describe('The URL of the page to fetch headers from.'),
});
export type GetHttpHeadersInput = z.infer<typeof GetHttpHeadersInputSchema>;

const HeaderSchema = z.object({
    key: z.string(),
    value: z.string(),
});

export const GetHttpHeadersOutputSchema = z.object({
  headers: z.array(HeaderSchema).describe('The HTTP response headers.'),
});
export type GetHttpHeadersOutput = z.infer<typeof GetHttpHeadersOutputSchema>;
