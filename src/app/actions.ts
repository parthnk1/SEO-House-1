'use server';

import { generateMetaTags, type GenerateMetaTagsInput, type GenerateMetaTagsOutput } from '@/ai/flows/generate-meta-tags';

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
