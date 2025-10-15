'use server';

import { generateMetaTags, type GenerateMetaTagsInput, type GenerateMetaTagsOutput } from '@/ai/flows/generate-meta-tags';
import { checkKeywordPosition, type CheckKeywordPositionInput, type CheckKeywordPositionOutput } from '@/ai/flows/check-keyword-position';
import { checkKeywordDensity, type CheckKeywordDensityInput, type CheckKeywordDensityOutput } from '@/ai/flows/check-keyword-density';
import { getKeywordSuggestions, type GetKeywordSuggestionsInput, type GetKeywordSuggestionsOutput } from '@/ai/flows/get-keyword-suggestions';
import { keywordResearch, type KeywordResearchInput, type KeywordResearchOutput } from '@/ai/flows/keyword-research';

export async function generateMetaTagsAction(
  input: GenerateMetaTagsInput
): Promise<{ success: true, data: GenerateMetaTagsOutput } | { success: false, error: string }> {
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
): Promise<{ success: true, data: CheckKeywordPositionOutput } | { success: false, error: string }> {
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

export async function checkKeywordDensityAction(
  input: CheckKeywordDensityInput
): Promise<{ success: true, data: CheckKeywordDensityOutput } | { success: false, error: string }> {
  try {
    const result = await checkKeywordDensity(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking keyword density:', error);
    return { success: false, error: 'Failed to check keyword density. Please try again later.' };
  }
}


export async function getKeywordSuggestionsAction(
  input: GetKeywordSuggestionsInput
): Promise<{ success: true, data: GetKeywordSuggestionsOutput } | { success: false, error: string }> {
  try {
    const result = await getKeywordSuggestions(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting keyword suggestions:', error);
    return { success: false, error: 'Failed to get keyword suggestions. Please try again later.' };
  }
}

export async function keywordResearchAction(
    input: KeywordResearchInput
  ): Promise<{ success: true, data: KeywordResearchOutput } | { success: false, error: string }> {
    try {
      const result = await keywordResearch(input);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error performing keyword research:', error);
      return { success: false, error: 'Failed to perform keyword research. Please try again later.' };
    }
  }