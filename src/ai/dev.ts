import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-feedback.ts';
import '@/ai/flows/check-hygiene.ts';
import '@/ai/flows/suggest-donation.ts';
