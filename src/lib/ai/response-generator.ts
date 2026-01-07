import OpenAI from 'openai';
import { BrandVoiceSettings, SentimentAnalysis, Platform } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateParams {
  reviewText: string;
  rating: number;
  reviewerName?: string;
  platform: Platform;
  businessName: string;
  brandVoice: BrandVoiceSettings;
}

export async function generateReviewResponse(params: GenerateParams): Promise<{ response: string; tokensUsed: number }> {
  const { reviewText, rating, reviewerName, platform, businessName, brandVoice } = params;

  const toneDescriptions: Record<string, string> = {
    professional: 'professional, polished, and business-appropriate',
    friendly: 'warm, friendly, and personable',
    casual: 'relaxed, casual, and conversational',
    formal: 'formal, respectful, and traditional',
  };

  const lengthInstructions: Record<string, string> = {
    short: 'Keep the response brief, 2-3 sentences maximum.',
    medium: 'Write a moderate response, 3-5 sentences.',
    detailed: 'Provide a thorough response, 5-7 sentences with specific details.',
  };

  const isNegative = rating <= 2;
  const isNeutral = rating === 3;

  let systemPrompt = `You are a review response specialist for ${businessName}. Write responses that are ${toneDescriptions[brandVoice.tone]}.

${lengthInstructions[brandVoice.response_length]}

${brandVoice.personality_description ? `Brand personality: ${brandVoice.personality_description}` : ''}

${brandVoice.custom_instructions ? `Additional instructions: ${brandVoice.custom_instructions}` : ''}

Guidelines:
- Never use generic phrases like "We appreciate your feedback"
- Be specific and reference details from the review when possible
- Sound human and authentic, not robotic
- ${isNegative && brandVoice.always_apologize_negative ? 'Include a sincere apology for their negative experience' : ''}
- ${isNegative && brandVoice.offer_resolution_negative ? 'Offer to resolve the issue and provide contact information' : ''}
- ${brandVoice.include_call_to_action ? `End with: ${brandVoice.call_to_action_text || 'We hope to see you again soon!'}` : ''}
- ${brandVoice.include_owner_signature && brandVoice.owner_name ? `Sign off as: ${brandVoice.owner_name}${brandVoice.owner_title ? `, ${brandVoice.owner_title}` : ''}` : ''}`;

  let userPrompt = `Write a response to this ${platform} review:

Rating: ${rating}/5 stars
${reviewerName ? `Reviewer: ${reviewerName}` : ''}
Review: "${reviewText}"

${isNegative ? 'This is a negative review - handle with care and empathy.' : ''}
${isNeutral ? 'This is a mixed review - acknowledge both positives and areas for improvement.' : ''}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const response = completion.choices[0]?.message?.content || '';
  const tokensUsed = completion.usage?.total_tokens || 0;

  return { response: response.trim(), tokensUsed };
}

export async function analyzeSentiment(reviewText: string): Promise<SentimentAnalysis> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Analyze the sentiment of customer reviews. Return JSON only:
{
  "score": <number from -1 (very negative) to 1 (very positive)>,
  "label": "<positive|neutral|negative>",
  "keyTopics": ["<topic1>", "<topic2>", "<topic3>"]
}
Extract 2-4 key topics mentioned (e.g., "food quality", "wait time", "staff friendliness").`,
      },
      {
        role: 'user',
        content: `Analyze this review: "${reviewText}"`,
      },
    ],
    temperature: 0.3,
    max_tokens: 150,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

  return {
    score: result.score || 0,
    label: result.label || 'neutral',
    keyTopics: result.keyTopics || [],
  };
}

export async function improveResponse(
  originalResponse: string,
  feedback: string,
  brandVoice: BrandVoiceSettings
): Promise<{ response: string; tokensUsed: number }> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a review response editor. Improve the response based on the feedback while maintaining the brand voice: ${brandVoice.tone}, ${brandVoice.response_length} length.`,
      },
      {
        role: 'user',
        content: `Original response: "${originalResponse}"

Feedback: ${feedback}

Please provide an improved version.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const response = completion.choices[0]?.message?.content || originalResponse;
  const tokensUsed = completion.usage?.total_tokens || 0;

  return { response: response.trim(), tokensUsed };
}
