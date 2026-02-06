
import Link from 'next/link';
import { PRICING_PLANS } from '@/types';

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-section-gradient-2">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Annual contract with setup deposit applied to your first year</p>
          <div className="mt-8 inline-flex items-center px-8 py-4 bg-green-500 rounded-2xl shadow-lg shadow-green-500/30 animate-bounce-subtle">
            <span className="text-white text-xl font-bold">First Month FREE on All Plans!</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan, index) => {
            const multiLangPrice = plan.id === 'starter' ? 49 : plan.id === 'growth' ? 99 : 299;
            return (
              <div
                key={plan.id}
                className={`card card-hover relative ${plan.popular ? 'border-2 border-primary-500 shadow-xl shadow-primary-500/10' : ''}`}
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
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">{plan.locations === 1 ? '1 location' : `Up to ${plan.locations} locations`}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">{plan.reviewsPerMonth} reviews/month</span>
                  </li>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

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

        <p className="text-center text-gray-500 mt-8">All plans include a 14-day free trial. Setup fee is applied to your first year of service.</p>
      </div>
    </section>
  );
}
