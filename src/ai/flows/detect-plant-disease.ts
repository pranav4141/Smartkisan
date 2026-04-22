'use server';
/**
 * @fileOverview This file implements a Genkit flow for detecting plant diseases from images.
 *
 * - detectPlantDisease - A function that handles the plant disease detection process.
 * - DetectPlantDiseaseInput - The input type for the detectPlantDisease function.
 * - DetectPlantDiseaseOutput - The return type for the detectPlantDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectPlantDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectPlantDiseaseInput = z.infer<typeof DetectPlantDiseaseInputSchema>;

const DetectPlantDiseaseOutputSchema = z.object({
  detectedDisease: z
    .string()
    .describe(
      "The name of the detected disease (e.g., 'Early Blight', 'Powdery Mildew') or 'Healthy' if no disease is found."
    ),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe("A confidence score for the diagnosis, ranging from 0 (low) to 1 (high)."),
  causes: z
    .string()
    .describe('Brief explanation of why this disease occurred (e.g., high humidity, soil imbalance).'),
  preventionTips: z
    .array(z.string())
    .describe('A list of actionable steps to prevent this disease in the future.'),
  treatmentSteps: z
    .array(z.string())
    .describe('A list of step-by-step points for treating the detected disease.'),
});
export type DetectPlantDiseaseOutput = z.infer<typeof DetectPlantDiseaseOutputSchema>;

export async function detectPlantDisease(
  input: DetectPlantDiseaseInput
): Promise<DetectPlantDiseaseOutput> {
  return detectPlantDiseaseFlow(input);
}

const detectPlantDiseasePrompt = ai.definePrompt({
  name: 'detectPlantDiseasePrompt',
  input: {schema: DetectPlantDiseaseInputSchema},
  output: {schema: DetectPlantDiseaseOutputSchema},
  prompt: `You are an expert plant pathologist and agricultural advisor. Your task is to analyze the provided image of a plant to detect any diseases and offer detailed treatment advice.

If the plant appears healthy:
- State 'Healthy' for the detected disease.
- Provide general care tips in the treatment steps.
- Explain that good care prevents disease in the causes section.

If a disease is detected:
- Identify the specific name.
- Explain the underlying reasons/causes for its occurrence.
- Provide clear, actionable prevention tips for future cycles.
- Provide a step-by-step treatment guide in point format.

Photo: {{media url=photoDataUri}}`,
});

const detectPlantDiseaseFlow = ai.defineFlow(
  {
    name: 'detectPlantDiseaseFlow',
    inputSchema: DetectPlantDiseaseInputSchema,
    outputSchema: DetectPlantDiseaseOutputSchema,
  },
  async input => {
    const {output} = await detectPlantDiseasePrompt(input);
    if (!output) {
      throw new Error('Failed to get disease detection output.');
    }
    return output;
  }
);
