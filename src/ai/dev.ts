import { config } from 'dotenv';
config();

import '@/ai/flows/detect-plant-disease.ts';
import '@/ai/flows/summarize-community-posts.ts';
import '@/ai/flows/summarize-market-prices.ts';