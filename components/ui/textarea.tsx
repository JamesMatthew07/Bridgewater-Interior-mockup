import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-36 w-full rounded-[calc(var(--radius)*1.2)] border border-[var(--color-input)] bg-white/82 px-4 py-4 text-base text-[var(--color-foreground)] shadow-[var(--shadow-panel)] outline-none placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-ring)] focus:ring-4 focus:ring-[var(--color-ring)]/18",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
