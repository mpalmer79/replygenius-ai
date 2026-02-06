'use client';

import { useState, useEffect } from 'react';

const howItWorksSteps = [
  {
    step: 1,
    title: 'Connect Your Platforms',
    description:
      'Link your Google Business, Yelp, Facebook, and TripAdvisor accounts with just a few clicks. We securely sync all your reviews in real-time.',
    // Network server connections (Taylor Vick - confirmed free)
    imgSrc: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=360&fit=crop&crop=center&q=80',
    imgAlt: 'Network cables connected to server representing platform integrations',
  },
  {
    step: 2,
    title: 'Customize Your Brand Voice',
    description: 'Tell our AI about your business personality, tone preferences, and response style. It learns to sound exactly like you.',
    // Team brainstorming at whiteboard (confirmed free)
    imgSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=640&h=360&fit=crop&crop=center&q=80',
    imgAlt: 'Team brainstorming brand voice strategy on whiteboard',
  },
  {
    step: 3,
    title: 'Review & Respond',
    description:
      'AI generates personalized responses instantly. Review, edit if needed, and post with one click. Average response time: under 2 minutes.',
    // Laptop with analytics dashboard on screen (confirmed free)
    imgSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=360&fit=crop&crop=center&q=80',
    imgAlt: 'Person reviewing and approving content on laptop with one click',
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
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary-200 via-accent-300 to-primary-200 rounded-full" />

          {howItWorksSteps.map((item, index) => (
            <div
              key={item.step}
              className={`relative text-center transition-all duration-500 ${activeStep === index ? 'scale-105' : 'scale-100 opacity-70'}`}
            >
              <div
                className={`w-full aspect-video mx-auto mb-6 rounded-2xl overflow-hidden transition-all duration-500 ${
                  activeStep === index
                    ? 'shadow-xl shadow-primary-500/30 ring-4 ring-primary-400/50'
                    : 'shadow-md ring-2 ring-gray-200'
                }`}
              >
                <img
                  src={item.imgSrc}
                  alt={item.imgAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
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
