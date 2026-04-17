"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BellElectric,
  ChevronRight,
  type LucideIcon,
  LayoutDashboard,
  MessageSquareText,
} from "lucide-react";

import {
  APP_CONTEXT_PILLS,
  APP_MOTTO,
  APP_NAME,
  APP_WORKSPACE_LABEL,
  NAV_ITEMS,
  type NavHref,
} from "@/lib/site";
import { cn } from "@/lib/utils";
import type { DemoSession } from "@/lib/auth/session";
import { LogoutButton } from "@/components/logout-button";

const NAV_ICONS: Record<NavHref, LucideIcon> = {
  "/": LayoutDashboard,
  "/alerts": BellElectric,
  "/query": MessageSquareText,
};

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/plants/");
  }

  return pathname.startsWith(href);
}

export function AppShell({
  children,
  session,
}: {
  children: ReactNode;
  session: DemoSession;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[296px_minmax(0,1fr)]">
      <aside className="hidden border-r border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(244,246,247,0.74))] shadow-[0_28px_54px_-42px_rgba(24,59,90,0.28)] backdrop-blur-2xl lg:flex lg:h-screen lg:flex-col lg:sticky lg:top-0">
        <div className="px-5 py-5 xl:px-6 xl:py-6">
          <div className="rounded-[1.75rem] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(242,245,247,0.62))] p-5 shadow-[var(--shadow-panel)]">
            <div className="space-y-5">
              <div className="flex items-center justify-start rounded-[1.4rem] bg-[linear-gradient(135deg,#183b5a,#102c45)] px-4 py-4 shadow-[0_24px_50px_-28px_rgba(24,59,90,0.72)]">
                <Image
                  src="/bridgewater-logo-white.png"
                  alt="Bridgewater Interiors"
                  width={1288}
                  height={653}
                  className="h-auto w-full max-w-[132px]"
                  priority
                />
              </div>

              <div className="space-y-2">
                <p className="text-[1.35rem] font-semibold leading-tight tracking-[-0.04em] text-[var(--color-foreground)]">
                  {APP_NAME}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-5 xl:px-6 xl:pb-6">
          <div className="mb-4 px-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]">
              Navigation
            </p>
          </div>

          <nav aria-label="Primary" className="grid gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = NAV_ICONS[item.href];
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-[1.35rem] px-4 py-3.5 text-sm transition-all",
                    active
                      ? "bg-[var(--color-primary)] text-white shadow-[0_24px_40px_-28px_rgba(24,59,90,0.9)]"
                      : "bg-white/56 text-[var(--color-muted-foreground)] hover:bg-white/82 hover:text-[var(--color-foreground)]",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-2xl transition-colors",
                        active
                          ? "bg-white/12 text-white"
                          : "bg-[var(--color-secondary)]/72 text-[var(--color-primary)] group-hover:bg-[var(--color-secondary)]",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="space-y-0.5">
                      <span className="block font-semibold">{item.label}</span>
                      <span
                        className={cn(
                          "block text-xs",
                          active ? "text-white/72" : "text-[var(--color-muted-foreground)]",
                        )}
                      >
                        {item.href === "/"
                          ? "Network command"
                          : item.href === "/alerts"
                            ? "Operational monitoring"
                            : "Grounded analysis"}
                      </span>
                    </span>
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      active
                        ? "translate-x-0 text-white/82"
                        : "text-[var(--color-border)] group-hover:translate-x-0.5",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 space-y-3 rounded-[1.5rem] border border-[var(--color-border)]/80 bg-white/58 p-4 shadow-[var(--shadow-panel)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]">
              Operating context
            </p>
            <div className="flex flex-wrap gap-2">
              {APP_CONTEXT_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-[var(--color-border)] bg-white/78 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-[1.6rem] border border-[var(--color-border)]/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,246,247,0.84))] p-4 shadow-[var(--shadow-panel)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-risk-low)] shadow-[0_0_0_4px_rgba(89,121,101,0.12)]" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                  Signed in
                </p>
                <p className="truncate text-sm font-medium text-[var(--color-foreground)]">
                  {session.email}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-[var(--color-border)]/80 pt-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-white/80 bg-white/84 backdrop-blur-2xl shadow-[0_20px_40px_-34px_rgba(24,59,90,0.28)]">
          <div className="px-5 py-4 sm:px-6 lg:px-8 xl:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
              <div className="flex min-w-0 items-center gap-4 lg:hidden">
                <div className="flex w-[108px] min-w-[108px] items-center justify-center rounded-[1.2rem] bg-[linear-gradient(135deg,#183b5a,#102c45)] px-3 py-2.5 shadow-[0_24px_50px_-28px_rgba(24,59,90,0.72)]">
                  <Image
                    src="/bridgewater-logo-white.png"
                    alt="Bridgewater Interiors"
                    width={1288}
                    height={653}
                    className="h-auto w-full max-w-[90px]"
                    priority
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-muted-foreground)]">
                    {APP_MOTTO}
                  </p>
                  <p className="text-base font-semibold text-[var(--color-foreground)]">
                    {APP_NAME}
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-3 lg:ml-auto lg:flex lg:flex-wrap lg:justify-end">
                <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)]/80 bg-white/72 px-4 py-2 text-xs font-medium text-[var(--color-muted-foreground)]">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-risk-low)]" />
                  Bridgewater workspace
                  <span className="text-[var(--color-border)]">/</span>
                  Operating context
                </div>

                <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)]/70 bg-white/72 px-4 py-2 text-xs font-medium text-[var(--color-muted-foreground)]">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                  {APP_CONTEXT_PILLS.join(" / ")}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-full border border-[var(--color-border)]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,246,247,0.84))] px-3.5 py-2 shadow-[var(--shadow-panel)] lg:hidden">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-risk-low)] shadow-[0_0_0_4px_rgba(89,121,101,0.12)]" />
                  <p className="max-w-[180px] truncate text-sm font-medium text-[var(--color-foreground)]">
                    {session.email}
                  </p>
                </div>
                <div className="h-5 w-px shrink-0 bg-[var(--color-border)]/80" />
                <LogoutButton />
              </div>

              <nav
                aria-label="Primary"
                className="flex items-center gap-2 overflow-x-auto rounded-full border border-[var(--color-border)]/80 bg-white/72 p-1.5 shadow-[var(--shadow-panel)] lg:hidden"
              >
                {NAV_ITEMS.map((item) => {
                  const Icon = NAV_ICONS[item.href];
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
                        active
                          ? "bg-[var(--color-primary)] !text-white shadow-[0_16px_32px_-24px_rgba(24,59,90,0.9)] hover:!text-white focus:!text-white active:!text-white visited:!text-white [&_svg]:!text-white"
                          : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </header>

        <main className="mx-auto flex max-w-[1600px] flex-col gap-10 px-5 py-8 sm:px-6 lg:px-8 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
