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
For single change:
{
  "section": "personal_details" | "jobs" | "educations" | "skills" | "tools" | "languages",
  "action": "update" | "add" | "remove",
  "index": number (for array items - required for update/remove actions on arrays),
  "data": {...} (the new/updated data - not required for remove actions),
  "explanation": "Brief explanation of why this change improves the resume"
}

For multiple changes, provide an array:
[
  {
    "section": "skills",
    "action": "add",
    "data": "Python",
    "explanation": "Added Python as it's mentioned in the job requirements"
  },
  {
    "section": "jobs",
    "action": "update",
    "index": 0,
    "data": { "description": "Led a team of 5 developers..." },
    "explanation": "Added leadership experience to highlight management skills"
  },
  {
    "section": "skills",
    "action": "remove",
    "index": 2,
    "explanation": "Removed outdated skill that's no longer relevant"
  }
]

Important guidelines for actions:
- UPDATE: Use for modifying existing items. For arrays, always include "index". For personal_details, omit index.
- ADD: Use for adding new items to arrays (jobs, educations, skills, tools, languages). Cannot be used with personal_details.
- REMOVE: Use for removing items from arrays. Always include "index" to specify which item to remove. Cannot be used with personal_details.

Section-specific rules:
- personal_details: Only supports "update" action, no index needed
- jobs, educations: Objects with properties like jobTitle, employer, description, etc.
- skills, tools, languages: Arrays of strings
- Always validate that the index exists when using update/remove actions

Example scenarios:
1. Adding a skill: {"section": "skills", "action": "add", "data": "React", "explanation": "Added React for frontend development"}
2. Updating a job description: {"section": "jobs", "action": "update", "index": 0, "data": {"description": "new description"}, "explanation": "Enhanced job description"}
3. Removing an outdated skill: {"section": "skills", "action": "remove", "index": 1, "explanation": "Removed outdated technology"}
4. Updating personal summary: {"section": "personal_details", "action": "update", "data": {"summary": "new summary"}, "explanation": "Improved professional summary"}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-5',
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
