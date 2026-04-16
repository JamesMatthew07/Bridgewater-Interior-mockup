import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">
            Route Not Found
          </p>
          <CardTitle>That page is not available in the current workspace.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-7 text-[var(--color-muted-foreground)]">
            This workspace currently supports the executive overview, facility
            detail pages, alerts, and the natural-language query workspace.
          </p>
          <Link href="/" className={buttonVariants()}>
            Back To Overview
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
