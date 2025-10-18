
import { z } from 'zod';

export const BacklinkCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to check for backlinks.'),
});
export type BacklinkCheckerInput = z.infer<typeof BacklinkCheckerInputSchema>;

const BacklinkSchema = z.object({
    sourceUrl: z.string().url().describe('The URL of the page containing the backlink.'),
    anchorText: z.string().describe('The anchor text of the backlink.'),
    domainAuthority: z.number().describe('A score (1-100) representing the linking domain\'s authority.'),
});

export const BacklinkCheckerOutputSchema = z.object({
  backlinks: z.array(BacklinkSchema).describe('A list of backlinks found for the given URL.'),
  totalBacklinks: z.number().describe('The total number of backlinks found.'),
  referringDomains: z.number().describe('The total number of referring domains found.'),
});
export type BacklinkCheckerOutput = z.infer<typeof BacklinkCheckerOutputSchema>;
