import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ChatWidget from '@/components/ChatWidget';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://granitereply.vercel.app'),
  title: {
    default: 'GraniteReply AI - AI-Powered Review Response Platform for Local Businesses',
    template: '%s | GraniteReply AI',
  },
  description:
    'GraniteReply AI generates personalized, on-brand responses to Google, Yelp, Facebook, and TripAdvisor reviews in seconds. Trusted by 500+ local businesses. Start your 14-day free trial.',
  keywords: [
    'AI review response',
    'review management',
    'Google review reply',
    'Yelp review response',
    'reputation management',
    'local business reviews',
    'AI customer response',
    'review automation',
    'sentiment analysis',
    'brand voice AI',
  ],
  authors: [{ name: 'GraniteReply AI' }],
  creator: 'GraniteReply AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://granitereply.vercel.app',
    siteName: 'GraniteReply AI',
    title: 'GraniteReply AI - Respond to Every Review with AI Precision',
    description:
      'Stop spending hours on review responses. AI generates personalized, on-brand replies to Google, Yelp, Facebook & TripAdvisor reviews in seconds.',
    images: [
      {
        url: '/combo.jpg',
        width: 1200,
        height: 630,
        alt: 'GraniteReply AI - AI-Powered Review Response Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GraniteReply AI - AI-Powered Review Response Platform',
    description:
      'Generate personalized review responses in seconds. Trusted by 500+ local businesses.',
    images: ['/combo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
