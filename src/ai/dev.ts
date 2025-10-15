import { config } from 'dotenv';
config();

import '@/ai/flows/generate-meta-tags.ts';
import '@/ai/flows/check-keyword-position.ts';
import '@/ai/flows/check-keyword-density.ts';
import '@/ai/flows/get-keyword-suggestions.ts';
import '@/ai/flows/keyword-research.ts';
import '@/ai/flows/check-keyword-competition.ts';
import '@/ai/flows/find-related-keywords.ts';
import '@/ai/flows/get-long-tail-keyword-suggestions.ts';
import '@/ai/flows/get-keyword-rich-domains.ts';
import '@/ai/flows/backlink-checker.ts';
import '@/ai/flows/backlink-maker.ts';
import '@/ai/flows/seo-keyword-competition-analysis.ts';
