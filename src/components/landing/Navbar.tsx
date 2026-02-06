'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
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
            <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Pricing
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              How It Works
            </a>
            <Link href="/assessment" className="text-gray-500 hover:text-primary-600 transition-colors font-medium">
              Assessment
            </Link>
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
  );
}
