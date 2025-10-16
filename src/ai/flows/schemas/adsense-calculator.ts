import { z } from 'zod';

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
