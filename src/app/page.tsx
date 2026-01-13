'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRICING_PLANS } from '@/types';

// 20 Realistic Review Examples with AI Responses
const reviewShowcase = [
  {
    id: 1,
    platform: 'google',
    business: 'Bella Italia Restaurant',
    reviewer: 'Sarah M.',
    rating: 5,
    review: "Best Italian food I've had outside of Italy! The carbonara was absolutely perfect and the tiramisu was heavenly.",
    response: "Sarah, you've made our entire kitchen team smile! We're thrilled our carbonara transported you to Italy – our chef insists on using authentic guanciale and pecorino romano. Your kind words about the tiramisu are going straight to Nonna! We can't wait to welcome you back for another taste of Italy. Grazie mille! – Marco, Owner",
    avatar: 'SM',
  },
  {
    id: 2,
    platform: 'yelp',
    business: 'Premier Auto Spa',
    reviewer: 'Mike T.',
    rating: 2,
    review: "Waited 3 hours for a detail that was supposed to take 90 minutes. Car looked okay but not worth the wait.",
    response: "Mike, I sincerely apologize for the extended wait time – that's simply not the experience we strive to deliver. You trusted us with your vehicle and we let you down on timing. I'd love to make this right with a complimentary express detail on your next visit. Please reach out to me directly at manager@premierautospa.com. – James, General Manager",
    avatar: 'MT',
  },
  {
    id: 3,
    platform: 'facebook',
    business: 'Sunshine Dental Care',
    reviewer: 'Emily R.',
    rating: 5,
    review: "Dr. Chen is amazing! Finally found a dentist who doesn't make me anxious. The whole staff is so friendly and patient.",
    response: "Emily, thank you for sharing your experience! Dr. Chen and our entire team are dedicated to creating a comfortable, anxiety-free environment. We believe everyone deserves stress-free dental care, and we're honored you've entrusted us with your smile. See you at your next checkup! – Sunshine Dental Care Team",
    avatar: 'ER',
  },
  {
    id: 4,
    platform: 'tripadvisor',
    business: 'Harbor View Hotel',
    reviewer: 'David L.',
    rating: 5,
    review: "Celebrated our 25th anniversary here. The staff surprised us with champagne and rose petals. Unforgettable!",
    response: "David, congratulations on 25 wonderful years! It was our absolute pleasure to help make your anniversary celebration special. Moments like these are why we do what we do. We've noted your anniversary in our guest records – we hope to help you celebrate many more milestones! – The Harbor View Family",
    avatar: 'DL',
  },
  {
    id: 5,
    platform: 'google',
    business: "Tony's Barber Shop",
    reviewer: 'Chris P.',
    rating: 4,
    review: "Great haircut as always! Only reason for 4 stars is the wait time can be long on weekends.",
    response: "Thanks Chris! Glad you're happy with the cut. You're right about weekends – we've heard you! We're introducing online booking next month to help manage the rush. Pro tip: Tuesday and Wednesday afternoons are usually our quietest times. See you in the chair! – Tony",
    avatar: 'CP',
  },
  {
    id: 6,
    platform: 'yelp',
    business: 'Green Leaf Yoga Studio',
    reviewer: 'Jennifer K.',
    rating: 5,
    review: "The hot yoga classes are incredible! Lost 15 pounds in 3 months and my flexibility has improved so much.",
    response: "Jennifer, what an incredible transformation! 15 pounds and improved flexibility is no small achievement – that's YOUR dedication showing up on the mat every class. Stories like yours inspire our whole community. Keep flowing, keep growing! 🧘‍♀️ – Namaste, The Green Leaf Team",
    avatar: 'JK',
  },
  {
    id: 7,
    platform: 'facebook',
    business: 'Happy Paws Pet Grooming',
    reviewer: 'Lisa H.',
    rating: 1,
    review: "They cut my dog's ear while grooming. Very upset. Dog was traumatized.",
    response: "Lisa, I am deeply sorry about what happened to your fur baby. This is completely unacceptable, and I take full responsibility. I've personally addressed this with our grooming team and enhanced our safety protocols. I would like to cover all veterinary expenses and discuss how we can make this right. Please call me directly at 555-0123. – Amanda, Owner",
    avatar: 'LH',
  },
  {
    id: 8,
    platform: 'google',
    business: 'Quick Fix Phone Repair',
    reviewer: 'Brandon S.',
    rating: 5,
    review: "Fixed my cracked iPhone screen in 20 minutes while I waited. Price was fair and they even cleaned my phone!",
    response: "Brandon, thanks for choosing Quick Fix! We know a cracked screen can ruin your day, so we hustle to get you back up and running ASAP. The complimentary cleaning is our little extra touch. Remember, we also do battery replacements when that time comes! – Quick Fix Crew",
    avatar: 'BS',
  },
  {
    id: 9,
    platform: 'tripadvisor',
    business: 'Mountain Peak Adventures',
    reviewer: 'Rachel & Tom',
    rating: 5,
    review: "Our guide Jake made our first hiking experience absolutely incredible. Felt safe the entire time. Photos were stunning!",
    response: "Rachel & Tom, Jake is going to be thrilled to hear this! He's passionate about introducing newcomers to the trails safely. Those photos from Sunset Ridge are frame-worthy! Now that you've caught the hiking bug, ask about our intermediate trails for your next adventure. Happy trails! – Mountain Peak Team",
    avatar: 'RT',
  },
  {
    id: 10,
    platform: 'yelp',
    business: 'Casa Maria Mexican Grill',
    reviewer: 'Andrew W.',
    rating: 3,
    review: "Food was good but portions seem smaller than before. Prices went up too. Still decent for the area.",
    response: "Andrew, we appreciate your honest feedback. You're right – rising ingredient costs have been challenging, and we've had to make some adjustments. What we won't compromise on is quality and authenticity. We're introducing a new 'Grande' portion option next month for heartier appetites. Hope to see you back! – Maria",
    avatar: 'AW',
  },
  {
    id: 11,
    platform: 'google',
    business: 'Elite Fitness Gym',
    reviewer: 'Nicole F.',
    rating: 5,
    review: "Best gym I've ever joined! Clean equipment, helpful trainers, and 24/7 access is a game changer for my schedule.",
    response: "Nicole, welcome to the Elite family! We're big believers that fitness should fit YOUR life, not the other way around. That 24/7 access is perfect for early birds and night owls alike. Have you tried our new HIIT classes on Tuesday nights? You'd crush it! – Elite Fitness Team",
    avatar: 'NF',
  },
  {
    id: 12,
    platform: 'facebook',
    business: 'Cozy Corner Bookshop',
    reviewer: 'Margaret P.',
    rating: 5,
    review: "A gem! Staff recommendations are always spot-on. The reading nook with tea is just lovely.",
    response: "Margaret, you've discovered our favorite spot! There's nothing better than a good book and a warm cup of tea. Your kind words mean the world to our small team. We've just received some new releases we think you'll love – pop by this weekend! – With gratitude, The Cozy Corner Family",
    avatar: 'MP',
  },
  {
    id: 13,
    platform: 'google',
    business: 'Apex Moving Company',
    reviewer: 'Steven & Julie',
    rating: 5,
    review: "Moved our entire 4-bedroom house in 6 hours. Nothing broken, nothing lost. Team was professional and careful.",
    response: "Steven & Julie, moving day can be so stressful, and we're honored you trusted Apex with your home and memories. Our crew takes pride in treating every item like it's their own grandmother's china! Wishing you countless happy moments in your new home. – The Apex Team",
    avatar: 'SJ',
  },
  {
    id: 14,
    platform: 'yelp',
    business: 'Glamour Nails & Spa',
    reviewer: 'Ashley B.',
    rating: 4,
    review: "Love the gel manicures here! Only wish they had more evening appointment slots available.",
    response: "Ashley, thank you! Our nail techs put their heart into every manicure. Great news – we've heard requests like yours and starting next month, we're extending hours until 8 PM on Thursdays and Fridays! Perfect for post-work pampering. Book early, those slots will go fast! – Glamour Team",
    avatar: 'AB',
  },
  {
    id: 15,
    platform: 'tripadvisor',
    business: 'Oceanside Seafood House',
    reviewer: 'Frank M.',
    rating: 5,
    review: "The lobster bisque is liquid gold. Been coming here for 20 years and it's never disappointed. A local treasure.",
    response: "Frank, 20 years! You've been with us since practically the beginning. Customers like you are why we're still here, still making that bisque with the same recipe and the same love. Next time you're in, the first bowl's on us – you've more than earned it. – Chef Roberto & Family",
    avatar: 'FM',
  },
  {
    id: 16,
    platform: 'google',
    business: 'Bright Smile Orthodontics',
    reviewer: 'Parent of Tyler, age 14',
    rating: 5,
    review: "Dr. Williams is so patient with teenagers! Tyler actually looks forward to his appointments. Braces journey has been smooth.",
    response: "What a wonderful update on Tyler's journey! Teenagers can be tough customers (we get it!), and we're so glad he's having a positive experience. A great attitude makes treatment go smoother – Tyler's clearly got that down. Can't wait to see that final reveal smile! – Dr. Williams & The Bright Smile Team",
    avatar: 'PT',
  },
  {
    id: 17,
    platform: 'facebook',
    business: 'Rustic Barn Wedding Venue',
    reviewer: 'Newlyweds Katie & Jim',
    rating: 5,
    review: "Our wedding day was absolutely PERFECT. The team handled everything flawlessly. Photos look like a fairytale!",
    response: "Katie & Jim, congratulations on your beautiful wedding! Watching you two say 'I do' under those string lights was pure magic. Every detail, from the flowers to the sunset timing, came together perfectly because of your vision and trust in us. Wishing you a lifetime of happiness! 💕 – The Rustic Barn Family",
    avatar: 'KJ',
  },
  {
    id: 18,
    platform: 'yelp',
    business: 'Thompson Plumbing Services',
    reviewer: 'Robert G.',
    rating: 5,
    review: "Emergency call at 11 PM for a burst pipe. Mike arrived in 30 minutes and fixed it fast. True professional.",
    response: "Robert, that's what we're here for! A burst pipe at 11 PM is nobody's idea of a good evening. Mike takes pride in fast response times – he knows water damage waits for no one. Glad we could get you dried out and back to normal quickly. We're always just a call away! – Thompson Plumbing Team",
    avatar: 'RG',
  },
  {
    id: 19,
    platform: 'google',
    business: 'Little Learners Daycare',
    reviewer: 'Amanda & Carlos',
    rating: 5,
    review: "Our daughter Emma has thrived here! She's learned so much and made wonderful friends. Teachers genuinely care.",
    response: "Amanda & Carlos, watching Emma blossom has been such a joy for our whole team! She came out of her shell beautifully, and her curiosity is contagious in the classroom. Those finger-paint masterpieces on our wall? Pure Emma magic. Thank you for entrusting us with your little learner! – Miss Sarah & The Little Learners Family",
    avatar: 'AC',
  },
  {
    id: 20,
    platform: 'tripadvisor',
    business: 'Serenity Day Spa',
    reviewer: 'Michelle D.',
    rating: 5,
    review: "The hot stone massage was heavenly. Left feeling like a new person. Already booked my next appointment!",
    response: "Michelle, we're so glad you floated out of here feeling renewed! Our massage therapists are true artists, and the hot stones work their magic on every tired muscle. Smart move booking ahead – self-care should always be on the calendar! See you soon for more serenity. – With warmth, Serenity Spa",
    avatar: 'MD',
  },
];

