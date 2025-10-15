'use server';

import { generateMetaTags, type GenerateMetaTagsInput, type GenerateMetaTagsOutput } from '@/ai/flows/generate-meta-tags';
import { checkKeywordPosition, type CheckKeywordPositionInput, type CheckKeywordPositionOutput } from '@/ai/flows/check-keyword-position';

export async function generateMetaTagsAction(
  input: GenerateMetaTagsInput
): Promise<{ success: true; data: GenerateMetaTagsOutput } | { success: false; error: string }> {
  try {
    const result = await generateMetaTags(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating meta tags:', error);
    // This provides a generic error to the client for security.
    return { success: false, error: 'Failed to generate meta tags. Please check the URL and try again.' };
  }
}

export async function checkKeywordPositionAction(
  input: CheckKeywordPositionInput
): Promise<{ success: true; data: CheckKeywordPositionOutput } | { success: false; error: string }> {
  try {
    // In a real application, you would have logic here to scrape search results or use an API.
    // For now, we'll use the mock flow.
    const result = await checkKeywordPosition(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking keyword position:', error);
    return { success: false, error: 'Failed to check keyword position. Please try again later.' };
  }
}
