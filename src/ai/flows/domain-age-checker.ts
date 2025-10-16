'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking the age of a domain.
 *
 * @exports `domainAgeChecker` - An async function that takes a domain and returns a promise
 * resolving to a `DomainAgeCheckerOutput` object.
 * @exports `DomainAgeCheckerInput` - The input type for the `domainAgeChecker` function.
 * @exports `DomainAgeCheckerOutput` - The output type for the `domainAgeChecker` function.
 */

import {ai} from '@/ai/genkit';
import { DomainAgeCheckerInputSchema, DomainAgeCheckerOutputSchema, type DomainAgeCheckerInput, type DomainAgeCheckerOutput } from './schemas/domain-age-checker';

export async function domainAgeChecker(input: DomainAgeCheckerInput): Promise<DomainAgeCheckerOutput> {
  return domainAgeCheckerFlow(input);
}

const domainAgeCheckerFlow = ai.defineFlow(
  {
    name: 'domainAgeCheckerFlow',
    inputSchema: DomainAgeCheckerInputSchema,
    outputSchema: DomainAgeCheckerOutputSchema,
  },
  async ({ domain }) => {
    // Simulate a registration date between 1 and 20 years ago
    const now = new Date();
    const yearsAgo = Math.random() * 19 + 1;
    const registrationDate = new Date(now.getTime() - yearsAgo * 365 * 24 * 60 * 60 * 1000);

    const ageInMilliseconds = now.getTime() - registrationDate.getTime();
    const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
    const ageInYears = Math.floor(ageInDays / 365);

    return {
      registrationDate: registrationDate.toISOString(),
      ageInYears,
      ageInDays,
    };
  }
);
