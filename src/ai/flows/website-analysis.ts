
'use server';

import { ai } from '@/ai/genkit';
import { 
  WebsiteAnalysisInputSchema, 
  WebsiteAnalysisOutputSchema,
  type WebsiteAnalysisInput, 
  type WebsiteAnalysisOutput,
} from './schemas/website-analysis';

export async function websiteAnalysis(input: WebsiteAnalysisInput): Promise<WebsiteAnalysisOutput> {
  return websiteAnalysisFlow(input);
}

const analysisPrompt = ai.definePrompt({
    name: 'comprehensiveWebsiteAnalysisPrompt',
    input: { schema: WebsiteAnalysisInputSchema },
    output: { schema: WebsiteAnalysisOutputSchema },
    prompt: `You are an expert SEO analysis tool. For the given URL, perform a comprehensive analysis and generate a detailed report.

URL: {{{url}}}

Based on a simulated analysis of the URL, provide the following information:

1.  **SEO Score**:
    -   Generate an overall SEO score from 0-100.
    -   Provide a breakdown for at least 5 key factors (e.g., 'Meta Title', 'Mobile-Friendliness', 'Page Speed', 'Backlink Quality', 'Content Quality'), each with a score and a status ('Good', 'Needs Improvement', or 'Poor').

2.  **Meta Tags**:
    -   Provide the content for the title, meta description, keywords, viewport, and robots tags. If a tag is not found, indicate that.

3.  **Backlinks**:
    -   Generate a list of 10-15 realistic backlinks. For each, provide a source URL, anchor text, and a domain authority score (1-100).
    -   Provide a realistic total number of backlinks and referring domains.

4.  **Domain Authority**:
    -   Provide a simulated Domain Authority score (1-100).
    -   Provide a plausible number for linking domains and total backlinks that is consistent with the DA score.

5.  **Page Speed**:
    -   Provide an overall performance score (0-100).
    -   Generate a list of 5-6 key performance metrics (e.g., 'First Contentful Paint (FCP)', 'Largest Contentful Paint (LCP)') with realistic values and a rating ('Good', 'Needs Improvement', or 'Poor').

6.  **SEO Improvement Suggestions**:
    -   Based on all the above analysis, generate a list of 3-5 prioritized, specific, and actionable improvement suggestions. For each suggestion, provide a category (e.g., "On-Page", "Performance") and a priority ('High', 'Medium', 'Low').`,
});

const websiteAnalysisFlow = ai.defineFlow(
  {
    name: 'websiteAnalysisFlow',
    inputSchema: WebsiteAnalysisInputSchema,
    outputSchema: WebsiteAnalysisOutputSchema,
  },
  async ({ url }) => {
    const { output } = await analysisPrompt({ url });
    if (!output) {
      throw new Error("Failed to generate a complete website analysis.");
    }
    return output;
  }
);
