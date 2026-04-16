import { Badge } from "@/components/ui/badge";
import { formatTimeRangeLabel } from "@/lib/format";
import type { SourceContext } from "@/lib/types";

export function SourceContextPills({ context }: { context: SourceContext }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary">{formatTimeRangeLabel(context.timeRange)}</Badge>
      {context.plants.map((plant) => (
        <Badge key={plant} variant="outline">
          {plant}
        </Badge>
      ))}
      {context.sources.map((source) => (
        <Badge key={source} variant="outline">
          {source}
        </Badge>
      ))}
    </div>
  );
}

