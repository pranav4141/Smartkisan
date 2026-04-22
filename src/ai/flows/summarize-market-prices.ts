'use server';
/**
 * @fileOverview A Genkit flow for summarizing market price trends for specific crops.
 *
 * - summarizeMarketPrices - A function that triggers the market price summary process.
 * - SummarizeMarketPricesInput - The input type for the summarizeMarketPrices function.
 * - SummarizeMarketPricesOutput - The return type for the summarizeMarketPrices function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketPriceDataSchema = z.object({
  crop_name: z.string().describe('The name of the crop.'),
  market_name: z.string().describe('The name of the market.'),
  price_per_quintal: z.number().describe('The price per quintal in the market.'),
  state: z.string().describe('The state where the market is located.'),
  updated_at: z.string().describe('The timestamp of the last update for this price data. Expected format: ISO 8601 string.'),
});

const SummarizeMarketPricesInputSchema = z.object({
  cropName: z.string().describe('The name of the crop for which to summarize market prices.'),
  marketData: z.array(MarketPriceDataSchema).describe('An array of market price records for the specified crop, including historical or current data.'),
});
export type SummarizeMarketPricesInput = z.infer<typeof SummarizeMarketPricesInputSchema>;

const SummarizeMarketPricesOutputSchema = z.object({
  summary: z.string().describe('A concise summary of market price trends for the specified crop, including key trends, price variations, and actionable insights for farmers.'),
});
export type SummarizeMarketPricesOutput = z.infer<typeof SummarizeMarketPricesOutputSchema>;

export async function summarizeMarketPrices(input: SummarizeMarketPricesInput): Promise<SummarizeMarketPricesOutput> {
  return summarizeMarketPricesFlow(input);
}

const summarizeMarketPricesPrompt = ai.definePrompt({
  name: 'summarizeMarketPricesPrompt',
  input: { schema: SummarizeMarketPricesInputSchema },
  output: { schema: SummarizeMarketPricesOutputSchema },
  prompt: `You are an expert agricultural economist providing valuable market insights to farmers.

Analyze the following market price data for the crop '{{{cropName}}}'.
Provide a concise summary of the key market price trends, significant price changes, and any notable variations across different markets or states.
Also, include actionable insights or recommendations for farmers based on these trends to help them make informed selling decisions.
Focus on identifying increases, decreases, stability, and comparing prices across different entries.

Market Data for '{{{cropName}}}':
{{#each marketData}}
- Market: {{this.market_name}}, State: {{this.state}}, Price per quintal: {{this.price_per_quintal}} (as of {{this.updated_at}})
{{/each}}`,
});

const summarizeMarketPricesFlow = ai.defineFlow(
  {
    name: 'summarizeMarketPricesFlow',
    inputSchema: SummarizeMarketPricesInputSchema,
    outputSchema: SummarizeMarketPricesOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeMarketPricesPrompt(input);
    return output!;
  }
);
