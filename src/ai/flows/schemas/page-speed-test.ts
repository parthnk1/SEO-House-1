'use server';

import { z } from 'zod';

// Define the input schema
export const PageSpeedTestInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to test.'),
});
export type PageSpeedTestInput = z.infer<typeof PageSpeedTestInputSchema>;

// Define the output schema for a single metric
export const SpeedMetricSchema = z.object({
    name: z.string().describe('The name of the performance metric (e.g., First Contentful Paint).'),
    value: z.string().describe('The value of the metric (e.g., "1.2s").'),
    rating: z.enum(['Good', 'Needs Improvement', 'Poor']).describe('The rating for this metric.'),
});

// Define the output schema
export const PageSpeedTestOutputSchema = z.object({
  performanceScore: z.number().min(0).max(100).describe('An overall performance score from 0 to 100.'),
  metrics: z.array(SpeedMetricSchema).describe('A list of key performance metrics.'),
});
export type PageSpeedTestOutput = z.infer<typeof PageSpeedTestOutputSchema>;
