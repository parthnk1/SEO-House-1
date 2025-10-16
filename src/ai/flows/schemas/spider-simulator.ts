
import { z } from 'zod';

export const SpiderSimulatorInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to simulate.'),
});
export type SpiderSimulatorInput = z.infer<typeof SpiderSimulatorInputSchema>;

const LinkSchema = z.object({
    url: z.string().url(),
    anchorText: z.string(),
});

export const SpiderSimulatorOutputSchema = z.object({
    title: z.string(),
    textContent: z.string(),
    links: z.array(LinkSchema),
});
export type SpiderSimulatorOutput = z.infer<typeof SpiderSimulatorOutputSchema>;
