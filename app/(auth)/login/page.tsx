import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BellElectric,
  LayoutDashboard,
  MessageSquareText,
} from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { Badge } from "@/components/ui/badge";
import { getOptionalSession } from "@/lib/auth/server";
import { sanitizeRedirectTarget } from "@/lib/auth/session";
import {
  APP_COMPANY,
  APP_CONTEXT_PILLS,
  APP_MOTTO,
  APP_NAME,
  APP_WORKSPACE_LABEL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Login",
};

const CAPABILITIES = [
  {
    title: "Executive overview",
    description:
      "Scan Bridgewater network KPI posture, current attention order, and the strongest facility storyline.",
    icon: LayoutDashboard,
  },
  {
    title: "Alert monitoring",
    description:
      "Move from severity counts to chart-backed anomaly context without leaving the current operational window.",
    icon: BellElectric,
  },
  {
    title: "Grounded AI query",
    description:
      "Ask plain-English questions and get answers tied to local Bridgewater KPI, alert, and facility records.",
    icon: MessageSquareText,
  },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const redirectTarget = sanitizeRedirectTarget(params.next) ?? "/";
  const session = await getOptionalSession();

  if (session) {
    redirect(redirectTarget);
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-[linear-gradient(180deg,rgba(249,251,252,0.98),rgba(238,242,245,0.94))] text-[var(--color-foreground)]">
      <div className="auth-ambient absolute inset-0" />
      <div className="absolute inset-y-0 left-[52%] hidden w-px bg-[linear-gradient(180deg,rgba(106,126,143,0),rgba(106,126,143,0.32),rgba(106,126,143,0))] lg:block" />

      <div className="relative grid min-h-svh lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
        <section className="flex min-h-svh items-center px-6 py-12 md:px-10 lg:px-14">
          <div className="auth-fade-up relative w-full max-w-2xl">
            <div className="absolute -left-12 top-14 hidden h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(24,59,90,0.24),rgba(24,59,90,0))] blur-2xl lg:block" />

            <div className="space-y-8">
              <div className="inline-flex items-center gap-4">
                <div className="flex w-[148px] min-w-[148px] items-center justify-center rounded-[1.45rem] bg-[linear-gradient(135deg,#183b5a,#102c45)] px-3.5 py-3 shadow-[0_26px_60px_-30px_rgba(24,59,90,0.72)]">
                  <Image
                    src="/bridgewater-logo-white.png"
                    alt="Bridgewater Interiors"
                    width={1288}
                    height={653}
                    className="h-auto w-full max-w-[122px]"
                    priority
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-muted-foreground)]">
                    {APP_MOTTO}
                  </p>
                  <p className="text-xl font-semibold tracking-[-0.03em]">
                    {APP_COMPANY} {APP_NAME}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <Badge
                  variant="secondary"
                  className="rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.18em]"
                >
                  Protected internal workspace access
                </Badge>
                <div className="space-y-4">
                  <h1 className="max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] md:text-6xl">
                    Bridgewater network access for the full command workspace.
                  </h1>
                  <p className="max-w-xl text-base leading-8 text-[var(--color-muted-foreground)] md:text-lg">
                    This sign-in protects overview, facility drill-downs, alerts,
                    and AI analysis while keeping the experience rooted in
                    Bridgewater&apos;s public footprint, JIT operations model, and
                    internal-system tone.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
                {APP_CONTEXT_PILLS.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-[var(--color-border)] bg-white/60 px-3 py-1.5"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="grid gap-5 pt-4">
                {CAPABILITIES.map((capability) => {
                  const Icon = capability.icon;

                  return (
                    <div
                      key={capability.title}
                      className="grid gap-3 border-b border-[var(--color-border)]/65 pb-5 last:border-b-0 last:pb-0 md:grid-cols-[44px_minmax(0,1fr)]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/72 text-[var(--color-primary)] shadow-[var(--shadow-panel)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-semibold tracking-[-0.02em]">
                          {capability.title}
                        </p>
                        <p className="text-sm leading-7 text-[var(--color-muted-foreground)]">
                          {capability.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 text-sm font-medium text-[var(--color-muted-foreground)]">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-risk-low)]" />
                {APP_WORKSPACE_LABEL} returns you to your intended destination after login.
                <ArrowRight className="h-4 w-4 text-[var(--color-primary)]" />
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-svh items-center justify-center px-6 py-12 md:px-10 lg:px-14">
          <LoginForm next={redirectTarget} />
        </section>
      </div>
    </div>
  );
}
