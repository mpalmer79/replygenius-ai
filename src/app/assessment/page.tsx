'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AssessmentData {
  // Business Info
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  businessType: string;
  locationCount: string;
  
  // Current State
  monthlyReviews: string;
  platforms: string[];
  currentProcess: string;
  responseTime: string;
  responseRate: string;
  
  // Pain Points
  painPoints: string[];
  recentIssues: string;
  
  // Decision Criteria
  decisionMaker: string;
  timeline: string;
  budget: string;
  triedOthers: string;
  
  // Goals
  primaryGoal: string;
  successMetric: string;
  
  // Notes
  notes: string;
}

const initialData: AssessmentData = {
  businessName: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  businessType: '',
  locationCount: '',
  monthlyReviews: '',
  platforms: [],
  currentProcess: '',
  responseTime: '',
  responseRate: '',
  painPoints: [],
  recentIssues: '',
  decisionMaker: '',
  timeline: '',
  budget: '',
  triedOthers: '',
  primaryGoal: '',
  successMetric: '',
  notes: '',
};

const businessTypes = [
  'Restaurant / Food Service',
  'Salon / Spa / Beauty',
  'Dental / Medical Practice',
  'Auto Dealership / Service',
  'Hotel / Hospitality',
  'Retail Store',
  'Home Services (Plumber, HVAC, etc.)',
  'Legal / Professional Services',
  'Fitness / Gym',
  'Other',
];

const platformOptions = [
  { id: 'google', label: 'Google Business Profile' },
  { id: 'yelp', label: 'Yelp' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'tripadvisor', label: 'TripAdvisor' },
  { id: 'healthgrades', label: 'Healthgrades' },
  { id: 'cars', label: 'Cars.com / DealerRater' },
  { id: 'other', label: 'Other' },
];

const painPointOptions = [
  { id: 'time', label: 'Not enough time to respond to reviews' },
  { id: 'consistency', label: 'Inconsistent response quality or tone' },
  { id: 'negative', label: 'Struggling to handle negative reviews' },
  { id: 'volume', label: 'Too many reviews to keep up with' },
  { id: 'tracking', label: 'Hard to track reviews across platforms' },
  { id: 'staff', label: 'Staff turnover affects response quality' },
  { id: 'reputation', label: 'Overall reputation management concerns' },
  { id: 'competitive', label: 'Competitors responding faster/better' },
];

