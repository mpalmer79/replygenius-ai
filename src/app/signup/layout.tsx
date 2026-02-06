import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Free Trial',
  description: 'Start your 14-day free trial of GraniteReply AI. No credit card required. AI-powered review responses for Google, Yelp, Facebook & TripAdvisor.',
  openGraph: {
    title: 'Start Free Trial | GraniteReply AI',
    description: 'Start your 14-day free trial. AI-powered review responses for local businesses. No credit card required.',
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
