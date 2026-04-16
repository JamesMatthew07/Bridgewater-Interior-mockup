import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-primary)]/12 text-[var(--color-primary)]",
        secondary:
          "border-transparent bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]",
        outline:
          "border-[var(--color-border)] bg-white/68 text-[var(--color-muted-foreground)]",
        critical:
          "border-transparent bg-[var(--color-risk-critical)]/12 text-[var(--color-risk-critical)]",
        high: "border-transparent bg-[var(--color-risk-high)]/14 text-[var(--color-risk-high)]",
        medium:
          "border-transparent bg-[var(--color-risk-medium)]/14 text-[var(--color-risk-medium)]",
        low: "border-transparent bg-[var(--color-risk-low)]/14 text-[var(--color-risk-low)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
