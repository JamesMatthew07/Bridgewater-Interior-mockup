"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">
            Unexpected Error
          </p>
          <CardTitle>The workspace hit an error before it could finish this view.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-7 text-[var(--color-muted-foreground)]">
            Try the route again. If the issue persists, return to the overview and
            re-enter the workspace from there.
          </p>
          <Button onClick={() => reset()}>Try Again</Button>
        </CardContent>
      </Card>
    </div>
  );
}
