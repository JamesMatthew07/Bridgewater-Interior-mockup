import { Badge } from "@/components/ui/badge";
import { severityLabel } from "@/lib/format";
import type { AlertSeverity } from "@/lib/types";

export function AlertSeverityBadge({ severity }: { severity: AlertSeverity }) {
  return <Badge variant={severity}>{severityLabel(severity)}</Badge>;
}

