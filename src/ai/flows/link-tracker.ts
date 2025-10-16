'use server';
/**
 * @fileOverview This file defines a Genkit flow for managing tracked links.
 *
 * It provides functionalities to add, delete, and list tracked links for a user.
 */

import {ai} from '@/ai/genkit';
import { CreateTrackedLinkInputSchema, TrackedLinkSchema, type CreateTrackedLinkInput, type TrackedLink } from './schemas/link-tracker';

// This flow would interact with a database (e.g., Firestore) to create the link.
// For this mock, we'll just return a plausible-looking object.
const createTrackedLinkFlow = ai.defineFlow(
  {
    name: 'createTrackedLinkFlow',
    inputSchema: CreateTrackedLinkInputSchema,
    outputSchema: TrackedLinkSchema,
  },
  async (input) => {
    const id = `link_${Math.random().toString(36).substring(2, 10)}`;
    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/track/${id}`;
    
    // In a real app, you would save this to Firestore here.
    
    return {
      id,
      ...input,
      clicks: 0,
      createdAt: new Date().toISOString(),
      trackingUrl,
    };
  }
);

export async function createTrackedLink(input: CreateTrackedLinkInput): Promise<TrackedLink> {
    return createTrackedLinkFlow(input);
}
