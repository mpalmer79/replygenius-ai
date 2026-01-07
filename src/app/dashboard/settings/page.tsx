'use client';

import { useState } from 'react';
import type { ToneType, ResponseLength } from '@/types';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResponse, setTestResponse] = useState('');
  const [settings, setSettings] = useState({
    tone: 'friendly' as ToneType,
    response_length: 'medium' as ResponseLength,
    personality_description: 'We are a family-owned Italian restaurant with a passion for authentic cuisine and warm hospitality. We treat every guest like family.',
    include_owner_signature: true,
    owner_name: 'Maria',
    owner_title: 'Owner',
    always_apologize_negative: true,
    offer_resolution_negative: true,
    include_call_to_action: true,
    call_to_action_text: 'We hope to welcome you back soon!',
    custom_instructions: '',
  });

  const handleChange = (field: string, value: string | boolean) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Mock save - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleTestGeneration = async () => {
    setIsTesting(true);
    // Mock test generation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTestResponse(
      `Thank you so much for your wonderful review! We're absolutely thrilled to hear you enjoyed your dining experience with us. Our team works hard to create memorable moments for every guest, and it means the world to know we succeeded. ${settings.include_call_to_action ? settings.call_to_action_text : ''}\n\n${settings.include_owner_signature ? `- ${settings.owner_name}${settings.owner_title ? `, ${settings.owner_title}` : ''}` : ''}`
    );
    setIsTesting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">Configure your brand voice and response preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Brand Voice */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Voice</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['professional', 'friendly', 'casual', 'formal'] as ToneType[]).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => handleChange('tone', tone)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        settings.tone === tone
                          ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                          : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Length</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['short', 'medium', 'detailed'] as ResponseLength[]).map((length) => (
                    <button
                      key={length}
                      onClick={() => handleChange('response_length', length)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        settings.response_length === length
                          ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                          : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personality Description
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Describe your business personality and what makes you unique
                </p>
                <textarea
                  value={settings.personality_description}
                  onChange={(e) => handleChange('personality_description', e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="We are a family-owned business that..."
                />
              </div>
            </div>
          </div>

          {/* Signature Settings */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Signature</h2>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.include_owner_signature}
                  onChange={(e) => handleChange('include_owner_signature', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Include owner/manager signature</span>
              </label>

              {settings.include_owner_signature && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={settings.owner_name}
                      onChange={(e) => handleChange('owner_name', e.target.value)}
                      className="input-field"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={settings.owner_title}
                      onChange={(e) => handleChange('owner_title', e.target.value)}
                      className="input-field"
                      placeholder="Owner"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Response Behavior */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Response Behavior</h2>
            
            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={settings.always_apologize_negative}
                  onChange={(e) => handleChange('always_apologize_negative', e.target.checked)}
                  className="h-4 w-4 mt-0.5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div className="ml-2">
                  <span className="text-gray-700">Always apologize in negative reviews</span>
                  <p className="text-sm text-gray-500">Include a sincere apology when responding to 1-2 star reviews</p>
                </div>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={settings.offer_resolution_negative}
                  onChange={(e) => handleChange('offer_resolution_negative', e.target.checked)}
                  className="h-4 w-4 mt-0.5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div className="ml-2">
                  <span className="text-gray-700">Offer resolution for negative reviews</span>
                  <p className="text-sm text-gray-500">Include contact information and offer to make things right</p>
                </div>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={settings.include_call_to_action}
                  onChange={(e) => handleChange('include_call_to_action', e.target.checked)}
                  className="h-4 w-4 mt-0.5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div className="ml-2">
                  <span className="text-gray-700">Include call-to-action</span>
                  <p className="text-sm text-gray-500">End responses with an invitation to return</p>
                </div>
              </label>

              {settings.include_call_to_action && (
                <div className="pl-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Call-to-action text
                  </label>
                  <input
                    type="text"
                    value={settings.call_to_action_text}
                    onChange={(e) => handleChange('call_to_action_text', e.target.value)}
                    className="input-field"
                    placeholder="We hope to see you again soon!"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Custom Instructions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom Instructions</h2>
            <p className="text-sm text-gray-500 mb-3">
              Add any specific instructions for the AI to follow when generating responses
            </p>
            <textarea
              value={settings.custom_instructions}
              onChange={(e) => handleChange('custom_instructions', e.target.value)}
              rows={4}
              className="input-field resize-none"
              placeholder="E.g., Always mention our weekend brunch special, Never discuss competitor restaurants..."
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={isLoading} className="btn-primary">
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="card lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
            <p className="text-sm text-gray-500 mb-4">
              Test how your AI will respond with current settings
            </p>

            <div className="p-4 bg-gray-50 rounded-xl mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">Sample Review</span>
                <span className="text-yellow-500 text-sm">★★★★★</span>
              </div>
              <p className="text-sm text-gray-600">
                &quot;Had a wonderful dinner last night! The pasta was delicious and our server was so friendly. Will definitely be back!&quot;
              </p>
            </div>

            <button
              onClick={handleTestGeneration}
              disabled={isTesting}
              className="w-full btn-secondary mb-4"
            >
              {isTesting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Test Generation
                </>
              )}
            </button>

            {testResponse && (
              <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-medium text-primary-700 text-sm">AI Response</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line">{testResponse}</p>
              </div>
            )}

            {/* Current Settings Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Current Settings</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Tone</dt>
                  <dd className="text-gray-900 capitalize">{settings.tone}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Length</dt>
                  <dd className="text-gray-900 capitalize">{settings.response_length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Signature</dt>
                  <dd className="text-gray-900">
                    {settings.include_owner_signature ? `${settings.owner_name}, ${settings.owner_title}` : 'None'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Apologize</dt>
                  <dd className="text-gray-900">{settings.always_apologize_negative ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Offer Resolution</dt>
                  <dd className="text-gray-900">{settings.offer_resolution_negative ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
