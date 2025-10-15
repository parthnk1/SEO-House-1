'use server';
/**
 * @fileOverview This file defines a Genkit flow for managing tracked links.
 *
 * It provides functionalities to add, delete, and list tracked links for a user.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for creating a tracked link
export const CreateTrackedLinkInputSchema = z.object({
  name: z.string().describe('A user-defined name for the link.'),
  url: z.string().url().describe('The destination URL.'),
  userId: z.string().describe('The ID of the user creating the link.'),
});
export type CreateTrackedLinkInput = z.infer<typeof CreateTrackedLinkInputSchema>;

// Output schema for a tracked link
export const TrackedLinkSchema = z.object({
  id: z.string().describe('The unique ID of the tracked link.'),
  name: z.string(),
  url: z.string().url(),
  clicks: z.number(),
  createdAt: z.string().datetime(),
  userId: z.string(),
  trackingUrl: z.string().url().describe('The short URL to be used for tracking.'),
});
export type TrackedLink = z.infer<typeof TrackedLinkSchema>;


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
