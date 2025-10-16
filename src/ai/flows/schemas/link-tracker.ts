import { z } from 'zod';

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
