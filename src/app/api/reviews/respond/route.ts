import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { replyToReview, refreshAccessToken } from '@/lib/google/business-profile';
import { generateReviewResponse } from '@/lib/ai/response-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, response: providedResponse, autoGenerate, brandVoiceId } = body;

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get the review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select(`
        *,
        location:locations(
          *,
          organization:organizations(*)
        )
      `)
      .eq('id', reviewId)
      .single();

    if (reviewError || !review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Get response text - either provided or auto-generate
    let responseText = providedResponse;

    if (autoGenerate || !responseText) {
      // Get brand voice settings
      let brandVoice = null;
      if (brandVoiceId) {
        const { data } = await supabase
          .from('brand_voice_settings')
          .select('*')
          .eq('id', brandVoiceId)
          .single();
        brandVoice = data;
      } else if (review.location?.organization_id) {
        // Get default brand voice for organization
        const { data } = await supabase
          .from('brand_voice_settings')
          .select('*')
          .eq('organization_id', review.location.organization_id)
          .eq('is_default', true)
          .single();
        brandVoice = data;
      }

      // Use default brand voice if none found
      if (!brandVoice) {
        brandVoice = {
          tone: 'friendly',
          response_length: 'medium',
          include_call_to_action: true,
          call_to_action_text: 'We hope to see you again soon!',
          always_apologize_negative: true,
          offer_resolution_negative: true,
        };
      }

      // Generate AI response
      const generated = await generateReviewResponse({
        reviewText: review.review_text,
        rating: review.rating,
        reviewerName: review.reviewer_name,
        platform: 'google',
        businessName: review.location?.name || 'Our Business',
        brandVoice,
      });

      responseText = generated.response;
    }

    // For Google reviews, post the response
    if (review.platform === 'google' && review.metadata?.resourceName) {
      // Get the Google connection
      const { data: connection } = await supabase
        .from('platform_connections')
        .select('*')
        .eq('platform', 'google')
        .eq('is_active', true)
        .single();

      if (!connection) {
        // Save response but mark as pending (manual post required)
        const { data: savedResponse, error: saveError } = await supabase
          .from('responses')
          .insert({
            review_id: reviewId,
            response_text: responseText,
            status: 'pending',
            is_ai_generated: autoGenerate || !providedResponse,
          })
          .select()
          .single();

        return NextResponse.json({
          success: true,
          response: savedResponse,
          posted: false,
          message: 'Response saved but not posted - no Google connection found',
        });
      }

      // Check if token needs refresh
      let accessToken = connection.access_token;
      if (connection.token_expires_at && new Date(connection.token_expires_at) < new Date()) {
        if (connection.refresh_token) {
          const newTokens = await refreshAccessToken(connection.refresh_token);
          if (newTokens) {
            accessToken = newTokens.access_token;
            await supabase
              .from('platform_connections')
              .update({
                access_token: newTokens.access_token,
                token_expires_at: newTokens.token_expires_at,
              })
              .eq('id', connection.id);
          }
        }
      }

      // Post to Google
      const postResult = await replyToReview(
        accessToken,
        review.metadata.resourceName,
        responseText
      );

      // Save the response in our database
      const { data: savedResponse, error: saveError } = await supabase
        .from('responses')
        .insert({
          review_id: reviewId,
          response_text: responseText,
          status: postResult.success ? 'posted' : 'failed',
          posted_at: postResult.success ? new Date().toISOString() : null,
          is_ai_generated: autoGenerate || !providedResponse,
          error_message: postResult.error,
        })
        .select()
        .single();

      // Update review to mark as responded
      if (postResult.success) {
        await supabase
          .from('reviews')
          .update({ has_response: true })
          .eq('id', reviewId);
      }

      return NextResponse.json({
        success: postResult.success,
        response: savedResponse,
        posted: postResult.success,
        error: postResult.error,
      });

    } else {
      // Non-Google review - just save the response
      const { data: savedResponse, error: saveError } = await supabase
        .from('responses')
        .insert({
          review_id: reviewId,
          response_text: responseText,
          status: 'pending',
          is_ai_generated: autoGenerate || !providedResponse,
        })
        .select()
        .single();

      return NextResponse.json({
        success: true,
        response: savedResponse,
        posted: false,
        message: 'Response saved - manual posting required for this platform',
      });
    }

  } catch (error) {
    console.error('Respond error:', error);
    return NextResponse.json({ error: 'Failed to process response' }, { status: 500 });
  }
}