export default function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AssessmentData>(initialData);
  const [showResults, setShowResults] = useState(false);

  const totalSteps = 5;

  const updateField = (field: keyof AssessmentData, value: string | string[]) => {
    setData({ ...data, [field]: value });
  };

  const toggleArrayField = (field: 'platforms' | 'painPoints', value: string) => {
    const current = data[field];
    if (current.includes(value)) {
      updateField(field, current.filter((v) => v !== value));
    } else {
      updateField(field, [...current, value]);
    }
  };

  const calculateScore = (): { score: number; level: string; color: string } => {
    let score = 0;

    // Review volume (0-25 points)
    if (data.monthlyReviews === '50+') score += 25;
    else if (data.monthlyReviews === '20-50') score += 20;
    else if (data.monthlyReviews === '10-20') score += 15;
    else if (data.monthlyReviews === '5-10') score += 10;
    else if (data.monthlyReviews === '1-5') score += 5;

    // Multi-location (0-15 points)
    if (data.locationCount === '10+') score += 15;
    else if (data.locationCount === '4-10') score += 12;
    else if (data.locationCount === '2-3') score += 8;
    else if (data.locationCount === '1') score += 5;

    // Platform presence (0-15 points)
    score += Math.min(data.platforms.length * 4, 15);

    // Pain points (0-20 points)
    score += Math.min(data.painPoints.length * 5, 20);

    // Decision maker (0-10 points)
    if (data.decisionMaker === 'yes') score += 10;
    else if (data.decisionMaker === 'partial') score += 5;

    // Timeline (0-10 points)
    if (data.timeline === 'immediate') score += 10;
    else if (data.timeline === '30days') score += 8;
    else if (data.timeline === '90days') score += 5;

    // Budget alignment (0-5 points)
    if (data.budget === 'yes') score += 5;
    else if (data.budget === 'maybe') score += 3;

    // Determine level
    let level: string;
    let color: string;
    if (score >= 75) {
      level = 'Hot Lead';
      color = 'text-green-600 bg-green-100';
    } else if (score >= 50) {
      level = 'Qualified';
      color = 'text-blue-600 bg-blue-100';
    } else if (score >= 30) {
      level = 'Nurture';
      color = 'text-yellow-600 bg-yellow-100';
    } else {
      level = 'Low Priority';
      color = 'text-gray-600 bg-gray-100';
    }

    return { score, level, color };
  };

  const getRecommendedPlan = (): string => {
    const locations = data.locationCount;
    const reviews = data.monthlyReviews;

    if (locations === '10+' || reviews === '50+') return 'Enterprise';
    if (locations === '4-10' || locations === '2-3' || reviews === '20-50') return 'Growth';
    return 'Starter';
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setData(initialData);
    setStep(1);
    setShowResults(false);
  };

  if (showResults) {
    const { score, level, color } = calculateScore();
    const recommendedPlan = getRecommendedPlan();

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GraniteReply</span>
            </div>
            <span className="text-sm text-gray-500">Sales Assessment</span>
          </div>

          {/* Results Card */}
          <div className="card mb-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete</h1>
              <p className="text-gray-600">{data.businessName || 'Prospect'}</p>
            </div>

            {/* Score Display */}
            <div className="flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-900 mb-2">{score}</div>
                <div className="text-gray-500 mb-3">out of 100</div>
                <span className={`inline-flex px-4 py-2 rounded-full text-lg font-semibold ${color}`}>
                  {level}
                </span>
              </div>
            </div>

            {/* Recommended Plan */}
            <div className="bg-primary-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-primary-900 mb-2">Recommended Plan</h3>
              <div className="text-3xl font-bold text-primary-600 mb-2">{recommendedPlan}</div>
              <p className="text-primary-700 text-sm">
                Based on {data.locationCount || '1'} location(s) and {data.monthlyReviews || 'unknown'} monthly reviews
              </p>
            </div>

            {/* Summary Sections */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Business</span>
                    <span className="text-gray-900">{data.businessName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact</span>
                    <span className="text-gray-900">{data.contactName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-900">{data.contactEmail || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-gray-900">{data.contactPhone || '-'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Business Profile</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="text-gray-900">{data.businessType || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Locations</span>
                    <span className="text-gray-900">{data.locationCount || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monthly Reviews</span>
                    <span className="text-gray-900">{data.monthlyReviews || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Platforms</span>
                    <span className="text-gray-900">{data.platforms.length > 0 ? data.platforms.join(', ') : '-'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Current Situation</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Process</span>
                    <span className="text-gray-900">{data.currentProcess || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Time</span>
                    <span className="text-gray-900">{data.responseTime || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Rate</span>
                    <span className="text-gray-900">{data.responseRate || '-'}</span>
                  </div>
                </div>
              </div>

              {data.painPoints.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Pain Points Identified</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.painPoints.map((point) => {
                      const option = painPointOptions.find((p) => p.id === point);
                      return (
                        <span key={point} className="badge bg-red-100 text-red-800">
                          {option?.label || point}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Buying Signals</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Decision Maker</span>
                    <span className={`font-medium ${data.decisionMaker === 'yes' ? 'text-green-600' : 'text-gray-900'}`}>
                      {data.decisionMaker === 'yes' ? 'Yes' : data.decisionMaker === 'partial' ? 'Partial' : data.decisionMaker === 'no' ? 'No' : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Timeline</span>
                    <span className={`font-medium ${data.timeline === 'immediate' ? 'text-green-600' : 'text-gray-900'}`}>
                      {data.timeline === 'immediate' ? 'Immediate' : data.timeline === '30days' ? 'Within 30 days' : data.timeline === '90days' ? 'Within 90 days' : data.timeline === 'exploring' ? 'Just exploring' : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Budget Aligned</span>
                    <span className={`font-medium ${data.budget === 'yes' ? 'text-green-600' : 'text-gray-900'}`}>
                      {data.budget === 'yes' ? 'Yes' : data.budget === 'maybe' ? 'Possibly' : data.budget === 'no' ? 'No' : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {data.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Additional Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                    {data.notes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button onClick={handleReset} className="btn-secondary">
              Start New Assessment
            </button>
            <button
              onClick={() => window.print()}
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">GraniteReply</span>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Exit
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="card">
          {/* Step 1: Business Information */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Business Information</h2>
              <p className="text-gray-500 mb-6">Let&apos;s start with some basics about the business</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={data.businessName}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    className="input-field"
                    placeholder="Acme Restaurant"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={data.contactName}
                      onChange={(e) => updateField('contactName', e.target.value)}
                      className="input-field"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={data.contactPhone}
                      onChange={(e) => updateField('contactPhone', e.target.value)}
                      className="input-field"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={data.contactEmail}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    className="input-field"
                    placeholder="john@acme.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                  <select
                    value={data.businessType}
                    onChange={(e) => updateField('businessType', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select business type...</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Locations</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['1', '2-3', '4-10', '10+'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('locationCount', option)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          data.locationCount === option
                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Review Presence */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Review Presence</h2>
              <p className="text-gray-500 mb-6">Tell me about your current review landscape</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Which platforms do you receive reviews on?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {platformOptions.map((platform) => (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => toggleArrayField('platforms', platform.id)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors ${
                          data.platforms.includes(platform.id)
                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {platform.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Approximately how many reviews do you receive per month (across all platforms)?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: '1-5', label: '1-5' },
                      { value: '5-10', label: '5-10' },
                      { value: '10-20', label: '10-20' },
                      { value: '20-50', label: '20-50' },
                      { value: '50+', label: '50+' },
                      { value: 'unsure', label: 'Not sure' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('monthlyReviews', option.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          data.monthlyReviews === option.value
                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What&apos;s your current average rating across platforms?
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      className="flex-1"
                    />
                    <span className="text-yellow-500 text-lg">★★★★☆</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Current Process & Pain Points */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Current Process</h2>
              <p className="text-gray-500 mb-6">Help me understand how you manage reviews today</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Who currently responds to your reviews?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'owner', label: 'Owner / Manager personally' },
                      { value: 'staff', label: 'Designated staff member(s)' },
                      { value: 'agency', label: 'Marketing agency' },
                      { value: 'nobody', label: 'Nobody - reviews go unanswered' },
                      { value: 'mixed', label: 'Inconsistent / varies' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('currentProcess', option.value)}
                        className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors ${
                          data.currentProcess === option.value
                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    On average, how long does it take to respond to a review?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'sameday', label: 'Same day' },
                      { value: '1-2days', label: '1-2 days' },
                      { value: '3-7days', label: '3-7 days' },
                      { value: 'week+', label: 'More than a week' },
                      { value: 'never', label: 'Often never' },
                      { value: 'varies', label: 'Varies widely' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('responseTime', option.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          data.responseTime === option.value
                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What percentage of reviews receive a response?
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {['0-25%', '25-50%', '50-75%', '75-100%'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('responseRate', option)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          data.responseRate === option
                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What challenges do you face with review management? (Select all that apply)
                  </label>
                  <div className="space-y-2">
                    {painPointOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleArrayField('painPoints', option.id)}
                        className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors ${
                          data.painPoints.includes(option.id)
                            ? 'bg-red-50 text-red-700 border-2 border-red-300'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 4: Buying Signals */}
          {step === 4 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Decision Criteria</h2>
              <p className="text-gray-500 mb-6">Help me understand your decision-making process</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Are you the decision maker for this type of purchase?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'yes', label: 'Yes, I can decide' },
                      { value: 'partial', label: 'Part of the decision' },
                      { value: 'no', label: 'No, someone else' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('decisionMaker', option.value)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          data.decisionMaker === option.value
                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What&apos;s your timeline for implementing a solution?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'immediate', label: 'Immediately / ASAP' },
                      { value: '30days', label: 'Within 30 days' },
                      { value: '90days', label: 'Within 90 days' },
                      { value: 'exploring', label: 'Just exploring' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('timeline', option.value)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          data.timeline === option.value
                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Our plans start at $200/month. Does this fit within your budget expectations?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'yes', label: 'Yes, that works' },
                      { value: 'maybe', label: 'Possibly' },
                      { value: 'no', label: 'Too high' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('budget', option.value)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          data.budget === option.value
                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Have you tried any other review management solutions?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                      { value: 'considering', label: 'Considering others' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('triedOthers', option.value)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          data.triedOthers === option.value
                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 5: Goals & Wrap-up */}
          {step === 5 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Goals & Notes</h2>
              <p className="text-gray-500 mb-6">Final questions to understand their priorities</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What&apos;s the primary goal you&apos;d like to achieve?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'time', label: 'Save time on review responses' },
                      { value: 'consistency', label: 'More consistent brand voice' },
                      { value: 'negative', label: 'Better handle negative reviews' },
                      { value: 'rating', label: 'Improve overall rating' },
                      { value: 'engagement', label: 'Increase customer engagement' },
                      { value: 'reputation', label: 'Protect/improve reputation' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('primaryGoal', option.value)}
                        className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors ${
                          data.primaryGoal === option.value
                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How would you measure success?
                  </label>
                  <input
                    type="text"
                    value={data.successMetric}
                    onChange={(e) => updateField('successMetric', e.target.value)}
                    className="input-field"
                    placeholder="e.g., 100% response rate, improved rating, time saved..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={data.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Any other relevant information, observations, or follow-up items..."
                  />
                </div>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                className="btn-primary"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn-primary"
              >
                Complete Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
