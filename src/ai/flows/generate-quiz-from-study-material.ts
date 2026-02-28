'use server';
/**
 * @fileOverview A Genkit flow for generating quizzes from study materials.
 *
 * - generateQuizFromStudyMaterial - A function that generates a quiz based on provided study material.
 * - GenerateQuizInput - The input type for the generateQuizFromStudyMaterial function.
 * - GenerateQuizOutput - The return type for the generateQuizFromStudyMaterial function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const GenerateQuizInputSchema = z.object({
  studyMaterial: z.string().describe('The study material (syllabus, notes) content from which to generate a quiz.'),
  numQuestions: z.number().int().min(1).max(20).default(5).describe('The desired number of quiz questions to generate (1-20).'),
  questionType: z.enum(['multiple choice', 'true/false', 'short answer']).default('multiple choice').describe('The desired type of questions for the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

// Output Schema for a single question
const QuizQuestionSchema = z.object({
  questionText: z.string().describe('The text of the quiz question.'),
  options: z.array(z.string()).optional().describe('An array of possible answer options for multiple choice questions. This field is optional for true/false or short answer questions.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  explanation: z.string().describe('A brief explanation for the correct answer.'),
});

// Output Schema for the entire quiz
const GenerateQuizOutputSchema = z.object({
  quizTitle: z.string().describe('A suitable title for the generated quiz.'),
  questions: z.array(QuizQuestionSchema).describe('An array of generated quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

// Wrapper function to call the flow
export async function generateQuizFromStudyMaterial(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

// Genkit Prompt definition
const quizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert educator and quiz creator. Your task is to generate a quiz based on the provided study material.

Material:
{{{studyMaterial}}}

Instructions:
1. Generate a quiz of {{{numQuestions}}} questions.
2. The questions should be of type "{{{questionType}}}".
3. For "multiple choice" questions, provide exactly 4 distinct options in the 'options' array. One option must be the correct answer.
4. For "true/false" questions, the 'options' array should be omitted, and the 'correctAnswer' should be either "True" or "False".
5. For "short answer" questions, the 'options' array should be omitted, and the 'correctAnswer' should be a concise phrase or sentence.
6. Provide a concise explanation for the correct answer for each question.
7. Ensure the quiz covers key concepts from the material.
8. The output must be in JSON format matching the provided schema.

Example for 'multiple choice' type:
{
  "quizTitle": "Sample Quiz on Material",
  "questions": [
    {
      "questionText": "What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Rome"],
      "correctAnswer": "Paris",
      "explanation": "Paris is the capital and most populous city of France."
    }
  ]
}

Example for 'true/false' type:
{
  "quizTitle": "Sample Quiz on Material",
  "questions": [
    {
      "questionText": "The Earth is flat.",
      "correctAnswer": "False",
      "explanation": "The Earth is an oblate spheroid."
    }
  ]
}

Example for 'short answer' type:
{
  "quizTitle": "Sample Quiz on Material",
  "questions": [
    {
      "questionText": "What is the primary function of chlorophyll?",
      "correctAnswer": "To absorb sunlight for photosynthesis",
      "explanation": "Chlorophyll is a green pigment responsible for absorbing light energy during photosynthesis."
    }
  ]
}
`,
});

// Genkit Flow definition
const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFromStudyMaterialFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await quizPrompt(input);
    if (!output) {
      throw new Error('Failed to generate quiz from study material.');
    }
    return output;
  }
);
