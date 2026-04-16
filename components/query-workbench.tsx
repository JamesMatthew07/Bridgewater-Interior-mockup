"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { History, LoaderCircle, SendHorizonal, Sparkles } from "lucide-react";

import { buildFallbackQueryResponse } from "@/lib/ai/query-context";
import { AiAnswerCard } from "@/components/ai-answer-card";
import { SupportingChart } from "@/components/charts/supporting-chart";
import { QueryGroundingCard } from "@/components/query-grounding-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { buildHref, type SearchParamsInput } from "@/lib/url-state";
import type {
  QueryPreset,
  QueryRequest,
  QueryResponse,
  TimeRange,
} from "@/lib/types";

const HISTORY_KEY = "bwi-query-history";

function QueryResultLoader() {
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)]/12 text-[var(--color-primary)]">
              <LoaderCircle className="h-5 w-5 animate-spin" />
            </div>
            <div className="space-y-1">
              <CardTitle>Generating Grounded Answer</CardTitle>
              <CardDescription>
                Retrieving Bridgewater operating records and assembling the response for your question.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retrieved Bridgewater Context</CardTitle>
          <CardDescription>
            Ranking the most relevant facilities, alerts, and KPI trends from the local dataset.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preparing Chart</CardTitle>
          <CardDescription>
            Building the chart-backed evidence for the answer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[320px] w-full rounded-2xl" />
        </CardContent>
      </Card>
    </>
  );
}

async function requestQueryAnswer(payload: QueryRequest) {
  const response = await fetch("/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Query request failed.");
  }

  return (await response.json()) as QueryResponse;
}

export function QueryWorkbench({
  presets,
  initialQuestion,
  initialRange,
  initialResponse,
  initialSearchParams,
  autoRunFromUrl,
}: {
  presets: QueryPreset[];
  initialQuestion: string;
  initialRange: TimeRange;
  initialResponse: QueryResponse;
  initialSearchParams: SearchParamsInput;
  autoRunFromUrl: boolean;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialQuestion);
  const [result, setResult] = useState(initialResponse);
  const [history, setHistory] = useState<string[]>(
    [initialQuestion, ...presets.slice(0, 3).map((preset) => preset.question)].filter(
      (value, index, values) => value && values.indexOf(value) === index,
    ),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const lastAutoRunKey = useRef<string | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedHistory = window.sessionStorage.getItem(HISTORY_KEY);
      const parsedHistory = storedHistory
        ? (JSON.parse(storedHistory) as string[])
        : [];
      const merged = [
        initialQuestion,
        ...parsedHistory,
        ...presets.slice(0, 3).map((preset) => preset.question),
      ].filter((value, index, values) => value && values.indexOf(value) === index);

      setHistory(merged.slice(0, 6));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [initialQuestion, presets]);

  useEffect(() => {
    window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  function syncUrl(question: string) {
    router.replace(
      buildHref("/query", initialSearchParams, {
        range: initialRange,
        q: question || undefined,
      }),
      { scroll: false },
    );
  }

  function rememberQuestion(question: string) {
    setHistory((current) =>
      [question, ...current.filter((item) => item !== question)].slice(0, 6),
    );
  }

  function runQuestion(
    question: string,
    options?: {
      persist?: boolean;
      updateUrl?: boolean;
      silenceNetworkNotice?: boolean;
    },
  ) {
    const trimmed = question.trim();

    if (!trimmed) {
      return;
    }

    setDraft(trimmed);
    setNotice(null);

    if (options?.updateUrl ?? true) {
      syncUrl(trimmed);
    }

    if (options?.persist ?? true) {
      rememberQuestion(trimmed);
    }

    setIsLoading(true);

    void requestQueryAnswer({
      question: trimmed,
      timeRange: initialRange,
    })
      .then((response) => {
        setResult(response);
      })
      .catch(() => {
        setResult(
          buildFallbackQueryResponse({
            question: trimmed,
            timeRange: initialRange,
          }),
        );

        if (!options?.silenceNetworkNotice) {
          setNotice(
            "The live query service was not reachable, so the local Bridgewater retrieval layer is still in view.",
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (!autoRunFromUrl) {
      return;
    }

    const autoRunKey = `${initialRange}:${initialQuestion}`;

    if (lastAutoRunKey.current === autoRunKey) {
      return;
    }

    lastAutoRunKey.current = autoRunKey;
    const frame = window.requestAnimationFrame(() => {
      setIsLoading(true);

      void requestQueryAnswer({
        question: initialQuestion,
        timeRange: initialRange,
      })
        .then((response) => {
          setResult(response);
        })
        .catch(() => {
          setResult(
            buildFallbackQueryResponse({
              question: initialQuestion,
              timeRange: initialRange,
            }),
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [autoRunFromUrl, initialQuestion, initialRange]);

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <aside className="xl:sticky xl:top-28 xl:self-start">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)]/12 text-[var(--color-primary)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle>Ask Operations AI</CardTitle>
                <CardDescription>
                  Query results stay grounded in local KPI, alert, facility, and trend data.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                runQuestion(draft);
              }}
            >
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about Warren risk, Oxford benchmarking, Detroit inventory, Lansing OTIF, or cross-facility trends."
                aria-label="Operations question"
                disabled={isLoading}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Generating Answer...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="h-4 w-4" />
                    Generate Answer
                  </>
                )}
              </Button>
            </form>

            <div className="rounded-[calc(var(--radius)*1.2)] bg-[var(--color-secondary)]/72 px-4 py-4 text-sm leading-6 text-[var(--color-muted-foreground)]">
              {isLoading
                ? "Processing the question now. The app is retrieving the most relevant Bridgewater operating records before assembling the answer."
                : notice ??
                  "If live model credentials are configured, this page will try a real model first and fall back to the local Bridgewater retrieval layer automatically."}
            </div>

            <div className="space-y-3 border-t border-[var(--color-border)]/75 pt-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">
                    Suggested questions
                  </p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Prompts aligned to the strongest Bridgewater data storylines.
                  </p>
                </div>
                <span className="rounded-full border border-[var(--color-border)] bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
                  {presets.length} presets
                </span>
              </div>
              <div className="grid gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => runQuestion(preset.question)}
                    disabled={isLoading}
                    className="rounded-[calc(var(--radius)*1.05)] border border-[var(--color-border)] bg-white/72 px-4 py-3 text-left text-sm leading-6 text-[var(--color-foreground)] hover:bg-[var(--color-secondary)]"
                  >
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
                      {preset.label}
                    </span>
                    <span className="mt-2 block">{preset.question}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-[var(--color-border)]/75 pt-6">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-[var(--color-muted-foreground)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">
                    Session history
                  </p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Recent prompts persist for this browser session.
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                {history.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => runQuestion(item)}
                    disabled={isLoading}
                    className="rounded-[calc(var(--radius)*1.05)] bg-[var(--color-secondary)]/72 px-3.5 py-2.5 text-left text-sm text-[var(--color-foreground)] hover:bg-[var(--color-secondary)]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>

      <div aria-live="polite" className="grid gap-6">
        {isLoading ? (
          <QueryResultLoader />
        ) : (
          <>
            <AiAnswerCard answer={result.answer} mode={result.mode} />
            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
              <Card>
                <CardHeader className="gap-1">
                  <CardTitle>{result.answer.chart.title}</CardTitle>
                  <CardDescription>
                    {result.answer.chart.subtitle ??
                      "Chart-backed evidence for the active answer."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SupportingChart chart={result.answer.chart} />
                </CardContent>
              </Card>

              <QueryGroundingCard grounding={result.grounding} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
