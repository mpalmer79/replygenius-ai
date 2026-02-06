'use client';

import { useState, useEffect, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────
interface DemoReview {
  id: string;
  platform: 'google' | 'yelp' | 'facebook' | 'tripadvisor';
  reviewer: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  status: 'pending' | 'draft' | 'posted';
  aiResponse?: string;
  businessName: string;
}

// ── Demo Data ──────────────────────────────────────────────────
const demoReviews: DemoReview[] = [
  {
    id: '1', platform: 'google', reviewer: 'Sarah Mitchell', avatar: 'SM',
    rating: 5, businessName: 'Bella Italia Restaurant',
    text: "Best Italian food I've had outside of Italy! The carbonara was absolutely perfect and the tiramisu was heavenly. Our waiter Marco was so attentive.",
    date: '2 hours ago', sentiment: 'positive', status: 'pending',
  },
  {
    id: '2', platform: 'yelp', reviewer: 'Mike Torres', avatar: 'MT',
    rating: 2, businessName: 'Bella Italia Restaurant',
    text: 'Waited 3 hours for a detail that was supposed to take 90 minutes. Car looked okay but not worth the wait. Manager was dismissive.',
    date: '5 hours ago', sentiment: 'negative', status: 'pending',
  },
  {
    id: '3', platform: 'facebook', reviewer: 'Emily Chen', avatar: 'EC',
    rating: 4, businessName: 'Bella Italia Restaurant',
    text: 'Great atmosphere and friendly staff! Food was delicious but portions could be a bit larger for the price. The pasta was incredible though!',
    date: '1 day ago', sentiment: 'positive', status: 'draft',
    aiResponse: "Emily, thank you for the wonderful feedback! We're thrilled you enjoyed our atmosphere and pasta. We hear you on portions — we're always refining to deliver the best value. Hope to welcome you back soon!",
  },
  {
    id: '4', platform: 'tripadvisor', reviewer: 'David Park', avatar: 'DP',
    rating: 5, businessName: 'Bella Italia Restaurant',
    text: 'Celebrated our 25th anniversary here. The staff surprised us with champagne and rose petals. Absolutely unforgettable evening!',
    date: '2 days ago', sentiment: 'positive', status: 'posted',
    aiResponse: "David, congratulations on 25 beautiful years! It was our absolute pleasure to help make your celebration magical. We've noted your anniversary in our guest book — hope to see you for many more milestones! 🥂",
  },
  {
    id: '5', platform: 'google', reviewer: 'Lisa Huang', avatar: 'LH',
    rating: 1, businessName: 'Bella Italia Restaurant',
    text: 'Found a hair in my soup. Complained to the waiter and he just shrugged. Will never come back. Disgusting experience.',
    date: '3 hours ago', sentiment: 'negative', status: 'pending',
  },
  {
    id: '6', platform: 'yelp', reviewer: 'James Wilson', avatar: 'JW',
    rating: 5, businessName: 'Bella Italia Restaurant',
    text: "Hidden gem! The chef's special risotto was out of this world. Great wine selection too. Perfect date night spot.",
    date: '6 hours ago', sentiment: 'positive', status: 'pending',
  },
  {
    id: '7', platform: 'facebook', reviewer: 'Ana Gonzalez', avatar: 'AG',
    rating: 3, businessName: 'Bella Italia Restaurant',
    text: 'Food was decent but nothing extraordinary. Service was slow during peak hours. Nice interior design though.',
    date: '1 day ago', sentiment: 'neutral', status: 'pending',
  },
  {
    id: '8', platform: 'google', reviewer: 'Robert Kim', avatar: 'RK',
    rating: 5, businessName: 'Bella Italia Restaurant',
    text: 'Brought my family for Sunday brunch — everyone loved it! Kids menu was actually thoughtful, not just chicken nuggets. Bravo!',
    date: '3 days ago', sentiment: 'positive', status: 'posted',
    aiResponse: "Robert, it means the world to us that your whole family enjoyed brunch! We put a lot of love into our kids menu because little diners deserve great food too. See you next Sunday! — Chef Marco & Team",
  },
];

const aiResponses: Record<string, string> = {
  '1': "Sarah, you've made our entire kitchen team smile! We're thrilled the carbonara transported you to Italy — our chef insists on using authentic guanciale and pecorino romano. Marco sends his thanks! Can't wait to welcome you back. Grazie mille! — Bella Italia Team",
  '2': "Mike, I sincerely apologize for the extended wait time — that's not the standard we hold ourselves to. I'd love to make this right with a complimentary meal on your next visit. Please reach out to me directly at manager@bellaitalia.com. — James, General Manager",
  '5': "Lisa, I am deeply sorry about your experience. This is completely unacceptable. I've personally addressed this with our kitchen team and reinforced our hygiene protocols. I would like to invite you back as our guest — please contact me directly at owner@bellaitalia.com. — Marco, Owner",
  '6': "James, so glad you discovered us! The chef will be thrilled to hear about the risotto — it's his grandmother's recipe. We've just added some new wines from Tuscany we think you'd love. See you on your next date night! — Bella Italia Team",
  '7': "Ana, thank you for the honest feedback. We know peak hours can test our service, and we're actively hiring more staff to improve wait times. We'd love a second chance to impress you — next visit, mention this review for a complimentary appetizer. — Bella Italia Team",
};

// ── Platform Helpers ───────────────────────────────────────────
const platformConfig = {
  google:      { label: 'Google',      color: 'bg-blue-500',   text: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   icon: 'G' },
  yelp:        { label: 'Yelp',        color: 'bg-red-500',    text: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    icon: 'Y' },
  facebook:    { label: 'Facebook',    color: 'bg-indigo-500', text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'f' },
  tripadvisor: { label: 'TripAdvisor', color: 'bg-green-500',  text: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  icon: 'T' },
};

// ── Component ──────────────────────────────────────────────────
export default function DemoDashboard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<DemoReview | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [localReviews, setLocalReviews] = useState<DemoReview[]>(demoReviews);
  const [typedResponse, setTypedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showToast, setShowToast] = useState('');

  // Escape key handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Typing animation
  const typeResponse = useCallback((fullText: string) => {
    setIsTyping(true);
    setTypedResponse('');
    let i = 0;
    const interval = setInterval(() => {
      setTypedResponse(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 12);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateResponse = (review: DemoReview) => {
    const response = aiResponses[review.id];
    if (!response) return;
    setGeneratingId(review.id);
    setSelectedReview(review);
    setTypedResponse('');

    setTimeout(() => {
      setGeneratingId(null);
      typeResponse(response);
    }, 1500);
  };

  const handleApproveResponse = (reviewId: string) => {
    const response = aiResponses[reviewId] || typedResponse;
    setLocalReviews(prev => prev.map(r =>
      r.id === reviewId ? { ...r, status: 'posted' as const, aiResponse: response } : r
    ));
    setSelectedReview(null);
    setTypedResponse('');
    setShowToast('Response posted successfully!');
    setTimeout(() => setShowToast(''), 3000);
  };

  const filtered = localReviews.filter(r => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'urgent') return r.sentiment === 'negative' && r.status === 'pending';
    return r.platform === activeFilter;
  });

  const stats = {
    total: localReviews.length,
    pending: localReviews.filter(r => r.status === 'pending').length,
    avgRating: (localReviews.reduce((a, r) => a + r.rating, 0) / localReviews.length).toFixed(1),
    responseRate: Math.round((localReviews.filter(r => r.status === 'posted').length / localReviews.length) * 100),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-[95vw] max-w-7xl h-[90vh] bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-[modalSlideUp_0.4s_ease-out]">

        {/* ── Top Bar ─────────────────────────────────── */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">GraniteReply Dashboard</h2>
              <p className="text-[11px] text-gray-500">Bella Italia Restaurant — Interactive Demo</p>
            </div>
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-full">Demo Mode</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close demo">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Main Content ────────────────────────────── */}
        <div className="flex-1 overflow-hidden flex">

          {/* ── Sidebar ────────────────────────────────── */}
          <div className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-200 flex-shrink-0">
            <nav className="flex-1 p-3 space-y-0.5">
              {[
                { id: 'all', label: 'All Reviews', count: stats.total, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                { id: 'urgent', label: 'Urgent', count: localReviews.filter(r => r.sentiment === 'negative' && r.status === 'pending').length, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', urgent: true },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveFilter(item.id); setSelectedReview(null); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeFilter === item.id ? 'bg-sky-50 text-sky-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className={`w-4 h-4 ${item.urgent && activeFilter !== item.id ? 'text-red-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    item.urgent && item.count > 0 ? 'bg-red-100 text-red-700 font-bold' : 'bg-gray-100 text-gray-500'
                  }`}>{item.count}</span>
                </button>
              ))}

              <div className="pt-3 pb-1 px-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Platforms</p>
              </div>
              {(['google', 'yelp', 'facebook', 'tripadvisor'] as const).map(p => {
                const cfg = platformConfig[p];
                const count = localReviews.filter(r => r.platform === p).length;
                return (
                  <button
                    key={p}
                    onClick={() => { setActiveFilter(p); setSelectedReview(null); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeFilter === p ? `${cfg.bg} ${cfg.text} font-medium` : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-5 h-5 ${cfg.color} rounded flex items-center justify-center text-white text-[10px] font-bold`}>{cfg.icon}</div>
                      <span>{cfg.label}</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{count}</span>
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Stats */}
            <div className="p-3 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">{stats.avgRating}</div>
                  <div className="text-[10px] text-gray-500">Avg Rating</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">{stats.responseRate}%</div>
                  <div className="text-[10px] text-gray-500">Response Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Review List + Detail ──────────────────── */}
          <div className="flex-1 flex overflow-hidden">

            {/* Review List */}
            <div className={`${selectedReview ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[380px] md:min-w-[380px] border-r border-gray-200 bg-white overflow-hidden`}>
              {/* Stats Bar */}
              <div className="flex-shrink-0 p-4 border-b border-gray-100 grid grid-cols-4 gap-2">
                {[
                  { label: 'Total', value: stats.total, color: 'text-gray-900' },
                  { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
                  { label: 'Rating', value: stats.avgRating, color: 'text-yellow-600' },
                  { label: 'Rate', value: `${stats.responseRate}%`, color: 'text-green-600' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Mobile filter pills */}
              <div className="flex-shrink-0 lg:hidden px-4 py-2 border-b border-gray-100 flex gap-2 overflow-x-auto">
                {['all', 'urgent', 'google', 'yelp', 'facebook', 'tripadvisor'].map(f => (
                  <button
                    key={f}
                    onClick={() => { setActiveFilter(f); setSelectedReview(null); }}
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeFilter === f ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'urgent' ? '🔴 Urgent' : platformConfig[f as keyof typeof platformConfig]?.label || f}
                  </button>
                ))}
              </div>

              {/* Review Cards */}
              <div className="flex-1 overflow-y-auto">
                {filtered.map(review => {
                  const cfg = platformConfig[review.platform];
                  const isSelected = selectedReview?.id === review.id;
                  return (
                    <button
                      key={review.id}
                      onClick={() => { setSelectedReview(review); setTypedResponse(''); }}
                      className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors ${
                        isSelected ? 'bg-sky-50 border-l-2 border-l-sky-500' : 'hover:bg-gray-50 border-l-2 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div className={`w-5 h-5 ${cfg.color} rounded flex items-center justify-center text-white text-[9px] font-bold`}>{cfg.icon}</div>
                          <span className="text-sm font-medium text-gray-900">{review.reviewer}</span>
                          {review.sentiment === 'negative' && review.status === 'pending' && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">URGENT</span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{review.text}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          review.status === 'posted' ? 'bg-green-100 text-green-700' :
                          review.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {review.status === 'posted' ? '✓ Posted' : review.status === 'draft' ? 'Draft ready' : 'Awaiting response'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Detail Panel ─────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {selectedReview ? (
                <div className="p-6 max-w-2xl mx-auto">
                  {/* Back button on mobile */}
                  <button onClick={() => setSelectedReview(null)} className="md:hidden flex items-center text-sm text-gray-500 mb-4 hover:text-gray-700">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to reviews
                  </button>

                  {/* Review Card */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className={`px-5 py-3 border-b ${platformConfig[selectedReview.platform].bg} ${platformConfig[selectedReview.platform].border}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-7 h-7 ${platformConfig[selectedReview.platform].color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                            {platformConfig[selectedReview.platform].icon}
                          </div>
                          <span className={`text-sm font-semibold ${platformConfig[selectedReview.platform].text}`}>
                            {platformConfig[selectedReview.platform].label} Review
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{selectedReview.date}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                          {selectedReview.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{selectedReview.reviewer}</div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < selectedReview.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">"{selectedReview.text}"</p>

                      {/* Sentiment + Topics */}
                      <div className="mt-4 flex items-center space-x-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          selectedReview.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          selectedReview.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {selectedReview.sentiment === 'positive' ? '😊 Positive' :
                           selectedReview.sentiment === 'negative' ? '😟 Negative' : '😐 Neutral'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Response Section */}
                  <div className="mt-5 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-sky-500 to-fuchsia-500 rounded flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">AI Response</span>
                      </div>
                      {(selectedReview.aiResponse || typedResponse) && (
                        <span className="text-[10px] text-green-600 font-medium">Generated in 1.2s</span>
                      )}
                    </div>
                    <div className="p-5">
                      {selectedReview.status === 'posted' && selectedReview.aiResponse ? (
                        <>
                          <p className="text-gray-700 leading-relaxed text-sm">{selectedReview.aiResponse}</p>
                          <div className="mt-4 flex items-center space-x-2">
                            <span className="inline-flex items-center text-xs text-green-600 font-medium">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Posted to {platformConfig[selectedReview.platform].label}
                            </span>
                          </div>
                        </>
                      ) : selectedReview.status === 'draft' && selectedReview.aiResponse ? (
                        <>
                          <p className="text-gray-700 leading-relaxed text-sm">{selectedReview.aiResponse}</p>
                          <div className="mt-4 flex items-center space-x-3">
                            <button
                              onClick={() => handleApproveResponse(selectedReview.id)}
                              className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve & Post
                            </button>
                            <button className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                              Edit
                            </button>
                          </div>
                        </>
                      ) : generatingId === selectedReview.id ? (
                        <div className="flex items-center space-x-3 py-4">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" />
                          </div>
                          <span className="text-sm text-gray-500">AI is analyzing the review and crafting a response...</span>
                        </div>
                      ) : typedResponse ? (
                        <>
                          <p className="text-gray-700 leading-relaxed text-sm">
                            {typedResponse}
                            {isTyping && <span className="inline-block w-0.5 h-4 bg-sky-500 ml-0.5 animate-pulse" />}
                          </p>
                          {!isTyping && (
                            <div className="mt-4 flex items-center space-x-3">
                              <button
                                onClick={() => handleApproveResponse(selectedReview.id)}
                                className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                              >
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve & Post
                              </button>
                              <button className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                                Edit
                              </button>
                              <button
                                onClick={() => handleGenerateResponse(selectedReview)}
                                className="px-4 py-2 text-sky-600 text-sm font-medium rounded-lg border border-sky-300 hover:bg-sky-50 transition-colors"
                              >
                                Regenerate
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-500 mb-4">Generate an AI-powered response for this review</p>
                          <button
                            onClick={() => handleGenerateResponse(selectedReview)}
                            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Generate AI Response
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center px-6">
                  <div>
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Select a review</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                      Click any review to view details and generate an AI-powered response.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 bg-green-600 text-white text-sm font-medium rounded-xl shadow-xl animate-[fadeInUp_0.3s_ease-out] flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{showToast}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
