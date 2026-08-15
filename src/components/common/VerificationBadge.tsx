'use client';

interface VerificationBadgeProps { status: 'verified' | 'cross-checked' | 'needs-verification' | 'source-listed'; size?: 'sm' | 'md' | 'lg'; }

export default function VerificationBadge({ status, size = 'md' }: VerificationBadgeProps) {
  const badgeStyles = { verified: 'bg-green-100 text-green-800', 'cross-checked': 'bg-blue-100 text-blue-800', 'needs-verification': 'bg-yellow-100 text-yellow-800', 'source-listed': 'bg-sky-100 text-sky-800' };
  const sizeStyles = { sm: 'text-xs px-2 py-1', md: 'text-sm px-3 py-1.5', lg: 'text-base px-4 py-2' };
  const labels = { verified: '✓ Verified', 'cross-checked': '✓ Cross-Checked', 'needs-verification': '⚠ Needs Verification', 'source-listed': '◉ Source Listed' };
  return <span className={`inline-block rounded-full font-semibold ${badgeStyles[status]} ${sizeStyles[size]}`}>{labels[status]}</span>;
}
