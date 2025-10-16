
import { z } from 'zod';

export const ComparisonSearchInputSchema = z.object({
  query: z.string().describe('The search query.'),
});
export type ComparisonSearchInput = z.infer<typeof ComparisonSearchInputSchema>;

const SearchResultSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  description: z.string(),
});

const EngineResultSchema = z.object({
  engine: z.string().describe('The name of the search engine.'),
  results: z.array(SearchResultSchema),
});

export const ComparisonSearchOutputSchema = z.object({
  engines: z.array(EngineResultSchema).describe('A list of search results from different engines.'),
});
export type ComparisonSearchOutput = z.infer<typeof ComparisonSearchOutputSchema>;
