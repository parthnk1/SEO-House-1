'use server';

/**
 * @fileOverview This file defines a Genkit flow for calculating AdSense earnings.
 *
 * @exports `adsenseCalculator` - An async function that takes page impressions, CTR, and CPC and returns a promise
 * resolving to a `AdsenseCalculatorOutput` object.
 * @exports `AdsenseCalculatorInput` - The input type for the `adsenseCalculator` function.
 * @exports `AdsenseCalculatorOutput` - The output type for the `adsenseCalculator` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AdsenseCalculatorInputSchema = z.object({
  pageImpressions: z.number().min(0),
  clickThroughRate: z.number().min(0).max(100),
  costPerClick: z.number().min(0),
});
export type AdsenseCalculatorInput = z.infer<typeof AdsenseCalculatorInputSchema>;

export const AdsenseCalculatorOutputSchema = z.object({
  clicks: z.number(),
  totalEarnings: z.number(),
  dailyEarnings: z.number(),
  monthlyEarnings: z.number(),
  yearlyEarnings: z.number(),
});
export type AdsenseCalculatorOutput = z.infer<typeof AdsenseCalculatorOutputSchema>;

export async function adsenseCalculator(input: AdsenseCalculatorInput): Promise<AdsenseCalculatorOutput> {
  return adsenseCalculatorFlow(input);
}

const adsenseCalculatorFlow = ai.defineFlow(
  {
    name: 'adsenseCalculatorFlow',
    inputSchema: AdsenseCalculatorInputSchema,
    outputSchema: AdsenseCalculatorOutputSchema,
  },
  async ({ pageImpressions, clickThroughRate, costPerClick }) => {
    const clicks = (pageImpressions * clickThroughRate) / 100;
    const totalEarnings = clicks * costPerClick;

    // Assuming the input is daily impressions for calculation of other metrics
    const dailyEarnings = totalEarnings;
    const monthlyEarnings = dailyEarnings * 30;
    const yearlyEarnings = dailyEarnings * 365;

    return {
      clicks: Math.round(clicks),
      totalEarnings,
      dailyEarnings,
      monthlyEarnings,
      yearlyEarnings,
    };
  }
);
