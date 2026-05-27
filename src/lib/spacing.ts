/**
 * Spacing tokens for consistent layout across the app.
 * Based on Tailwind's 4px scale (1 = 4px).
 *
 * Prefer these constants or PageShell over ad-hoc spacing classes.
 */
export const spacing = {
  /** Standard page wrapper: container + horizontal/vertical padding + section stack */
  page: 'container mx-auto px-4 py-6 space-y-6',
  pageWide: 'container mx-auto px-4 py-6 max-w-7xl space-y-6',
  pageNarrow: 'container mx-auto px-4 py-6 max-w-2xl space-y-6',
  pageLegal: 'container mx-auto px-4 py-6 max-w-3xl space-y-6',

  /** Vertical stacks */
  stackPage: 'space-y-6',
  stackSection: 'space-y-4',
  stackForm: 'space-y-4',
  stackField: 'space-y-2',
  stackFieldHint: 'space-y-0.5',
  stackList: 'space-y-2',

  /** Flex / grid gaps */
  gapInline: 'gap-2',
  gapInlineLoose: 'gap-4',
  gapGrid: 'gap-4',

  /** Typography spacing */
  sectionTitle: 'mb-4',
  pageSubtitle: 'mt-1',

  /** List rows, empty states, horizontal scroll */
  listRow: 'px-4 py-3',
  emptyState: 'p-8 text-center',
  horizontalBleed: 'overflow-x-auto pb-4 -mx-4 px-4',
  horizontalBleedInner: 'flex gap-4',
} as const;

export type SpacingToken = keyof typeof spacing;
