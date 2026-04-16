import Link from "next/link";

import { TIME_RANGE_OPTIONS } from "@/lib/site";
import { buildHref, type SearchParamsInput } from "@/lib/url-state";
import { cn } from "@/lib/utils";
import type { TimeRange } from "@/lib/types";

export function TimeRangeFilter({
  pathname,
  currentRange,
  searchParams = {},
}: {
  pathname: string;
  currentRange: TimeRange;
  searchParams?: SearchParamsInput;
}) {
  return (
    <nav
      aria-label="Time range filters"
      className="flex flex-wrap gap-2 rounded-[calc(var(--radius)*1.25)] border border-[var(--color-border)]/85 bg-white/72 p-1.5 shadow-[var(--shadow-panel)]"
    >
      {TIME_RANGE_OPTIONS.map((option) => {
        const active = option.value === currentRange;

        return (
          <Link
            key={option.value}
            href={buildHref(pathname, searchParams, { range: option.value })}
            className={cn(
              "rounded-full px-3.5 py-2 text-sm font-medium",
              active
                ? "bg-[var(--color-primary)] !text-white shadow-[0_14px_28px_-24px_rgba(24,59,90,0.95)] hover:!text-white focus:!text-white active:!text-white visited:!text-white"
                : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
