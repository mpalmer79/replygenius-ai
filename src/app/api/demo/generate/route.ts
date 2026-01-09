import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessDescription, review, reviewerName, rating } = body;

    // Validate required fields
    if (!businessDescription || !review) {
      return NextResponse.json(
        { error: 'Business description and review are required' },
        { status: 400 }
      );
    }

    // Determine sentiment based on rating or content
    const effectiveRating = rating || 4;
    const isNegative = effectiveRating <= 2;
    const isNeutral = effectiveRating === 3;

    const systemPrompt = `You are a review response specialist. A business owner wants to see how AI can help them respond to customer reviews.

Business Description: ${businessDescription}

Write a professional, personalized response to their customer review. Guidelines:
- Be warm, authentic, and specific to what the customer mentioned
- Reference specific details from the review
- Never use generic phrases like "We appreciate your feedback"
- Sound human, not robotic
- Keep the response 3-5 sentences
${isNegative ? '- This appears to be a negative review - include a sincere apology and offer to make things right' : ''}
${isNeutral ? '- This is a mixed review - acknowledge both positives and address any concerns' : ''}
- End with a genuine invitation to return

IMPORTANT: Detect the language of the review and respond in THE SAME LANGUAGE.`;

    const userPrompt = `Write a response to this customer review:

${reviewerName ? `Reviewer: ${reviewerName}` : ''}
${rating ? `Rating: ${rating}/5 stars` : ''}
Review: "${review}"`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const response = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      response: response.trim(),
    });
  } catch (error) {
    console.error('Demo generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
