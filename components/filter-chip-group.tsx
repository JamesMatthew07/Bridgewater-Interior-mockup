import Link from "next/link";

import { buildHref, type SearchParamsInput } from "@/lib/url-state";
import { cn } from "@/lib/utils";

export function FilterChipGroup({
  label,
  pathname,
  searchParams,
  queryKey,
  value,
  options,
}: {
  label: string;
  pathname: string;
  searchParams: SearchParamsInput;
  queryKey: string;
  value?: string;
  options: Array<{ label: string; value?: string }>;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2 rounded-[calc(var(--radius)*1.15)] border border-[var(--color-border)]/80 bg-white/62 p-1.5 shadow-[var(--shadow-panel)]">
        {options.map((option) => {
          const active = option.value === value || (!option.value && !value);

          return (
            <Link
              key={`${queryKey}-${option.label}`}
              href={buildHref(pathname, searchParams, {
                [queryKey]: option.value,
              })}
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
      </div>
    </div>
  );
}
