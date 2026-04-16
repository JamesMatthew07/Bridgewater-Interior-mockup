"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";

import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      disabled={pending}
      aria-label={pending ? "Signing out" : "Sign out"}
      className="h-8 min-w-[94px] rounded-full px-2.5 text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)] sm:px-3"
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <span className="whitespace-nowrap">Signing out...</span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          <span className="whitespace-nowrap">Sign out</span>
        </>
      )}
    </Button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction} className="shrink-0">
      <LogoutSubmitButton />
    </form>
  );
}
