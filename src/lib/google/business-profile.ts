/**
 * Google Business Profile API Service
 * 
 * Handles fetching reviews and posting responses via Google's Business Profile APIs
 */

const ACCOUNT_MANAGEMENT_API = 'https://mybusinessaccountmanagement.googleapis.com/v1';
const BUSINESS_INFO_API = 'https://mybusinessbusinessinformation.googleapis.com/v1';

interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
}

interface GoogleAccount {
  name: string; // format: accounts/{accountId}
  accountName: string;
  type: string;
  role: string;
  state: {
    status: string;
  };
}

interface GoogleLocation {
  name: string; // format: locations/{locationId}
  title: string;
  storefrontAddress?: {
    addressLines: string[];
    locality: string;
    administrativeArea: string;
    postalCode: string;
  };
}

interface GoogleReview {
  name: string; // format: accounts/{accountId}/locations/{locationId}/reviews/{reviewId}
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

/**
 * Refresh an expired access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<GoogleTokens | null> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      console.error('Failed to refresh token:', await response.text());
      return null;
    }

    const data = await response.json();
    const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

    return {
      access_token: data.access_token,
      refresh_token: refreshToken, // Refresh token doesn't change
      token_expires_at: expiresAt,
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

/**
 * Get all business accounts for the authenticated user
 */
export async function getAccounts(accessToken: string): Promise<GoogleAccount[]> {
  try {
    const response = await fetch(`${ACCOUNT_MANAGEMENT_API}/accounts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to get accounts:', error);
      return [];
    }

    const data = await response.json();
    return data.accounts || [];
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
}

/**
 * Get all locations for a business account
 */
export async function getLocations(accessToken: string, accountId: string): Promise<GoogleLocation[]> {
  try {
    const response = await fetch(
      `${BUSINESS_INFO_API}/${accountId}/locations?readMask=name,title,storefrontAddress`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to get locations:', error);
      return [];
    }

    const data = await response.json();
    return data.locations || [];
  } catch (error) {
    console.error('Error getting locations:', error);
    return [];
  }
}

/**
 * Get reviews for a location
 */
export async function getReviews(
  accessToken: string, 
  accountId: string, 
  locationId: string,
  pageSize: number = 50,
  pageToken?: string
): Promise<{ reviews: GoogleReview[]; nextPageToken?: string }> {
  try {
    let url = `${ACCOUNT_MANAGEMENT_API}/${accountId}/${locationId}/reviews?pageSize=${pageSize}`;
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to get reviews:', error);
      return { reviews: [] };
    }

    const data = await response.json();
    return {
      reviews: data.reviews || [],
      nextPageToken: data.nextPageToken,
    };
  } catch (error) {
    console.error('Error getting reviews:', error);
    return { reviews: [] };
  }
}

/**
 * Post a reply to a review
 */
export async function replyToReview(
  accessToken: string,
  reviewName: string, // Full resource name: accounts/{accountId}/locations/{locationId}/reviews/{reviewId}
  replyText: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${ACCOUNT_MANAGEMENT_API}/${reviewName}/reply`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: replyText,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to reply to review:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error replying to review:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Delete a reply from a review
 */
export async function deleteReply(
  accessToken: string,
  reviewName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${ACCOUNT_MANAGEMENT_API}/${reviewName}/reply`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to delete reply:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting reply:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Convert Google star rating to numeric value
 */
export function starRatingToNumber(rating: GoogleReview['starRating']): number {
  const map: Record<string, number> = {
    'ONE': 1,
    'TWO': 2,
    'THREE': 3,
    'FOUR': 4,
    'FIVE': 5,
  };
  return map[rating] || 0;
}

/**
 * Sync reviews from Google to our database
 */
export async function syncReviewsToDatabase(
  accessToken: string,
  accountId: string,
  locationId: string,
  supabase: any, // Supabase client
  locationDbId: string // Our database location ID
): Promise<{ synced: number; errors: number }> {
  let synced = 0;
  let errors = 0;
  let pageToken: string | undefined;

  do {
    const { reviews, nextPageToken } = await getReviews(
      accessToken,
      accountId,
      locationId,
      50,
      pageToken
    );

    for (const review of reviews) {
      try {
        const reviewData = {
          location_id: locationDbId,
          platform: 'google',
          platform_review_id: review.reviewId,
          reviewer_name: review.reviewer.displayName,
          reviewer_avatar_url: review.reviewer.profilePhotoUrl,
          rating: starRatingToNumber(review.starRating),
          review_text: review.comment || '',
          review_date: review.createTime,
          platform_url: null, // Google doesn't provide direct URLs
          has_response: !!review.reviewReply,
          metadata: {
            resourceName: review.name,
            updateTime: review.updateTime,
            existingReply: review.reviewReply,
          },
        };

        // Upsert the review
        const { error } = await supabase
          .from('reviews')
          .upsert(reviewData, {
            onConflict: 'platform,platform_review_id',
          });

        if (error) {
          console.error('Error saving review:', error);
          errors++;
        } else {
          synced++;
        }
      } catch (error) {
        console.error('Error processing review:', error);
        errors++;
      }
    }

    pageToken = nextPageToken;
  } while (pageToken);

  return { synced, errors };
}
