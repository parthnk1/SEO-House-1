'use server';

/**
 * @fileOverview This file defines a Genkit flow for calculating AdSense earnings.
 *
 * It exports an async function `adsenseCalculator` to perform the calculation.
 */

import {ai} from '@/ai/genkit';
import { AdsenseCalculatorInputSchema, AdsenseCalculatorOutputSchema, type AdsenseCalculatorInput, type AdsenseCalculatorOutput } from './schemas/adsense-calculator';

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
