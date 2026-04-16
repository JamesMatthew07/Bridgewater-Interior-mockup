import * as React from "react";

import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="w-full overflow-hidden rounded-[calc(var(--radius)*1.25)] border border-[var(--color-border)]/80 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="w-full overflow-x-auto">
        <table className={cn("w-full caption-bottom border-separate border-spacing-0 text-sm", className)} {...props} />
      </div>
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("bg-[var(--color-secondary)]/75", className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-[var(--color-secondary)]/55",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-12 border-b border-[var(--color-border)]/75 px-4 text-left align-middle text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn("border-b border-[var(--color-border)]/60 p-4 align-middle text-[var(--color-foreground)]", className)}
      {...props}
    />
  );
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
