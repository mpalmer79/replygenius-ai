'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PRICING_PLANS } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPlan = searchParams.get('plan') || 'growth';

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    businessName: '',
    phone: '',
    website: '',
    selectedPlan: preselectedPlan,
  });

  const selectedPlanDetails = PRICING_PLANS.find((p) => p.id === formData.selectedPlan);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);
    
    // Mock signup - replace with Supabase auth
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push('/dashboard');
    } catch {
      console.error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">GraniteReply</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Start your free trial
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  s <= step
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 mx-2 rounded ${
                    s < step ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white py-8 px-4 shadow-sm rounded-xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-sm text-gray-500">Minimum 8 characters</p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Acme Restaurant"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website (optional)
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://www.example.com"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Plan</h3>
                <div className="space-y-3">
                  {PRICING_PLANS.map((plan) => (
                    <label
                      key={plan.id}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.selectedPlan === plan.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedPlan"
                        value={plan.id}
                        checked={formData.selectedPlan === plan.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-900">{plan.name}</span>
                          {plan.popular && (
                            <span className="ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {plan.locations} location{plan.locations > 1 ? 's' : ''} • {plan.reviewsPerMonth} reviews/mo
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">${plan.monthlyPrice}/mo</div>
                        <div className="text-xs text-gray-500">${plan.setupDeposit.toLocaleString()} setup</div>
                      </div>
                    </label>
                  ))}
                </div>

                {selectedPlanDetails && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan</span>
                        <span className="text-gray-900">{selectedPlanDetails.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly</span>
                        <span className="text-gray-900">${selectedPlanDetails.monthlyPrice}/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Setup Deposit</span>
                        <span className="text-gray-900">${selectedPlanDetails.setupDeposit.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between font-medium">
                          <span className="text-gray-900">Due Today</span>
                          <span className="text-gray-900">$0.00</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">14-day free trial, no credit card required</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex items-center space-x-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 btn-secondary py-3"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary py-3"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : step < 3 ? (
                  'Continue'
                ) : (
                  'Start Free Trial'
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
