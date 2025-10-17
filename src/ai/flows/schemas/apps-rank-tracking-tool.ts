import { z } from 'zod';

export const AppsRankTrackingToolInputSchema = z.object({
  appName: z.string().min(2, { message: 'Please enter an app name.' }),
  store: z.enum(['Google Play', 'Apple App Store']),
  country: z.string().min(2, { message: 'Please enter a country.' }),
});
export type AppsRankTrackingToolInput = z.infer<typeof AppsRankTrackingToolInputSchema>;

const RankHistorySchema = z.object({
  date: z.string().describe('The date of the rank measurement.'),
  rank: z.number().describe('The app\'s rank on that date.'),
});

export const AppsRankTrackingToolOutputSchema = z.object({
  rank: z.number().describe('The current rank of the app in its category.'),
  category: z.string().describe('The app store category.'),
  rankHistory: z.array(RankHistorySchema).describe('The rank history for the last 7 days.'),
});
export type AppsRankTrackingToolOutput = z.infer<typeof AppsRankTrackingToolOutputSchema>;
