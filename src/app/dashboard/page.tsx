'use client';

import Link from 'next/link';
import { formatRelativeTime, getPlatformColor, getPlatformName, renderStars, getSentimentColor } from '@/lib/utils';

// Mock data
const stats = [
  { name: 'Total Reviews', value: '156', change: '+12%', changeType: 'positive' },
  { name: 'Pending Responses', value: '8', change: '-3', changeType: 'positive' },
  { name: 'Average Rating', value: '4.6', change: '+0.2', changeType: 'positive' },
  { name: 'Response Rate', value: '94%', change: '+5%', changeType: 'positive' },
];

const recentReviews = [
  {
    id: '1',
    platform: 'google' as const,
    reviewer_name: 'Sarah M.',
    rating: 5,
    review_text: 'Absolutely amazing experience! The food was incredible and the service was top-notch. Will definitely be coming back!',
    sentiment_label: 'positive' as const,
    status: 'pending' as const,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    platform: 'yelp' as const,
    reviewer_name: 'Mike T.',
    rating: 2,
    review_text: 'Waited over 45 minutes for our food. When it finally arrived, it was cold. Very disappointed with this experience.',
    sentiment_label: 'negative' as const,
    status: 'pending' as const,
    is_urgent: true,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    platform: 'facebook' as const,
    reviewer_name: 'Emily R.',
    rating: 4,
    review_text: 'Great atmosphere and friendly staff. Food was good but portions could be a bit larger for the price.',
    sentiment_label: 'positive' as const,
    status: 'draft' as const,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    platform: 'tripadvisor' as const,
    reviewer_name: 'David L.',
    rating: 5,
    review_text: 'Best restaurant in town! We celebrated our anniversary here and everything was perfect.',
    sentiment_label: 'positive' as const,
    status: 'posted' as const,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-500">Welcome back! Here&apos;s what&apos;s happening with your reviews.</p>
        </div>
        <Link href="/dashboard/reviews" className="mt-4 sm:mt-0 btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Respond to Reviews
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{stat.name}</span>
              <span
                className={`inline-flex items-center text-xs font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.changeType === 'positive' ? (
                  <svg className="w-4 h-4 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Urgent Alert */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold text-red-800">Attention Required</h3>
            <p className="mt-1 text-sm text-red-700">
              You have <span className="font-semibold">1 negative review</span> that needs a response. Quick responses to negative reviews can help recover customer relationships.
            </p>
          </div>
          <Link href="/dashboard/reviews?filter=urgent" className="ml-4 btn-danger text-sm px-3 py-1.5">
            View Now
          </Link>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
          <Link href="/dashboard/reviews" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
            View all →
          </Link>
        </div>

        <div className="space-y-4">
          {recentReviews.map((review) => (
            <div
              key={review.id}
              className={`p-4 rounded-xl border transition-colors hover:border-gray-300 ${
                review.is_urgent ? 'border-red-200 bg-red-50/50' : 'border-gray-100 bg-gray-50/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`badge ${getPlatformColor(review.platform)}`}>
                    {getPlatformName(review.platform)}
                  </span>
                  <span className="font-medium text-gray-900">{review.reviewer_name}</span>
                  <span className="text-yellow-500 text-sm">{renderStars(review.rating)}</span>
                  {review.is_urgent && (
                    <span className="badge bg-red-100 text-red-800">Urgent</span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{formatRelativeTime(review.created_at)}</span>
              </div>
              <p className="mt-2 text-gray-600 text-sm line-clamp-2">{review.review_text}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`badge ${getSentimentColor(review.sentiment_label)}`}>
                    {review.sentiment_label}
                  </span>
                </div>
                <Link
                  href={`/dashboard/reviews?id=${review.id}`}
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  {review.status === 'pending' ? 'Generate Response' : 'View Response'} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews by Platform</h3>
          <div className="space-y-3">
            {[
              { platform: 'google' as const, count: 78, percentage: 50 },
              { platform: 'yelp' as const, count: 45, percentage: 29 },
              { platform: 'facebook' as const, count: 23, percentage: 15 },
              { platform: 'tripadvisor' as const, count: 10, percentage: 6 },
            ].map((item) => (
              <div key={item.platform}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{getPlatformName(item.platform)}</span>
                  <span className="text-gray-500">{item.count} reviews</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.platform === 'google'
                        ? 'bg-blue-500'
                        : item.platform === 'yelp'
                        ? 'bg-red-500'
                        : item.platform === 'facebook'
                        ? 'bg-indigo-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <div className="text-3xl font-bold text-gray-900">2.1</div>
              <div className="text-sm text-gray-500 mt-1">Avg. Minutes to Response</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <div className="text-3xl font-bold text-gray-900">89%</div>
              <div className="text-sm text-gray-500 mt-1">Responses Approved</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <div className="text-3xl font-bold text-gray-900">1.2</div>
              <div className="text-sm text-gray-500 mt-1">Avg. Edits per Response</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <div className="text-3xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-500 mt-1">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
