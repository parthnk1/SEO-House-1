import { config } from 'dotenv';
config();

import '@/ai/flows/generate-meta-tags.ts';
import '@/ai/flows/check-keyword-position.ts';
import '@/ai/flows/check-keyword-density.ts';
import '@/ai/flows/get-keyword-suggestions.ts';
