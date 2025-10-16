
import { z } from 'zod';

export const CheckBlacklistIpInputSchema = z.object({
  ipAddress: z.string().ip({ message: 'Please enter a valid IP address.' }),
});
export type CheckBlacklistIpInput = z.infer<typeof CheckBlacklistIpInputSchema>;

export const CheckBlacklistIpOutputSchema = z.object({
  isBlacklisted: z.boolean(),
  blacklists: z.array(z.string()).describe('A list of blacklists the IP was found on.'),
});
export type CheckBlacklistIpOutput = z.infer<typeof CheckBlacklistIpOutputSchema>;
