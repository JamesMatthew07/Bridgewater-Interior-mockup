import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { verifySession } from "@/lib/auth/server";

export default async function ProtectedAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await verifySession();

  return <AppShell session={session}>{children}</AppShell>;
}
