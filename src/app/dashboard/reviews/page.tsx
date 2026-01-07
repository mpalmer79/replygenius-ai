'use client';

import { useState } from 'react';
import { formatRelativeTime, getPlatformColor, getPlatformName, renderStars, getSentimentColor, getStatusColor } from '@/lib/utils';
import type { Review, Platform, ReviewStatus } from '@/types';

// Mock data
const mockReviews: (Review & { response?: string })[] = [
  {
    id: '1',
    location_id: 'loc1',
    platform: 'google',
    reviewer_name: 'Sarah M.',
    rating: 5,
    review_text: 'Absolutely amazing experience! The food was incredible and the service was top-notch. Our server Jessica was particularly attentive and made great recommendations. Will definitely be coming back!',
    sentiment_score: 0.95,
    sentiment_label: 'positive',
    key_topics: ['food quality', 'service', 'staff'],
    status: 'pending',
    is_urgent: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    location_id: 'loc1',
    platform: 'yelp',
    reviewer_name: 'Mike T.',
    rating: 2,
    review_text: 'Waited over 45 minutes for our food. When it finally arrived, it was cold. The manager apologized but didn\'t offer any compensation. Very disappointed with this experience.',
    sentiment_score: -0.8,
    sentiment_label: 'negative',
    key_topics: ['wait time', 'food temperature', 'management'],
    status: 'pending',
    is_urgent: true,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    location_id: 'loc1',
    platform: 'facebook',
    reviewer_name: 'Emily R.',
    rating: 4,
    review_text: 'Great atmosphere and friendly staff. Food was good but portions could be a bit larger for the price. The pasta was delicious though!',
    sentiment_score: 0.6,
    sentiment_label: 'positive',
    key_topics: ['atmosphere', 'portions', 'value', 'pasta'],
    status: 'draft',
    is_urgent: false,
    response: 'Thank you so much for your kind words, Emily! We\'re thrilled you enjoyed our atmosphere and pasta. We appreciate your feedback about portion sizes and will share this with our culinary team. We hope to welcome you back soon!\n\n- Maria, Owner',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    location_id: 'loc1',
    platform: 'tripadvisor',
    reviewer_name: 'David L.',
    rating: 5,
    review_text: 'Best restaurant in town! We celebrated our anniversary here and everything was perfect. The staff even brought out a complimentary dessert with a candle. Such a thoughtful touch!',
    sentiment_score: 0.98,
    sentiment_label: 'positive',
    key_topics: ['special occasion', 'dessert', 'thoughtful service'],
    status: 'posted',
    is_urgent: false,
    response: 'Happy Anniversary, David! What an honor to be part of your special celebration. Our team loves creating memorable moments for our guests. Thank you for choosing us, and we can\'t wait to celebrate many more milestones with you!\n\n- Maria, Owner',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    location_id: 'loc1',
    platform: 'google',
    reviewer_name: 'Jennifer K.',
    rating: 3,
    review_text: 'Food was okay, nothing special. The bruschetta appetizer was good but the main course was underseasoned. Service was friendly though.',
    sentiment_score: 0.1,
    sentiment_label: 'neutral',
    key_topics: ['food quality', 'seasoning', 'service'],
    status: 'pending',
    is_urgent: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function ReviewsPage() {
  const [reviews] = useState(mockReviews);
  const [selectedReview, setSelectedReview] = useState<(typeof mockReviews)[0] | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = reviews.filter((review) => {
    if (filterPlatform !== 'all' && review.platform !== filterPlatform) return false;
    if (filterStatus !== 'all' && review.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        review.reviewer_name?.toLowerCase().includes(query) ||
        review.review_text?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleSelectReview = (review: typeof mockReviews[0]) => {
    setSelectedReview(review);
    setResponseText(review.response || '');
  };

  const handleGenerateResponse = async () => {
    if (!selectedReview) return;
    
    setIsGenerating(true);
    
    // Mock API call - replace with actual API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const mockResponses: Record<string, string> = {
      positive: `Thank you so much for your wonderful review, ${selectedReview.reviewer_name}! We're absolutely thrilled to hear about your positive experience. Your kind words mean the world to our team, and we can't wait to welcome you back soon!\n\n- Maria, Owner`,
      negative: `Dear ${selectedReview.reviewer_name}, thank you for taking the time to share your feedback. We sincerely apologize for the disappointing experience you had with us. This is not the standard we hold ourselves to, and we take your concerns very seriously. We would love the opportunity to make this right. Please reach out to us directly at manager@acmerestaurant.com so we can discuss how to improve your next visit.\n\n- Maria, Owner`,
      neutral: `Thank you for dining with us and sharing your thoughts, ${selectedReview.reviewer_name}! We appreciate your honest feedback and are always looking for ways to improve. We hope to have the chance to exceed your expectations on your next visit!\n\n- Maria, Owner`,
    };
    
    setResponseText(mockResponses[selectedReview.sentiment_label || 'neutral']);
    setIsGenerating(false);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(responseText);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="mt-1 text-gray-500">Manage and respond to your customer reviews</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value as Platform | 'all')}
              className="input-field py-2"
            >
              <option value="all">All Platforms</option>
              <option value="google">Google</option>
              <option value="yelp">Yelp</option>
              <option value="facebook">Facebook</option>
              <option value="tripadvisor">TripAdvisor</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ReviewStatus | 'all')}
              className="input-field py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="posted">Posted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{filteredReviews.length} reviews</span>
            <select className="text-sm border-0 text-gray-500 focus:ring-0">
              <option>Newest first</option>
              <option>Oldest first</option>
              <option>Highest rated</option>
              <option>Lowest rated</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                onClick={() => handleSelectReview(review)}
                className={`card cursor-pointer transition-all hover:shadow-md ${
                  selectedReview?.id === review.id ? 'ring-2 ring-primary-500' : ''
                } ${review.is_urgent ? 'border-l-4 border-l-red-500' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`badge ${getPlatformColor(review.platform)}`}>
                      {getPlatformName(review.platform)}
                    </span>
                    <span className="font-medium text-gray-900">{review.reviewer_name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatRelativeTime(review.created_at)}</span>
                </div>

                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-yellow-500 text-sm">{renderStars(review.rating)}</span>
                  <span className={`badge ${getStatusColor(review.status)}`}>{review.status}</span>
                  {review.is_urgent && <span className="badge bg-red-100 text-red-800">Urgent</span>}
                </div>

                <p className="mt-2 text-gray-600 text-sm line-clamp-2">{review.review_text}</p>

                <div className="mt-3 flex items-center space-x-2">
                  <span className={`badge ${getSentimentColor(review.sentiment_label || 'neutral')}`}>
                    {review.sentiment_label}
                  </span>
                  {review.key_topics?.slice(0, 2).map((topic) => (
                    <span key={topic} className="badge bg-gray-100 text-gray-600">{topic}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Panel */}
        <div className="lg:sticky lg:top-24 h-fit">
          {selectedReview ? (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Response</h3>
                <span className={`badge ${getStatusColor(selectedReview.status)}`}>
                  {selectedReview.status}
                </span>
              </div>

              {/* Original Review */}
              <div className="p-4 bg-gray-50 rounded-xl mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{selectedReview.reviewer_name}</span>
                    <span className="text-yellow-500 text-sm">{renderStars(selectedReview.rating)}</span>
                  </div>
                  <span className={`badge ${getPlatformColor(selectedReview.platform)}`}>
                    {getPlatformName(selectedReview.platform)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{selectedReview.review_text}</p>
                {selectedReview.key_topics && selectedReview.key_topics.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {selectedReview.key_topics.map((topic) => (
                      <span key={topic} className="badge bg-white text-gray-600 border border-gray-200">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Generate Button */}
              {!responseText && (
                <button
                  onClick={handleGenerateResponse}
                  disabled={isGenerating}
                  className="w-full btn-primary mb-4"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating AI Response...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate AI Response
                    </>
                  )}
                </button>
              )}

              {/* Response Text Area */}
              {(responseText || isGenerating) && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Response
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={6}
                      className="input-field resize-none"
                      placeholder="Your response will appear here..."
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <button onClick={handleCopyResponse} className="btn-secondary flex-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                    <button onClick={handleGenerateResponse} className="btn-secondary flex-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate
                    </button>
                    <button className="btn-primary flex-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Post
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="card text-center py-12">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Select a Review</h3>
              <p className="text-gray-500">Click on a review to generate or edit a response</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
