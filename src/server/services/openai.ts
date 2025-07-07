import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function createChatCompletion(messages: any[], formData: any) {
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
  "action": "update" | "add" ,
  "index": number (for array items, optional),
  "data": {...} (the new/updated data),
  "explanation": "Brief explanation of why this change improves the resume"
}

For multiple changes, provide an array of change objects.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    stream: true,
    temperature: 0.7,
    max_tokens: 7000
  });

  return completion;
}