const platformColors: Record<string, { bg: string; text: string; glow: string }> = {
  google: { bg: 'bg-blue-500', text: 'text-blue-600', glow: 'platform-glow-google' },
  yelp: { bg: 'bg-red-500', text: 'text-red-600', glow: 'platform-glow-yelp' },
  facebook: { bg: 'bg-indigo-500', text: 'text-indigo-600', glow: 'platform-glow-facebook' },
  tripadvisor: { bg: 'bg-green-500', text: 'text-green-600', glow: 'platform-glow-tripadvisor' },
};

const platformNames: Record<string, string> = {
  google: 'Google',
  yelp: 'Yelp',
  facebook: 'Facebook',
  tripadvisor: 'TripAdvisor',
};

const howItWorksSteps = [
  {
    step: 1,
    title: 'Connect Your Platforms',
    description: 'Link your Google Business, Yelp, Facebook, and TripAdvisor accounts with just a few clicks. We securely sync all your reviews in real-time.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    step: 2,
    title: 'Customize Your Brand Voice',
    description: 'Tell our AI about your business personality, tone preferences, and response style. It learns to sound exactly like you.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    step: 3,
    title: 'Review & Respond',
    description: 'AI generates personalized responses instantly. Review, edit if needed, and post with one click. Average response time: under 2 minutes.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Review rotation
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

  // How it works animation
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(stepInterval);
  }, []);

  // Initial visibility
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const currentReview = reviewShowcase[currentReviewIndex];

  const renderStars = (rating: number) => {
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
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl animate-blob delay-200" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-blob delay-500" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a 
              href="/admin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GraniteReply</span>
            </a>
            <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Pricing</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">How It Works</a>
              <Link href="/assessment" className="text-gray-500 hover:text-primary-600 transition-colors font-medium">Assessment</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Log In
              </Link>
              <Link href="/signup" className="btn-primary text-sm px-5 py-2.5">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Mesh Gradient */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-mesh-gradient">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
              Stop spending hours crafting review responses. GraniteReply AI generates personalized, 
              on-brand replies to your Google, Yelp, Facebook, and TripAdvisor reviews in seconds.
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
            <img 
              src="/florist.png" 
              alt="Florist example" 
              className="rounded-2xl shadow-lg max-w-sm w-full object-cover"
            />
            <img 
              src="/handyman.png" 
              alt="Handyman example" 
              className="rounded-2xl shadow-lg max-w-sm w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Live Review Response Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-primary-50/30 to-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              See AI Responses in Action
            </h2>
            <p className="text-gray-600 text-lg">Real examples of how GraniteReply transforms customer interactions</p>
          </div>

          {/* Review Showcase Card */}
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 via-accent-400/20 to-primary-400/20 blur-3xl scale-95" />
            
            <div className={`relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${platformColors[currentReview.platform].bg} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                      {currentReview.platform === 'google' ? 'G' : currentReview.platform === 'yelp' ? 'Y' : currentReview.platform === 'facebook' ? 'f' : 'T'}
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

              {/* Progress indicators */}
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
                        index === currentReviewIndex % 10
                          ? 'bg-primary-500 w-6'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-2">+10 more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Examples 2 */}
      <section className="py-16 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 animate-gradient bg-[length:200%_auto] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <img 
              src="/dentist.jpg" 
              alt="Dentist example" 
              className="rounded-2xl shadow-2xl max-w-sm w-full object-cover border-4 border-white/20"
            />
            <img 
              src="/restaurant.jpg" 
              alt="Restaurant example" 
              className="rounded-2xl shadow-2xl max-w-sm w-full object-cover border-4 border-white/20"
            />
          </div>
        </div>
      </section>

      {/* How It Works - Animated Steps */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-section-gradient-1">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary-200 via-accent-300 to-primary-200 rounded-full" />
            
            {howItWorksSteps.map((item, index) => (
              <div
                key={item.step}
                className={`relative text-center transition-all duration-500 ${
                  activeStep === index ? 'scale-105' : 'scale-100 opacity-70'
                }`}
              >
                {/* Step number */}
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white font-bold text-xl transition-all duration-500 ${
                  activeStep === index 
                    ? 'bg-gradient-to-br from-primary-500 to-accent-500 shadow-xl shadow-primary-500/30 animate-pulse-glow' 
                    : 'bg-gray-300'
                }`}>
                  {item.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{item.description}</p>
                
                {/* Active indicator */}
                <div className={`mt-4 h-1 w-16 mx-auto rounded-full transition-all duration-500 ${
                  activeStep === index ? 'bg-primary-500 w-24' : 'bg-gray-200'
                }`} />
              </div>
            ))}
          </div>

          {/* Step indicators */}
          <div className="flex justify-center mt-12 space-x-3">
            {[0, 1, 2].map((step) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === step ? 'bg-primary-500 w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Reviews
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for local businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                color: 'from-primary-400 to-primary-600',
                bgColor: 'bg-primary-50',
                title: 'AI-Powered Responses',
                description: 'Generate personalized, human-sounding responses in seconds. Our AI learns your brand voice and tone.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
                color: 'from-green-400 to-green-600',
                bgColor: 'bg-green-50',
                title: 'Multi-Platform Support',
                description: 'Manage reviews from Google, Yelp, Facebook, and TripAdvisor all in one unified dashboard.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
                color: 'from-purple-400 to-purple-600',
                bgColor: 'bg-purple-50',
                title: 'Custom Brand Voice',
                description: 'Train the AI to match your unique personality, tone, and communication style perfectly.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                color: 'from-yellow-400 to-orange-500',
                bgColor: 'bg-yellow-50',
                title: 'Sentiment Analysis',
                description: 'Automatically detect negative reviews and prioritize urgent responses to protect your reputation.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                color: 'from-red-400 to-red-600',
                bgColor: 'bg-red-50',
                title: 'Approval Workflow',
                description: 'Review and edit AI responses before posting. Full control with one-click approval.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
                color: 'from-indigo-400 to-indigo-600',
                bgColor: 'bg-indigo-50',
                title: 'Analytics & Reports',
                description: 'Track response rates, sentiment trends, and review volume with detailed analytics.',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="card card-hover group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 feature-icon`}>
                  <svg className={`w-7 h-7 bg-gradient-to-br ${feature.color} bg-clip-text`} fill="none" stroke="url(#gradient)" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-section-gradient-2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Annual contract with setup deposit applied to your first year
            </p>
            {/* First Month Free Banner */}
            <div className="mt-8 inline-flex items-center px-8 py-4 bg-green-500 rounded-2xl shadow-lg shadow-green-500/30 animate-bounce-subtle">
              <span className="text-white text-xl font-bold">🎉 First Month FREE on All Plans!</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan, index) => {
              const multiLangPrice = plan.id === 'starter' ? 49 : plan.id === 'growth' ? 99 : 299;
              return (
              <div
                key={plan.id}
                className={`card card-hover relative ${
                  plan.popular 
                    ? 'border-2 border-primary-500 shadow-xl shadow-primary-500/10' 
                    : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">${plan.monthlyPrice}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-6 px-3 py-1.5 bg-gray-100 rounded-full inline-block">
                    ${plan.setupDeposit.toLocaleString()} setup fee
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{plan.locations === 1 ? '1 location' : `Up to ${plan.locations} locations`}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{plan.reviewsPerMonth} reviews/month</span>
                  </li>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                {/* Multi-Language Add-on */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">🌍</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Multi-Language</p>
                        <p className="text-xs text-gray-500">Spanish & French responses</p>
                      </div>
                    </div>
                    <span className="text-green-700 font-bold">+${multiLangPrice}/mo</span>
                  </div>
                </div>
                <Link
                  href={`/signup?plan=${plan.id}`}
                  className={`block text-center py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Start Free Trial
                </Link>
              </div>
              );
            })}
          </div>

          <p className="text-center text-gray-500 mt-8">
            All plans include a 14-day free trial. Setup fee is applied to your first year of service.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-cta-gradient relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full" />
          <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white/20 rounded-full" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Review Management?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join 500+ businesses saving hours every week with AI-powered responses
          </p>
          <Link href="/signup" className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 group">
            Start Your Free Trial
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-6 text-white/70 text-sm">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold text-white">GraniteReply</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
            © {new Date().getFullYear()} GraniteReply AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
