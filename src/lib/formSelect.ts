import { cn } from '@/lib/utils';

const selectChevron =
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]";

/** Shared native &lt;select&gt; styles (extra right padding for the chevron). */
export const formSelectClassName = cn(
  'flex h-10 w-full appearance-none rounded-2xl border-2 border-input bg-background',
  'bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pl-4 pr-10 py-2 text-sm',
  selectChevron,
  'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50 transition-all'
);
