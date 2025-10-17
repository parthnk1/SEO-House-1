
import { z } from 'zod';

// Define the input schema
export const CheckGzipCompressionInputSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});
export type CheckGzipCompressionInput = z.infer<typeof CheckGzipCompressionInputSchema>;

// Define the output schema
export const CheckGzipCompressionOutputSchema = z.object({
  isGzipEnabled: z.boolean().describe('Whether GZIP compression is enabled.'),
  originalSize: z.number().optional().describe('The original size of the page in KB.'),
  compressedSize: z.number().optional().describe('The compressed size of the page in KB.'),
  compressionPercentage: z.number().optional().describe('The percentage of size reduction.'),
});
export type CheckGzipCompressionOutput = z.infer<typeof CheckGzipCompressionOutputSchema>;
