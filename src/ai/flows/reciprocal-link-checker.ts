'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking reciprocal links.
 *
 * It takes a user's website URL and a partner's URL and checks if a backlink exists.
 *
 * @exports `reciprocalLinkChecker` - An async function that takes two URLs and returns a promise
 *  resolving to a `ReciprocalLinkCheckerOutput` object.
 * @exports `ReciprocalLinkCheckerInput` - The input type for the `reciprocalLinkChecker` function.
 * @exports `ReciprocalLinkCheckerOutput` - The output type for the `reciprocalLinkChecker` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const ReciprocalLinkCheckerInputSchema = z.object({
  yourUrl: z.string().url().describe("Your website's URL."),
  partnerUrl: z.string().url().describe("The partner's website URL to check for a backlink."),
});
export type ReciprocalLinkCheckerInput = z.infer<typeof ReciprocalLinkCheckerInputSchema>;

// Define the output schema
const ReciprocalLinkCheckerOutputSchema = z.object({
  isLinkingBack: z.boolean().describe('Whether the partner URL contains a link back to your URL.'),
  linkingUrl: z.string().url().optional().describe('The exact URL on the partner site that contains the link, if found.'),
  anchorText: z.string().optional().describe('The anchor text of the link, if found.'),
});
export type ReciprocalLinkCheckerOutput = z.infer<typeof ReciprocalLinkCheckerOutputSchema>;

// Define the wrapper function
export async function reciprocalLinkChecker(input: ReciprocalLinkCheckerInput): Promise<ReciprocalLinkCheckerOutput> {
  return reciprocalLinkCheckerFlow(input);
}


const checkLinkTool = ai.defineTool(
    {
        name: 'checkIfPageContainsLink',
        description: 'Checks if a given page (partnerUrl) contains a link to another page (yourUrl).',
        inputSchema: ReciprocalLinkCheckerInputSchema,
        outputSchema: ReciprocalLinkCheckerOutputSchema,
    },
    async ({ yourUrl, partnerUrl }) => {
        // Mock implementation. In a real scenario, this would fetch the partnerUrl content
        // and parse it to find the link. We'll simulate a 70% chance of finding a link.
        const found = Math.random() > 0.3;
        if (found) {
            return {
                isLinkingBack: true,
                linkingUrl: partnerUrl,
                anchorText: `Check out this great site`,
            };
        } else {
            return {
                isLinkingBack: false,
            };
        }
    }
);


// Define the prompt
const reciprocalLinkCheckerPrompt = ai.definePrompt({
  name: 'reciprocalLinkCheckerPrompt',
  input: {schema: ReciprocalLinkCheckerInputSchema},
  output: {schema: ReciprocalLinkCheckerOutputSchema},
  tools: [checkLinkTool],
  prompt: `You are an SEO tool that checks for reciprocal links.

1. Use the 'checkIfPageContainsLink' tool to see if the \`partnerUrl\` contains a link to \`yourUrl\`.
2. Return the result from the tool.

Your URL: {{{yourUrl}}}
Partner URL: {{{partnerUrl}}}
`,
});

// Define the flow
const reciprocalLinkCheckerFlow = ai.defineFlow(
  {
    name: 'reciprocalLinkCheckerFlow',
    inputSchema: ReciprocalLinkCheckerInputSchema,
    outputSchema: ReciprocalLinkCheckerOutputSchema,
  },
  async input => {
    const {output} = await reciprocalLinkCheckerPrompt(input);
    return output!;
  }
);
