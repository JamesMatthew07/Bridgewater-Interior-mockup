import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPercent } from "@/lib/format";
import { buildHref } from "@/lib/url-state";
import type { ComparisonRow, TimeRange } from "@/lib/types";

export function PlantComparisonTable({
  rows,
  timeRange,
}: {
  rows: ComparisonRow[];
  timeRange: TimeRange;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Facility</TableHead>
          <TableHead>OEE</TableHead>
          <TableHead>Scrap</TableHead>
          <TableHead>OTIF</TableHead>
          <TableHead>Inventory</TableHead>
          <TableHead>Downtime</TableHead>
          <TableHead>Alerts</TableHead>
          <TableHead className="min-w-44">Risk</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={row.plantId}>
            <TableCell className="text-sm font-semibold text-[var(--color-muted-foreground)]">
              {String(index + 1).padStart(2, "0")}
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <Link
                  href={buildHref(`/plants/${row.plantId}`, {}, {
                    range: timeRange,
                  })}
                  className="inline-flex items-center gap-2 font-semibold text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
                >
                  {row.plantName}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="max-w-sm text-xs leading-5 text-[var(--color-muted-foreground)]">
                  {row.headline}
                </p>
              </div>
            </TableCell>
            <TableCell>{formatPercent(row.oee)}</TableCell>
            <TableCell>{formatPercent(row.scrapRate)}</TableCell>
            <TableCell>{formatPercent(row.otif)}</TableCell>
            <TableCell>{Math.round(row.inventoryHealth * 100)}/100</TableCell>
            <TableCell>{Math.round(row.downtime)} min</TableCell>
            <TableCell>{row.activeAlerts}</TableCell>
            <TableCell>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]">
                  <span>Attention score</span>
                  <span>{row.riskIndex}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-secondary)]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-risk-high))]"
                    style={{ width: `${row.riskIndex}%` }}
                  />
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
