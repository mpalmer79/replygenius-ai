'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function NotFound() {
  const [currentMessage, setCurrentMessage] = useState(0);
  
  const aiMessages = [
    "Hmm, this page seems to have ghosted us... 👻",
    "Even our AI couldn't find this one.",
    "404: Page not responding to reviews.",
    "This URL left a 1-star review and disappeared.",
    "Our AI searched everywhere. No luck!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % aiMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl" />
      </div>

      <div className="text-center relative z-10 max-w-2xl mx-auto">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-[150px] sm:text-[200px] font-bold leading-none bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            404
          </h1>
        </div>

        {/* AI Chat Bubble */}
        <div className="mb-8 relative">
          <div className="inline-flex items-start gap-3 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 max-w-md mx-auto">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold">G</span>
            </div>
            <div className="text-left">
              <p className="text-xs text-primary-600 font-semibold mb-1">GraniteReply AI</p>
              <p className="text-gray-700 transition-all duration-500 min-h-[48px]">
                {aiMessages[currentMessage]}
              </p>
            </div>
          </div>
          {/* Typing indicator dots */}
          <div className="flex justify-center gap-1 mt-3">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/#features"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
          >
            View Features
          </Link>
        </div>

        {/* Fun stats */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">While you're here, did you know?</p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">50K+</div>
              <div className="text-xs text-gray-500">Reviews Responded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">2 min</div>
              <div className="text-xs text-gray-500">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">500+</div>
              <div className="text-xs text-gray-500">Happy Businesses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
