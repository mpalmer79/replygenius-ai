'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import ReviewShowcase from '@/components/landing/ReviewShowcase';
import IndustryBanner from '@/components/landing/IndustryBanner';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl animate-blob delay-200" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-blob delay-500" />
      </div>

      <Navbar />
      <Hero isVisible={isVisible} />
      <ReviewShowcase />
      <IndustryBanner />
      <HowItWorks />
      <Features />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}
