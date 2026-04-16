"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BellElectric,
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
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/80 bg-white/84 shadow-[0_20px_40px_-34px_rgba(24,59,90,0.28)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center gap-4 px-6 py-4">
          <div className="flex min-w-0 items-center gap-4 xl:min-w-[330px] xl:flex-none">
            <div className="flex w-[124px] min-w-[124px] items-center justify-center rounded-[1.35rem] bg-[linear-gradient(135deg,#183b5a,#102c45)] px-3 py-2.5 shadow-[0_26px_58px_-30px_rgba(24,59,90,0.72)]">
              <Image
                src="/bridgewater-logo-white.png"
                alt="Bridgewater Interiors"
                width={1288}
                height={653}
                className="h-auto w-full max-w-[102px]"
                priority
              />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]">
                {APP_MOTTO}
              </p>
              <p className="text-lg font-semibold leading-tight text-[var(--color-foreground)]">
                {APP_NAME}
              </p>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {APP_WORKSPACE_LABEL}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 xl:justify-end">
            <nav
              aria-label="Primary"
              className="flex shrink-0 items-center gap-2 overflow-x-auto rounded-full border border-[var(--color-border)]/80 bg-white/72 p-1.5 shadow-[var(--shadow-panel)]"
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

            <div className="hidden items-center gap-2 rounded-full border border-[var(--color-border)]/70 bg-white/72 px-4 py-2 text-xs font-medium text-[var(--color-muted-foreground)] xl:flex">
              <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
              {APP_CONTEXT_PILLS.join(" / ")}
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-border)]/80 bg-white/72 px-4 py-2 text-xs font-medium text-[var(--color-muted-foreground)]">
              <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-risk-low)]" />
              Bridgewater workspace
              <span className="text-[var(--color-border)]">/</span>
              Operating context
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-full border border-[var(--color-border)]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,246,247,0.84))] px-3.5 py-2 shadow-[var(--shadow-panel)]">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-risk-low)] shadow-[0_0_0_4px_rgba(89,121,101,0.12)]" />
                <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)] min-[1380px]:inline">
                  Signed in
                </span>
                <p className="max-w-[170px] truncate text-sm font-medium text-[var(--color-foreground)] 2xl:max-w-[220px]">
                  {session.email}
                </p>
              </div>
              <div className="h-5 w-px shrink-0 bg-[var(--color-border)]/80" />
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1560px] flex-col gap-10 px-6 py-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
