
import { z } from 'zod';

export const FindFacebookIdInputSchema = z.object({
  profileUrl: z.string().url({ message: 'Please enter a valid Facebook profile URL.' }).refine(val => val.includes('facebook.com'), {
    message: 'URL must be a valid facebook.com link.',
  }),
});
export type FindFacebookIdInput = z.infer<typeof FindFacebookIdInputSchema>;

export const FindFacebookIdOutputSchema = z.object({
  facebookId: z.string().describe('The simulated numeric Facebook ID.'),
});
export type FindFacebookIdOutput = z.infer<typeof FindFacebookIdOutputSchema>;
