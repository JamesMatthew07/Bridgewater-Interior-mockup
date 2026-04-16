"use client";

import { useActionState } from "react";
import { LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { loginAction } from "@/app/actions/auth";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {
  email: "",
  message: null as string | null,
  fieldErrors: {} as {
    email?: string;
    password?: string;
  },
};

export function LoginForm({
  next,
}: {
  next?: string;
}) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <Card className="auth-fade-up w-full max-w-md overflow-hidden border-white/70 bg-white/80 shadow-[0_32px_90px_-46px_rgba(24,59,90,0.28)] backdrop-blur-2xl">
      <CardHeader className="gap-3 border-b border-[var(--color-border)]/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(242,245,247,0.5))]">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/78 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          Bridgewater Workspace Access
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-[-0.04em]">
            Sign in to the workspace
          </CardTitle>
          <CardDescription className="max-w-sm text-sm leading-7">
            Use any valid email and a password with at least 6 characters to
            enter the Bridgewater operations workspace.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="next" value={next ?? "/"} />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="alex.ops@bridgewater-interiors.com"
                defaultValue={state.email}
                className="pl-10"
                aria-invalid={Boolean(state.fieldErrors.email)}
              />
            </div>
            {state.fieldErrors.email ? (
              <p className="text-sm text-[var(--color-destructive)]">
                {state.fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                className="pl-10"
                aria-invalid={Boolean(state.fieldErrors.password)}
              />
            </div>
            {state.fieldErrors.password ? (
              <p className="text-sm text-[var(--color-destructive)]">
                {state.fieldErrors.password}
              </p>
            ) : null}
          </div>

          {state.message ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to sign in</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}

          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Opening Bridgewater workspace...
              </>
            ) : (
              "Enter operations workspace"
            )}
          </Button>
        </form>

        <div className="rounded-[calc(var(--radius)*1.1)] border border-[var(--color-border)]/80 bg-[linear-gradient(180deg,rgba(244,246,247,0.92),rgba(236,240,242,0.82))] px-4 py-4 text-sm leading-6 text-[var(--color-muted-foreground)]">
          Access is intentionally lightweight for stakeholder review. There are
          no stored accounts, no password reset flow, and no external identity
          provider behind this screen.
        </div>
      </CardContent>
    </Card>
  );
}
