// 'use server';

/**
 * @fileOverview AI-powered tool to summarize patient notes quickly.
 *
 * - summarizePatientNotes - A function that handles the summarization of patient notes.
 * - SummarizePatientNotesInput - The input type for the summarizePatientNotes function.
 * - SummarizePatientNotesOutput - The return type for the summarizePatientNotes function.
 */

'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePatientNotesInputSchema = z.object({
  patientNotes: z
    .string()
    .describe('The patient notes to be summarized. Should contain all the relevant medical history.'),
});
export type SummarizePatientNotesInput = z.infer<typeof SummarizePatientNotesInputSchema>;

const SummarizePatientNotesOutputSchema = z.object({
  summary: z.string().describe('The summary of the patient notes.'),
});
export type SummarizePatientNotesOutput = z.infer<typeof SummarizePatientNotesOutputSchema>;

export async function summarizePatientNotes(input: SummarizePatientNotesInput): Promise<SummarizePatientNotesOutput> {
  return summarizePatientNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePatientNotesPrompt',
  input: {schema: SummarizePatientNotesInputSchema},
  output: {schema: SummarizePatientNotesOutputSchema},
  prompt: `You are an expert medical summarizer. Please summarize the following patient notes to help doctors quickly understand the patient\'s medical history and make informed decisions.\n\nPatient Notes:\n{{{patientNotes}}}`,
});

const summarizePatientNotesFlow = ai.defineFlow(
  {
    name: 'summarizePatientNotesFlow',
    inputSchema: SummarizePatientNotesInputSchema,
    outputSchema: SummarizePatientNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
