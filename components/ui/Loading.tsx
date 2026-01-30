'use client';

type SpinnerSize = 'sm' | 'md' | 'lg';

const spinnerClasses: Record<SpinnerSize, string> = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-2',
  lg: 'w-16 h-16 border-[3px]',
};

/**
 * Animated loading spinner
 */
export function LoadingSpinner({ size = 'md' }: { size?: SpinnerSize }) {
  return (
    <div
      className={`${spinnerClasses[size]} border-[rgba(168,213,229,0.2)] border-t-[#a8d5e5] rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}

/**
 * Full page loading state
 */
export function PageLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <span className="text-[#737373] text-xs uppercase tracking-[0.2em]">Loading...</span>
      </div>
    </div>
  );
}

/**
 * Inline content loading state
 */
export function ContentLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner />
    </div>
  );
}

/**
 * Skeleton loader for text content
 */
export function SkeletonText({ lines = 3, width = '100%' }: { lines?: number; width?: string }) {
  return (
    <div className="flex flex-col gap-2" style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-[#2a2a2a] rounded animate-pulse"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

/**
 * Image placeholder during loading
 */
export function ImagePlaceholder({ aspectRatio = '16/9' }: { aspectRatio?: string }) {
  return (
    <div
      className="w-full bg-[#1a1a1a] rounded flex items-center justify-center"
      style={{ aspectRatio }}
    >
      <LoadingSpinner size="sm" />
    </div>
  );
}
