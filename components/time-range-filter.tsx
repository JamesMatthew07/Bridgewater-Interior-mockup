"use client";

import { useRouter } from "next/navigation";
import { CalendarRange } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIME_RANGE_OPTIONS } from "@/lib/site";
import { buildHref, type SearchParamsInput } from "@/lib/url-state";
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
  const router = useRouter();

  return (
    <Select
      value={currentRange}
      onValueChange={(value) => {
        router.replace(
          buildHref(pathname, searchParams, { range: value }),
          { scroll: false },
        );
      }}
    >
      <SelectTrigger
        aria-label="Time range filters"
        className="min-w-[188px] bg-white/78 pr-3"
      >
        <span className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap">
          <CalendarRange className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
          <span className="min-w-0 truncate">
            <SelectValue />
          </span>
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Time range</SelectLabel>
          {TIME_RANGE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
