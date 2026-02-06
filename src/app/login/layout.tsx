import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Sign in to your GraniteReply AI dashboard. Manage your review responses, analytics, and brand voice settings.',
  openGraph: {
    title: 'Log In | GraniteReply AI',
    description: 'Sign in to manage your AI-powered review responses.',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
