import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-cta-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full" />
        <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/20 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white/20 rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Ready to Transform Your Review Management?</h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Join 500+ businesses saving hours every week with AI-powered responses</p>
        <Link
          href="/signup"
          className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
        >
          Start Your Free Trial
          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        <p className="mt-6 text-white/70 text-sm">No credit card required • Cancel anytime</p>
      </div>
    </section>
  );
}

