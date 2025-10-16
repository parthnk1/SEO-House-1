
import { z } from 'zod';

export const FindDnsRecordsInputSchema = z.object({
  domain: z.string().describe('The domain to look up DNS records for.'),
});
export type FindDnsRecordsInput = z.infer<typeof FindDnsRecordsInputSchema>;

const DnsRecordSchema = z.object({
  type: z.string().describe('The type of DNS record (e.g., A, CNAME, MX, TXT).'),
  name: z.string().describe('The name of the record.'),
  value: z.string().describe('The value of the record.'),
  ttl: z.number().describe('The Time To Live (TTL) in seconds.'),
});

export const FindDnsRecordsOutputSchema = z.object({
  records: z.array(DnsRecordSchema).describe('A list of DNS records found for the domain.'),
});
export type FindDnsRecordsOutput = z.infer<typeof FindDnsRecordsOutputSchema>;
