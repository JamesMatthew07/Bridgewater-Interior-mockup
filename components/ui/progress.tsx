import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const normalizedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={normalizedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-secondary)]/85",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-primary),#6a7e8f)] transition-all"
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}
