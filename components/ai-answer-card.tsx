import { Sparkles } from "lucide-react";

import { SourceContextPills } from "@/components/source-context-pills";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AiAnswer, AiMode } from "@/lib/types";

export function AiAnswerCard({
  answer,
  mode,
}: {
  answer: AiAnswer;
  mode: AiMode;
}) {
  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)]/12 text-[var(--color-primary)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Operations AI Answer</CardTitle>
              <Badge variant={mode === "live" ? "default" : "secondary"}>
                {mode === "live" ? "Live model" : "Local Bridgewater retrieval"}
              </Badge>
              <Badge variant="outline">Confidence {answer.confidence}</Badge>
            </div>
            <CardDescription>
              Query: <span className="font-medium text-[var(--color-foreground)]">{answer.question}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
            Summary
          </p>
          <p className="text-lg leading-8 text-[var(--color-foreground)]">
            {answer.summary}
          </p>
        </div>

        <div className="space-y-3 border-t border-[var(--color-border)]/75 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
            Supporting observations
          </p>
          <div className="grid gap-3">
            {answer.insights.map((insight, index) => (
              <div
                key={insight}
                className="rounded-[calc(var(--radius)*1.2)] bg-[var(--color-secondary)]/72 px-4 py-4 text-sm leading-6 text-[var(--color-foreground)]"
              >
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                  Observation {index + 1}
                </p>
                {insight}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-[var(--color-border)]/75 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
            Context
          </p>
          <SourceContextPills context={answer.context} />
        </div>

        <div className="space-y-3 border-t border-[var(--color-border)]/75 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
            Recommended actions
          </p>
          <div className="grid gap-3">
            {answer.recommendedActions.map((action) => (
              <div
                key={action}
                className="rounded-[calc(var(--radius)*1.2)] border border-[var(--color-border)] bg-white/72 px-4 py-4 text-sm leading-6 text-[var(--color-foreground)]"
              >
                {action}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
