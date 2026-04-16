import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="grid gap-6 border-b border-[var(--color-border)]/75 pb-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,420px)] lg:items-end">
      <div className="max-w-4xl space-y-4">
        <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-border)]/80 bg-white/72 px-4 py-2 shadow-[var(--shadow-panel)]">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-muted-foreground)]">
            {eyebrow}
          </p>
        </div>
        <div className="space-y-2">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[var(--color-foreground)] md:text-5xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--color-muted-foreground)]">
            {description}
          </p>
        </div>
      </div>

      {actions ? (
        <div className="flex flex-wrap items-start gap-3 lg:justify-self-end lg:text-right">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
