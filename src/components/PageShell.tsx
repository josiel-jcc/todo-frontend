import type { ReactNode } from 'react';
import { spacing } from '@/lib/spacing';
import { cn } from '@/lib/utils';

export type PageShellSize = 'wide' | 'narrow' | 'legal' | 'default';

const sizeClass: Record<PageShellSize, string> = {
  wide: spacing.pageWide,
  narrow: spacing.pageNarrow,
  legal: spacing.pageLegal,
  default: spacing.page,
};

interface PageShellProps {
  children: ReactNode;
  size?: PageShellSize;
  className?: string;
}

/** Consistent page layout wrapper (padding, max-width, section spacing). */
export const PageShell = ({ children, size = 'wide', className }: PageShellProps) => (
  <div className={cn(sizeClass[size], className)}>{children}</div>
);
