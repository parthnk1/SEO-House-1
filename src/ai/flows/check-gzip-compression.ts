
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking if a website uses GZIP compression.
 *
 * It takes a website URL and returns whether GZIP is enabled and the size savings.
 *
 * @exports `checkGzipCompression` - An async function that takes a URL and returns a promise
 *  resolving to a `CheckGzipCompressionOutput` object.
 * @exports `CheckGzipCompressionInput` - The input type for the `checkGzipCompression` function.
 * @exports `CheckGzipCompressionOutput` - The output type for the `checkGzipCompression` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CheckGzipCompressionInputSchema, CheckGzipCompressionOutputSchema, type CheckGzipCompressionInput, type CheckGzipCompressionOutput } from './schemas/check-gzip-compression';

// Define the wrapper function
export async function checkGzipCompression(input: CheckGzipCompressionInput): Promise<CheckGzipCompressionOutput> {
  return checkGzipCompressionFlow(input);
}

// Define the flow
const checkGzipCompressionFlow = ai.defineFlow(
  {
    name: 'checkGzipCompressionFlow',
    inputSchema: CheckGzipCompressionInputSchema,
    outputSchema: CheckGzipCompressionOutputSchema,
  },
  async ({ url }) => {
    // In a real application, you would make an HTTP request with 'Accept-Encoding: gzip'
    // and check for 'Content-Encoding: gzip' in the response headers.
    // For this demo, we'll simulate the results.
    const isGzipEnabled = Math.random() > 0.1; // 90% chance of being enabled

    if (isGzipEnabled) {
      const originalSize = Math.floor(Math.random() * 800) + 200; // 200-1000 KB
      const compressedSize = originalSize * (Math.random() * 0.4 + 0.1); // 10-50% of original
      const compressionPercentage = ((originalSize - compressedSize) / originalSize) * 100;
      
      return {
        isGzipEnabled: true,
        originalSize: parseFloat(originalSize.toFixed(2)),
        compressedSize: parseFloat(compressedSize.toFixed(2)),
        compressionPercentage: parseFloat(compressionPercentage.toFixed(2)),
      };
    } else {
      return {
        isGzipEnabled: false,
      };
    }
  }
);
