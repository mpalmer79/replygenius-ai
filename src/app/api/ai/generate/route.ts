import { NextRequest, NextResponse } from 'next/server';
import { generateReviewResponse } from '@/lib/ai/response-generator';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { GenerateResponseRequest, BrandVoiceSettings } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateResponseRequest = await request.json();
    const { reviewId, reviewText, rating, reviewerName, platform, businessName, organizationId } = body;

    // Validate required fields
    if (!reviewId || !reviewText || !rating || !platform || !businessName || !organizationId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch brand voice settings
    const { data: brandVoiceData, error: brandVoiceError } = await supabaseAdmin
      .from('brand_voice_settings')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (brandVoiceError && brandVoiceError.code !== 'PGRST116') {
      console.error('Error fetching brand voice:', brandVoiceError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch brand voice settings' },
        { status: 500 }
      );
    }

    // Use default settings if none exist
    const brandVoice: BrandVoiceSettings = brandVoiceData || {
      id: '',
      organization_id: organizationId,
      tone: 'professional',
      response_length: 'medium',
      include_owner_signature: false,
      always_apologize_negative: true,
      offer_resolution_negative: true,
      include_call_to_action: true,
      call_to_action_text: 'We hope to see you again soon!',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Generate response using OpenAI
    const result = await generateReviewResponse({
      reviewText,
      rating,
      reviewerName,
      platform,
      businessName,
      brandVoice,
    });

    // Save the response as a draft
    const { error: responseError } = await supabaseAdmin.from('responses').insert({
      review_id: reviewId,
      response_text: result.response,
      is_ai_generated: true,
      ai_model_used: 'gpt-4-turbo-preview',
      tokens_used: result.tokensUsed,
    });

    if (responseError) {
      console.error('Error saving response:', responseError);
      // Continue anyway - response was generated successfully
    }

    // Update review status to draft
    await supabaseAdmin
      .from('reviews')
      .update({ status: 'draft' })
      .eq('id', reviewId);

    return NextResponse.json({
      success: true,
      data: {
        response: result.response,
        tokensUsed: result.tokensUsed,
      },
    });
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
