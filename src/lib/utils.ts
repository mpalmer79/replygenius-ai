import { Platform, SentimentLabel, ReviewStatus } from '@/types';

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return then.toLocaleDateString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getPlatformColor(platform: Platform): string {
  const colors: Record<Platform, string> = {
    google: 'bg-blue-100 text-blue-800',
    yelp: 'bg-red-100 text-red-800',
    facebook: 'bg-indigo-100 text-indigo-800',
    tripadvisor: 'bg-green-100 text-green-800',
  };
  return colors[platform] || 'bg-gray-100 text-gray-800';
}

export function getPlatformName(platform: Platform): string {
  const names: Record<Platform, string> = {
    google: 'Google',
    yelp: 'Yelp',
    facebook: 'Facebook',
    tripadvisor: 'TripAdvisor',
  };
  return names[platform] || platform;
}

export function getSentimentColor(sentiment: SentimentLabel): string {
  const colors: Record<SentimentLabel, string> = {
    positive: 'bg-green-100 text-green-800',
    neutral: 'bg-yellow-100 text-yellow-800',
    negative: 'bg-red-100 text-red-800',
  };
  return colors[sentiment] || 'bg-gray-100 text-gray-800';
}

export function getStatusColor(status: ReviewStatus): string {
  const colors: Record<ReviewStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-blue-100 text-blue-800',
    approved: 'bg-purple-100 text-purple-800',
    posted: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function renderStars(rating: number): string {
  const filled = '★'.repeat(rating);
  const empty = '☆'.repeat(5 - rating);
  return filled + empty;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
