'use server';
/**
 * @fileOverview A Genkit flow that summarizes community forum posts and their comments.
 *
 * - summarizeCommunityPosts - A function that handles the summarization process.
 * - SummarizeCommunityPostsInput - The input type for the summarizeCommunityPosts function.
 * - SummarizeCommunityPostsOutput - The return type for the summarizeCommunityPosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCommunityPostsInputSchema = z.object({
  postText: z.string().describe('The main text of the community forum post.'),
  commentTexts: z.array(z.string()).describe('An array of texts from comments associated with the post.'),
});
export type SummarizeCommunityPostsInput = z.infer<typeof SummarizeCommunityPostsInputSchema>;

const SummarizeCommunityPostsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the community post and its comments.'),
});
export type SummarizeCommunityPostsOutput = z.infer<typeof SummarizeCommunityPostsOutputSchema>;

export async function summarizeCommunityPosts(input: SummarizeCommunityPostsInput): Promise<SummarizeCommunityPostsOutput> {
  return summarizeCommunityPostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCommunityPostsPrompt',
  input: {schema: SummarizeCommunityPostsInputSchema},
  output: {schema: SummarizeCommunityPostsOutputSchema},
  prompt: `You are a helpful assistant specialized in summarizing online forum discussions.\nSummarize the following community forum post and its comments into a concise paragraph, highlighting the main topic, key points raised, and general sentiment.\n\nCommunity Post:\n{{{postText}}}\n\nComments:\n{{#each commentTexts}}\n- {{{this}}}\n{{/each}}`,
});

const summarizeCommunityPostsFlow = ai.defineFlow(
  {
    name: 'summarizeCommunityPostsFlow',
    inputSchema: SummarizeCommunityPostsInputSchema,
    outputSchema: SummarizeCommunityPostsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
