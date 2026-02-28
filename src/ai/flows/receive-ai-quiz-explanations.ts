'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating AI-powered explanations for quiz answers.
 *
 * - receiveAIQuizExplanations - A function that generates an explanation for a quiz answer.
 * - ReceiveAIQuizExplanationsInput - The input type for the receiveAIQuizExplanations function.
 * - ReceiveAIQuizExplanationsOutput - The return type for the receiveAIQuizExplanations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ReceiveAIQuizExplanationsInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  userAnswer: z.string().describe('The answer provided by the student.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  userWasCorrect: z.boolean().describe('Whether the student\'s answer was correct.'),
  previousExplanation: z.string().optional().describe('An optional previous explanation to elaborate on.'),
});
export type ReceiveAIQuizExplanationsInput = z.infer<typeof ReceiveAIQuizExplanationsInputSchema>;

const ReceiveAIQuizExplanationsOutputSchema = z.object({
  explanation: z.string().describe('A detailed AI-generated explanation for the quiz answer.'),
});
export type ReceiveAIQuizExplanationsOutput = z.infer<typeof ReceiveAIQuizExplanationsOutputSchema>;

export async function receiveAIQuizExplanations(input: ReceiveAIQuizExplanationsInput): Promise<ReceiveAIQuizExplanationsOutput> {
  return receiveAIQuizExplanationsFlow(input);
}

const quizExplanationPrompt = ai.definePrompt({
  name: 'quizExplanationPrompt',
  input: { schema: ReceiveAIQuizExplanationsInputSchema },
  output: { schema: ReceiveAIQuizExplanationsOutputSchema },
  prompt: `You are an expert tutor specializing in providing clear, concise, and comprehensive explanations for quiz answers. Your goal is to help the student understand the concepts thoroughly.

--- Quiz Details ---
Question: {{{question}}}
Student's Answer: {{{userAnswer}}}
Correct Answer: {{{correctAnswer}}}

{{#if userWasCorrect}}
Based on the above, the student's answer was CORRECT. Provide a detailed explanation confirming why the student's answer is correct and why the correct answer is the right choice. Elaborate on any key concepts involved.
{{else}}
Based on the above, the student's answer was INCORRECT. First, explain why the student's answer was incorrect. Then, provide a detailed explanation of why the correct answer is the right choice. Elaborate on any key concepts involved.
{{/if}}

{{#if previousExplanation}}
Additionally, please elaborate further on the following previous explanation:
Previous explanation: {{{previousExplanation}}}
{{/if}}
`,
});

const receiveAIQuizExplanationsFlow = ai.defineFlow(
  {
    name: 'receiveAIQuizExplanationsFlow',
    inputSchema: ReceiveAIQuizExplanationsInputSchema,
    outputSchema: ReceiveAIQuizExplanationsOutputSchema,
  },
  async (input) => {
    const { output } = await quizExplanationPrompt(input);
    return output!;
  }
);
