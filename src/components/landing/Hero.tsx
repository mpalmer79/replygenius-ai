'use client';

import Link from 'next/link';

interface HeroProps {
  isVisible: boolean;
}

export default function Hero({ isVisible }: HeroProps) {
  return (
    <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-mesh-gradient">
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur rounded-full text-primary-700 text-sm font-medium mb-6 shadow-lg border border-primary-100 animate-bounce-subtle">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Trusted by 500+ local businesses
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Respond to Every Review with{' '}
            <span className="text-gradient animate-gradient bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-[length:200%_auto]">
              AI Precision
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Stop spending hours crafting review responses. GraniteReply AI generates personalized, on-brand replies to your Google, Yelp,
            Facebook, and TripAdvisor reviews in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto group">
              Start 14-Day Free Trial
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
              See How It Works
            </a>
          </div>
          <p className="text-sm text-gray-500">No credit card required • Setup in 5 minutes</p>
        </div>

        {/* Industry Examples */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          <img src="/florist.png" alt="AI-generated florist review response example" className="rounded-2xl shadow-lg max-w-sm w-full object-cover" />
          <img src="/handyman.png" alt="AI-generated handyman review response example" className="rounded-2xl shadow-lg max-w-sm w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

