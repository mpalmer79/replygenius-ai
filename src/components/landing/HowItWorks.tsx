
'use client';

import { useState, useEffect } from 'react';

const howItWorksSteps = [
  {
    step: 1,
    title: 'Connect Your Platforms',
    description:
      'Link your Google Business, Yelp, Facebook, and TripAdvisor accounts with just a few clicks. We securely sync all your reviews in real-time.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
  {
    step: 2,
    title: 'Customize Your Brand Voice',
    description: 'Tell our AI about your business personality, tone preferences, and response style. It learns to sound exactly like you.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    step: 3,
    title: 'Review & Respond',
    description:
      'AI generates personalized responses instantly. Review, edit if needed, and post with one click. Average response time: under 2 minutes.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(stepInterval);
  }, []);

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-section-gradient-1">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get started in three simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary-200 via-accent-300 to-primary-200 rounded-full" />

          {howItWorksSteps.map((item, index) => (
            <div
              key={item.step}
              className={`relative text-center transition-all duration-500 ${activeStep === index ? 'scale-105' : 'scale-100 opacity-70'}`}
            >
              <div
                className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white font-bold text-xl transition-all duration-500 ${
                  activeStep === index
                    ? 'bg-gradient-to-br from-primary-500 to-accent-500 shadow-xl shadow-primary-500/30 animate-pulse-glow'
                    : 'bg-gray-300'
                }`}
              >
                {item.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{item.description}</p>

              <div className={`mt-4 h-1 w-16 mx-auto rounded-full transition-all duration-500 ${activeStep === index ? 'bg-primary-500 w-24' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12 space-x-3">
          {[0, 1, 2].map((step) => (
            <button
              key={step}
              onClick={() => setActiveStep(step)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeStep === step ? 'bg-primary-500 w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`View step ${step + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
