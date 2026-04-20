"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildHref, type SearchParamsInput } from "@/lib/url-state";

const ALL_OPTION_VALUE = "__all__";

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
  const router = useRouter();
  const selectedValue = value ?? ALL_OPTION_VALUE;

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
        {label}
      </p>
      <Select
        value={selectedValue}
        onValueChange={(nextValue) => {
          router.replace(
            buildHref(pathname, searchParams, {
              [queryKey]:
                nextValue === ALL_OPTION_VALUE ? undefined : nextValue,
            }),
            { scroll: false },
          );
        }}
      >
        <SelectTrigger
          aria-label={`${label} filters`}
          className="w-full bg-white/78"
        >
          <span className="min-w-0 truncate">
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option) => (
              <SelectItem
                key={`${queryKey}-${option.label}`}
                value={option.value ?? ALL_OPTION_VALUE}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
