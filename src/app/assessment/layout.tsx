import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Review Management Assessment',
  description: 'Take our free review management assessment to discover how AI can save your business hours per week on review responses. Get a personalized recommendation.',
  openGraph: {
    title: 'Free Review Management Assessment | GraniteReply AI',
    description: 'Discover how AI can transform your review management. Get a personalized plan recommendation in 5 minutes.',
  },
};

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
