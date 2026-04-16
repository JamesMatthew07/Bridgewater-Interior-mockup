"use client";

import { Database, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { METRIC_META } from "@/lib/site";
import type { QueryGrounding, RetrievedContextKind } from "@/lib/types";

const KIND_LABELS: Record<RetrievedContextKind, string> = {
  network: "Network",
  insight: "Insight",
  plant: "Plant",
  trend: "Trend",
  alert: "Alert",
  inventory: "Inventory",
  downtime: "Downtime",
};

export function QueryGroundingCard({
  grounding,
}: {
  grounding: QueryGrounding;
}) {
  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-secondary)] text-[var(--color-primary)]">
            <Database className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Retrieved Operating Context</CardTitle>
              <Badge variant="secondary">
                <Search className="h-3.5 w-3.5" />
                {grounding.strategy === "keyword_rag" ? "Keyword RAG" : grounding.strategy}
              </Badge>
            </div>
            <CardDescription>
              The query layer pulls the most relevant Bridgewater facility, KPI, alert, and trend records before answering.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-2">
        {grounding.items.map((item) => (
          <div
            key={item.id}
            className="rounded-[calc(var(--radius)*1.2)] border border-[var(--color-border)] bg-white/72 px-4 py-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{KIND_LABELS[item.kind]}</Badge>
              {item.plantName ? <Badge variant="secondary">{item.plantName}</Badge> : null}
              {item.metric ? (
                <Badge variant="outline">{METRIC_META[item.metric].shortLabel}</Badge>
              ) : null}
              {item.severity ? <Badge variant="outline">{item.severity}</Badge> : null}
              {item.sources.map((source) => (
                <Badge key={`${item.id}-${source}`} variant="outline">
                  {source}
                </Badge>
              ))}
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-sm font-semibold text-[var(--color-foreground)]">
                {item.title}
              </p>
              <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
                {item.summary}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
