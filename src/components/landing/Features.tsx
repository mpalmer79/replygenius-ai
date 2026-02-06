'use client';

import { useState } from 'react';
import DemoDashboard from './DemoDashboard';

const features = [
  {
    id: 'ai-responses',
    imgSrc: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=640&h=640&fit=crop&crop=center&q=80',
    imgAlt: 'Business owner typing AI-powered review response on laptop',
    title: 'AI-Powered Responses',
    description: 'Generate personalized, human-sounding responses in seconds. Our AI learns your brand voice and tone.',
    interactive: false,
  },
  {
    id: 'multi-platform',
    imgSrc: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=640&h=640&fit=crop&crop=center&q=80',
    imgAlt: 'Smartphone displaying multiple social media and review platform apps',
    title: 'Multi-Platform Support',
    description: 'Manage reviews from Google, Yelp, Facebook, and TripAdvisor all in one unified dashboard.',
    interactive: true,
  },
  {
    id: 'brand-voice',
    imgSrc: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=640&h=640&fit=crop&crop=center&q=80',
    imgAlt: 'Creative workspace with brand identity materials and color swatches',
    title: 'Custom Brand Voice',
    description: 'Train the AI to match your unique personality, tone, and communication style perfectly.',
    interactive: false,
  },
  {
    id: 'sentiment',
    imgSrc: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=640&h=640&fit=crop&crop=center&q=80',
    imgAlt: 'Customer leaving star rating feedback on their experience',
    title: 'Sentiment Analysis',
    description: 'Automatically detect negative reviews and prioritize urgent responses to protect your reputation.',
    interactive: false,
  },
  {
    id: 'approval',
    imgSrc: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&h=640&fit=crop&crop=center&q=80',
    imgAlt: 'Team reviewing and approving content on laptop screen together',
    title: 'Approval Workflow',
    description: 'Review and edit AI responses before posting. Full control with one-click approval.',
    interactive: false,
  },
  {
    id: 'analytics',
    imgSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=640&fit=crop&crop=center&q=80',
    imgAlt: 'Analytics dashboard displaying performance charts and data graphs',
    title: 'Analytics & Reports',
    description: 'Track response rates, sentiment trends, and review volume with detailed analytics.',
    interactive: false,
  },
];

export default function Features() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Manage Reviews</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features designed specifically for local businesses</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`card card-hover group text-center ${feature.interactive ? 'cursor-pointer ring-2 ring-transparent hover:ring-sky-300 relative' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={feature.interactive ? () => setDemoOpen(true) : undefined}
              >
                {feature.interactive && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-sky-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm animate-pulse">
                    Click to try
                  </div>
                )}
                <div className="w-48 h-48 rounded-3xl overflow-hidden mb-5 group-hover:scale-105 transition-transform duration-300 mx-auto shadow-md">
                  <img
                    src={feature.imgSrc}
                    alt={feature.imgAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DemoDashboard isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
