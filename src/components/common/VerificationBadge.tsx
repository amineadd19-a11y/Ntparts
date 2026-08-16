'use client';

type VerificationStatus =
  | 'verified'
  | 'cross-checked'
  | 'needs-verification'
  | 'source-listed'
  | 'unverified';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
}

const badgeStyles: Record<VerificationStatus, string> = {
  verified: 'bg-emerald-100 text-emerald-800',
  'cross-checked': 'bg-blue-100 text-blue-800',
  'needs-verification': 'bg-amber-100 text-amber-800',
  'source-listed': 'bg-sky-100 text-sky-800',
  unverified: 'bg-slate-100 text-slate-700',
};

const sizeStyles = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

const labels: Record<VerificationStatus, string> = {
  verified: '✓ VERIFIED',
  'cross-checked': '✓ CROSS-CHECKED',
  'needs-verification': '⚠ NOT VERIFIED',
  'source-listed': '◉ SOURCE-LISTED',
  unverified: '○ NOT VERIFIED',
};

export default function VerificationBadge({ status, size = 'md' }: VerificationBadgeProps) {
  const safeStatus = badgeStyles[status] ? status : 'needs-verification';
  return (
    <span
      className={`inline-block rounded-full font-semibold tracking-wide ${badgeStyles[safeStatus]} ${sizeStyles[size]}`}
    >
      {labels[safeStatus]}
    </span>
  );
}
