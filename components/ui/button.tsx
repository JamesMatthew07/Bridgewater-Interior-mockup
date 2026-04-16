import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] text-white shadow-[0_18px_32px_-22px_rgba(24,59,90,0.95)] hover:-translate-y-px hover:brightness-105 hover:text-white active:text-white",
        secondary:
          "border border-[var(--color-border)]/70 bg-[var(--color-secondary)]/95 text-[var(--color-secondary-foreground)] hover:-translate-y-px hover:bg-[var(--color-accent)]",
        outline:
          "border border-[var(--color-border)] bg-white/82 text-[var(--color-foreground)] shadow-[var(--shadow-panel)] hover:-translate-y-px hover:bg-[var(--color-secondary)]",
        ghost:
          "text-[var(--color-foreground)] hover:bg-[var(--color-secondary)]",
        destructive:
          "bg-[var(--color-destructive)] text-white shadow-[0_18px_32px_-22px_rgba(155,85,60,0.72)] hover:-translate-y-px hover:brightness-95 hover:text-white active:text-white",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3.5",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
