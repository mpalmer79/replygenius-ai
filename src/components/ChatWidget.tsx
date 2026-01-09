'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type ChatMode = 'intro' | 'chat';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [mode, setMode] = useState<ChatMode>('intro');
  const [businessDescription, setBusinessDescription] = useState('');
  const [customerReview, setCustomerReview] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-open chat on first visit with delay
  useEffect(() => {
    if (!hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasAutoOpened]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && mode === 'chat') {
      inputRef.current.focus();
    }
  }, [isOpen, mode]);

  const handleTestDrive = async () => {
    if (!businessDescription.trim() || !customerReview.trim() || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessDescription: businessDescription.trim(),
          review: customerReview.trim(),
          reviewerName: 'Customer',
          rating: 4,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      setGeneratedResponse(data.response);
    } catch (error) {
      console.error('Generation error:', error);
      setGeneratedResponse("We're having trouble connecting right now. Please try again in a moment!");
    } finally {
      setIsGenerating(false);
    }
  };

  const switchToChat = () => {
    setMode('chat');
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hi there! 👋 I'm the GraniteReply AI assistant. I'm here to answer any questions you have about our review response platform. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  const resetDemo = () => {
    setBusinessDescription('');
    setCustomerReview('');
    setGeneratedResponse('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to email us at support@granitereply.com for immediate assistance.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button - Larger size */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 flex items-center justify-center group ${
          isOpen
            ? 'w-14 h-14 sm:w-16 sm:h-16 bg-gray-600 hover:bg-gray-700 rounded-full'
            : 'w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-accent-500 hover:shadow-xl hover:scale-105 rounded-full shadow-lg'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        
        {/* Pulse animation when closed */}
        {!isOpen && (
          <span className="absolute w-full h-full rounded-full bg-primary-500 animate-ping opacity-20" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-28 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] max-w-[420px] h-[min(500px,calc(100vh-140px))] sm:h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-3 sm:py-4 flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm sm:text-base truncate">GraniteReply Assistant</h3>
              <p className="text-white/80 text-xs">Typically replies instantly</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Minimize chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {mode === 'intro' ? (
            /* Intro / Test Drive Mode */
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {!generatedResponse ? (
                <div className="space-y-4">
                  {/* Welcome Message */}
                  <div className="bg-white rounded-2xl rounded-bl-md p-4 shadow-sm border border-gray-100">
                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                      👋 <strong>Give us a try!</strong> Enter a description of your business and provide a customer review scenario. Give GraniteReply a test drive and see what we can do!
                    </p>
                  </div>

                  {/* Business Description Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      Describe your business
                    </label>
                    <textarea
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                      placeholder="e.g., Family-owned Italian restaurant in downtown Boston, serving authentic dishes since 1985..."
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Customer Review Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      Paste a sample customer review
                    </label>
                    <textarea
                      value={customerReview}
                      onChange={(e) => setCustomerReview(e.target.value)}
                      placeholder="e.g., Great food but the wait time was too long. Server was friendly though!"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleTestDrive}
                    disabled={!businessDescription.trim() || !customerReview.trim() || isGenerating}
                    className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate AI Response</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Generated Response View */
                <div className="space-y-4">
                  {/* Original Review */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Customer Review</p>
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl rounded-br-md px-4 py-3">
                      <p className="text-sm leading-relaxed">{customerReview}</p>
                    </div>
                  </div>

                  {/* AI Generated Response */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI-Generated Response
                    </p>
                    <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-800 leading-relaxed">{generatedResponse}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      onClick={resetDemo}
                      className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all text-sm"
                    >
                      Try Another
                    </button>
                    <a
                      href="/signup"
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:shadow-lg transition-all text-sm text-center"
                    >
                      Start Free Trial
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Chat Mode */
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Footer - Mode Toggle & Input */}
          <div className="bg-white border-t border-gray-100 p-3 sm:p-4">
            {mode === 'intro' ? (
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  Do you have questions? Ask away and give GraniteReply a test drive!
                </p>
                <button
                  onClick={switchToChat}
                  className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center justify-center mx-auto space-x-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Chat with us instead</span>
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => setMode('intro')}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ← Back to demo
                  </button>
                  <p className="text-xs text-gray-400">
                    Powered by GraniteReply AI
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
