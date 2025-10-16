import { z } from 'zod';

export const DomainAgeCheckerInputSchema = z.object({
  domain: z.string().describe('The domain to check the age of.'),
});
export type DomainAgeCheckerInput = z.infer<typeof DomainAgeCheckerInputSchema>;

export const DomainAgeCheckerOutputSchema = z.object({
  registrationDate: z.string().datetime().describe('The simulated registration date of the domain.'),
  ageInYears: z.number().describe('The age of the domain in years.'),
  ageInDays: z.number().describe('The total age of the domain in days.'),
});
export type DomainAgeCheckerOutput = z.infer<typeof DomainAgeCheckerOutputSchema>;
