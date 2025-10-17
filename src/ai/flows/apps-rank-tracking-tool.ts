'use server';

/**
 * @fileOverview This file defines a Genkit flow for tracking an app's rank in an app store.
 *
 * It takes an app name, store, and country and returns a simulated rank and history.
 *
 * @exports `appsRankTrackingTool` - An async function that takes app details and returns a promise
 *  resolving to a `AppsRankTrackingToolOutput` object.
 * @exports `AppsRankTrackingToolInput` - The input type for the `appsRankTrackingTool` function.
 * @exports `AppsRankTrackingToolOutput` - The output type for the `appsRankTrackingTool` function.
 */

import {ai} from '@/ai/genkit';
import { AppsRankTrackingToolInputSchema, AppsRankTrackingToolOutputSchema, type AppsRankTrackingToolInput, type AppsRankTrackingToolOutput } from './schemas/apps-rank-tracking-tool';

// Define the wrapper function
export async function appsRankTrackingTool(input: AppsRankTrackingToolInput): Promise<AppsRankTrackingToolOutput> {
  return appsRankTrackingToolFlow(input);
}

// Define the prompt
const appsRankTrackingToolPrompt = ai.definePrompt({
  name: 'appsRankTrackingToolPrompt',
  input: {schema: AppsRankTrackingToolInputSchema},
  output: {schema: AppsRankTrackingToolOutputSchema},
  prompt: `You are an app store optimization (ASO) expert. For the given app name, store, and country, generate a realistic-looking rank and rank history.

- The current rank should be a plausible number for a popular app (e.g., between 1 and 50).
- The category should be a common app store category (e.g., "Productivity", "Games", "Social Networking").
- Generate a rank history for the last 7 days, showing some fluctuation.

App Name: {{{appName}}}
Store: {{{store}}}
Country: {{{country}}}
`,
});


// Define the flow
const appsRankTrackingToolFlow = ai.defineFlow(
  {
    name: 'appsRankTrackingToolFlow',
    inputSchema: AppsRankTrackingToolInputSchema,
    outputSchema: AppsRankTrackingToolOutputSchema,
  },
  async input => {
    const {output} = await appsRankTrackingToolPrompt(input);
    return output!;
  }
);
