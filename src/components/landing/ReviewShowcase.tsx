'use client';

import { useState, useEffect } from 'react';
import { reviewShowcase, platformColors, platformNames } from '@/data/reviews';

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewShowcase() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentReviewIndex((prev) => (prev + 1) % reviewShowcase.length);
        setIsTransitioning(false);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const currentReview = reviewShowcase[currentReviewIndex];

  const platformLetter = (platform: string) => {
    const letters: Record<string, string> = { google: 'G', yelp: 'Y', facebook: 'f', tripadvisor: 'T' };
    return letters[platform] || '?';
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-primary-50/30 to-white relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">See AI Responses in Action</h2>
          <p className="text-gray-600 text-lg">Real examples of how GraniteReply transforms customer interactions</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 via-accent-400/20 to-primary-400/20 blur-3xl scale-95" />

          <div
            className={`relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 ${platformColors[currentReview.platform].bg} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}
                  >
                    {platformLetter(currentReview.platform)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{currentReview.business}</div>
                    <div className="text-sm text-gray-500">{platformNames[currentReview.platform]} Review</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="hidden sm:inline">Auto-rotating</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium animate-pulse">
                    Live Demo
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Original Review */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Customer Review</span>
                  {renderStars(currentReview.rating)}
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm flex-shrink-0">
                    {currentReview.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 mb-1">{currentReview.reviewer}</div>
                    <p className="text-gray-600 leading-relaxed">&ldquo;{currentReview.review}&rdquo;</p>
                  </div>
                </div>
              </div>

              {/* AI Response */}
              <div className="p-6 bg-gradient-to-br from-primary-50/50 to-accent-50/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">AI-Generated Response</span>
                  <div className="flex items-center space-x-1 text-primary-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs font-medium">GraniteReply AI</span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100">
                  <p className="text-gray-700 leading-relaxed text-sm">{currentReview.response}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>Generated in 1.2 seconds</span>
                  <span className="text-green-600 font-medium">✓ Ready to post</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-2">
                {reviewShowcase.slice(0, 10).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setCurrentReviewIndex(index);
                        setIsTransitioning(false);
                      }, 300);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentReviewIndex % 10 ? 'bg-primary-500 w-6' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`View review ${index + 1}`}
                  />
                ))}
                <span className="text-xs text-gray-400 ml-2">+10 more</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
