import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

type AnyJson = Record<string, unknown>;

export async function POST(request: NextRequest) {
  let uploadedFileId: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Optional: basic type/size validation
    if (file.type && file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are supported.' },
        { status: 415 }
      );
    }

    // Upload the PDF directly to OpenAI
    const uploaded = await client.files.create({
      file,
      purpose: 'user_data'
    });
    uploadedFileId = uploaded.id;

    // Ask the model to parse and STRICTLY return JSON matching the structure below.
    const response = await client.responses.create({
      model: 'gpt-5',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_file',
              file_id: uploadedFileId!
            },
            {
              type: 'input_text',
              text: `You are a strict JSON extractor.

Return ONLY valid JSON (no code fences, no prose) that exactly matches the following structure and property names. Use empty strings "" for any missing fields. For dates, prefer YYYY-MM-DD when possible, otherwise use the resume’s format. For job descriptions, merge bullet points into a single string.

Exact structure:
{
  "firstname": "",
  "lastname": "",
  "email": "",
  "contactno": "",
  "country": "",
  "city": "",
  "certificates": [
    {
      "credentialId": "",
      "credentialUrl": "",
      "description": "",
      "expirationDate": "",
      "issuedOn": "",
      "issuer": "",
      "name": ""
    }
  ],
  "education": [
    {
      "city": "",
      "degree": "",
      "description": "",
      "endDate": "",
      "field": "",
      "school": "",
      "startDate": ""
    }
  ],
  "extracurriculars": [
    {
      "activityName": "",
      "description": "",
      "endDate": "",
      "organization": "",
      "role": "",
      "startDate": ""
    }
  ],
  "jobs": [
    {
      "city": "",
      "description": "",
      "employer": "",
      "endDate": "",
      "jobTitle": "",
      "startDate": ""
    }
  ]
}

Rules:
1) Output must be valid JSON only.
2) All listed keys must be present even if empty.
3) Do not include any fields not shown above.
4) Combine bullet points for job descriptions into one string.
5) Dates must be valid format YYYY-MM-DD in case DD is not available then make hypothetical DD, else empty only.
6) Use "" for any unknown values.`
            }
          ]
        }
      ]
    });

    const content = response?.output_text;

    // const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No data extracted from resume');
    }

    // The response is guaranteed to be valid JSON per schema.
    // Still parse defensively in case the SDK returns string content.
    const data: AnyJson =
      typeof content === 'string'
        ? (JSON.parse(content) as AnyJson)
        : (content as AnyJson);

    return NextResponse.json({
      success: true,
      message: 'Resume parsed successfully',
      data
    });
  } catch (err: unknown) {
    const message =
      (err as { message?: string })?.message ||
      'Unexpected error while parsing resume';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  } finally {
    if (uploadedFileId) {
      try {
        await client.files.delete(uploadedFileId);
      } catch {
        console.warn('Error Deleting file on Open Ai storage');
      }
    }
  }
}
