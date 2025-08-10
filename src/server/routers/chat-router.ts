// src/server/routers/chat-router.ts
import { z } from 'zod';
import { j, publicProcedure } from '../jstack';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const chatInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string()
    })
  ),
  formData: z.any()
});

export const chatRouter = j.router({
  // Main chat endpoint
  sendMessage: publicProcedure
    .input(chatInputSchema)
    .mutation(async ({ c, input }) => {
      const { messages, formData } = input;

      try {
        const systemPrompt = `You are an expert resume advisor. You will receive the current resume data as JSON and user questions about improving their resume.

Current Resume Data:
${JSON.stringify(formData, null, 2)}

Rules for your responses:
1. Always provide actionable advice
2. When suggesting changes, provide them in a specific JSON format
3. Focus on ATS optimization, impact statements, and industry best practices
4. If suggesting changes to the resume data, wrap your JSON suggestions in <RESUME_CHANGES> tags
5. Keep responses conversational but professional

JSON Change Format (when applicable):
{
  "section": "personal_details" | "jobs" | "educations" | "skills" | "tools" | "languages",
  "action": "update" | "add" | "remove",
  "index": number (for array items, optional),
  "data": {...} (the new/updated data),
  "explanation": "Brief explanation of why this change improves the resume"
}

For multiple changes, provide an array of change objects.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini', // gpt-5
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
          temperature: 0.7,
          max_tokens: 2000
        });

        const response =
          completion.choices[0]?.message?.content ||
          'Sorry, I could not generate a response.';

        return c.json({
          success: true,
          content: response
        });
      } catch (error) {
        console.error('Chat error:', error);
        return c.json(
          {
            success: false,
            error: 'Failed to get AI response'
          },
          500
        );
      }
    })
});
