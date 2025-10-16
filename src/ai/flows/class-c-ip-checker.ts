'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking if two domains share a Class C IP address.
 *
 * @exports `classCIpChecker` - An async function that takes two domains and returns a promise
 * resolving to a `ClassCIpCheckerOutput` object.
 * @exports `ClassCIpCheckerInput` - The input type for the `classCIpChecker` function.
 * @exports `ClassCIpCheckerOutput` - The output type for the `classCIpChecker` function.
 */

import {ai} from '@/ai/genkit';
import { ClassCIpCheckerInputSchema, ClassCIpCheckerOutputSchema, type ClassCIpCheckerInput, type ClassCIpCheckerOutput } from './schemas/class-c-ip-checker';

export async function classCIpChecker(input: ClassCIpCheckerInput): Promise<ClassCIpCheckerOutput> {
  return classCIpCheckerFlow(input);
}

const classCIpCheckerFlow = ai.defineFlow(
  {
    name: 'classCIpCheckerFlow',
    inputSchema: ClassCIpCheckerInputSchema,
    outputSchema: ClassCIpCheckerOutputSchema,
  },
  async ({ domain1, domain2 }) => {
    // In a real application, you would perform DNS lookups.
    // For this demo, we'll simulate the IP addresses.
    
    // Simulate a 50% chance of being in the same Class C block
    const sameBlock = Math.random() > 0.5;

    const generateIp = (base: string) => `${base}.${Math.floor(Math.random() * 255)}`;
    
    const classCBase1 = `192.168.${Math.floor(Math.random() * 255)}`;
    const ip1 = generateIp(classCBase1);
    
    let ip2: string;
    let classCBase2: string;

    if (sameBlock) {
        classCBase2 = classCBase1;
        // Ensure IP is different if domains are different
        do {
            ip2 = generateIp(classCBase2);
        } while (domain1 !== domain2 && ip1 === ip2);

    } else {
        // Ensure class C is different
        do {
            classCBase2 = `192.168.${Math.floor(Math.random() * 255)}`;
        } while (classCBase1 === classCBase2);
        ip2 = generateIp(classCBase2);
    }
    
    return {
      domain1Info: {
        domain: domain1,
        ipAddress: ip1,
        classCBlock: classCBase1,
      },
      domain2Info: {
        domain: domain2,
        ipAddress: ip2,
        classCBlock: classCBase2,
      },
      sameClassC: sameBlock,
    };
  }
);
