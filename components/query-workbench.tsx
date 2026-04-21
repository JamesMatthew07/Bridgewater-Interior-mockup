"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle, SendHorizonal, Sparkles } from "lucide-react";

import { buildFallbackQueryResponse } from "@/lib/ai/query-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { AiAnswer, QueryRequest, QueryResponse } from "@/lib/types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  answer?: AiAnswer;
}

const STARTER_PROMPTS = [
  {
    id: "attention-first",
    label: "Network priority",
    question: "Which Bridgewater facility needs attention first today?",
  },
  {
    id: "warren-oee",
    label: "Warren performance",
    question: "Why did Warren OEE drop yesterday?",
  },
  {
    id: "detroit-inventory",
    label: "Detroit inventory",
    question: "Why is inventory health weakening in Detroit?",
  },
  {
    id: "otif-risk",
    label: "Service risk",
    question: "Which Bridgewater orders are most at risk of missing OTIF targets?",
  },
] as const;

function AssistantReplyLoader() {
  return (
    <div className="flex gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)]/12 text-[var(--color-primary)]">
        <LoaderCircle className="h-5 w-5 animate-spin" />
      </div>
      <div className="max-w-3xl rounded-[1.75rem] border border-[var(--color-border)]/80 bg-white/86 px-5 py-4 shadow-[var(--shadow-panel)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
          Assistant
        </p>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted-foreground)]">
          Reviewing network KPIs, plant trends, alerts, and inventory signals...
        </p>
      </div>
    </div>
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

function AssistantMessage({
  answer,
  content,
}: {
  answer?: AiAnswer;
  content: string;
}) {
  if (!answer) {
    return (
      <p className="mt-2 text-base leading-8 text-[var(--color-foreground)]">
        {content}
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-4 text-[var(--color-foreground)]">
      <p className="text-base leading-8">{answer.summary}</p>

      {answer.insights.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
            What The Data Says
          </p>
          <ul className="space-y-2 pl-5 text-sm leading-7 text-[var(--color-muted-foreground)]">
            {answer.insights.map((insight) => (
              <li key={insight} className="list-disc">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {answer.recommendedActions.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
            Recommended Actions
          </p>
          <ul className="space-y-2 pl-5 text-sm leading-7 text-[var(--color-muted-foreground)]">
            {answer.recommendedActions.map((action) => (
              <li key={action} className="list-disc">
                {action}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="border-t border-[var(--color-border)]/70 pt-3 text-xs leading-6 text-[var(--color-muted-foreground)]">
        Coverage: {answer.context.plants.join(", ")}. Sources: {answer.context.sources.join(", ")}.
        Confidence: {answer.confidence}.
      </p>
    </div>
  );
}

export function QueryWorkbench({
  initialQuestion,
  initialResponse,
  autoRunFromUrl,
}: {
  initialQuestion: string;
  initialResponse: QueryResponse | null;
  autoRunFromUrl: boolean;
}) {
  const [draft, setDraft] = useState(initialQuestion);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initialResponse
      ? [
          {
            id: "initial-user",
            role: "user",
            content: initialResponse.answer.question,
          },
          {
            id: "initial-assistant",
            role: "assistant",
            content: initialResponse.answer.summary,
            answer: initialResponse.answer,
          },
        ]
      : [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const lastAutoRunKey = useRef<string | null>(null);
  const messageCounter = useRef(messages.length);
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  function nextMessageId(role: ChatMessage["role"]) {
    messageCounter.current += 1;
    return `${role}-${messageCounter.current}`;
  }

  function appendMessage(role: ChatMessage["role"], content: string) {
    const message = {
      id: nextMessageId(role),
      role,
      content,
    } satisfies ChatMessage;

    setMessages((current) => [
      ...current,
      message,
    ]);
  }

  function appendAssistantAnswer(answer: AiAnswer) {
    const message = {
      id: nextMessageId("assistant"),
      role: "assistant",
      content: answer.summary,
      answer,
    } satisfies ChatMessage;

    setMessages((current) => [
      ...current,
      message,
    ]);
  }

  function submitQuestion(
    question: string,
    options?: {
      clearThread?: boolean;
    },
  ) {
    const trimmed = question.trim();

    if (!trimmed) {
      return;
    }

    const userMessage = {
      id: nextMessageId("user"),
      role: "user",
      content: trimmed,
    } satisfies ChatMessage;

    setDraft("");
    setMessages((current) =>
      options?.clearThread
        ? [userMessage]
        : [...current, userMessage],
    );

    setIsLoading(true);

    void requestQueryAnswer({
      question: trimmed,
    })
      .then((response) => {
        appendAssistantAnswer(response.answer);
      })
      .catch(() => {
        const fallback = buildFallbackQueryResponse({
          question: trimmed,
        });

        appendAssistantAnswer(fallback.answer);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const autoRunQuestion = useEffectEvent((question: string) => {
    submitQuestion(question, {
      clearThread: true,
    });
  });

  useEffect(() => {
    if (!autoRunFromUrl || !initialQuestion) {
      return;
    }

    const autoRunKey = initialQuestion;

    if (lastAutoRunKey.current === autoRunKey) {
      return;
    }

    lastAutoRunKey.current = autoRunKey;
    const frame = window.requestAnimationFrame(() => {
      autoRunQuestion(initialQuestion);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [autoRunFromUrl, initialQuestion]);

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  return (
    <section className="mx-auto flex h-[calc(100svh-10rem)] min-h-0 w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-[var(--color-border)]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(243,246,248,0.72))] shadow-[var(--shadow-app)]">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)]/75 px-5 py-4 md:px-7">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]">
            Bridgewater AI Chat
          </p>
          <h1 className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-foreground)]">
            Ask operations questions
          </h1>
        </div>
      </div>

      <div
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-7"
      >
        {messages.length > 0 || isLoading ? (
          <div className="space-y-6">
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-3xl rounded-[1.75rem] bg-[var(--color-primary)] px-5 py-4 text-white shadow-[0_24px_40px_-30px_rgba(24,59,90,0.9)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/72">
                      You
                    </p>
                    <p className="mt-2 text-base leading-7">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)]/12 text-[var(--color-primary)]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="max-w-3xl rounded-[1.75rem] border border-[var(--color-border)]/80 bg-white/86 px-5 py-4 shadow-[var(--shadow-panel)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                      Assistant
                    </p>
                    <AssistantMessage answer={message.answer} content={message.content} />
                  </div>
                </div>
              ),
            )}

            {isLoading ? (
              <AssistantReplyLoader />
            ) : null}
            <div ref={bottomAnchorRef} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-[var(--color-foreground)] md:text-4xl">
              Bridgewater Operations Chat
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--color-muted-foreground)]">
              Ask about plant risk, scrap, OTIF, inventory, downtime, or any cross-network operating question.
            </p>
            <div className="mt-8 grid w-full max-w-4xl gap-3 sm:grid-cols-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    submitQuestion(prompt.question, {
                      clearThread: true,
                    });
                  }}
                  className="group flex min-h-[148px] items-center justify-center rounded-[1.5rem] border border-[var(--color-border)]/75 bg-white/84 px-5 py-4 text-center shadow-[var(--shadow-panel)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)]/25 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                >
                  <div className="flex max-w-[28rem] flex-col items-center gap-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]">
                      {prompt.label}
                    </p>
                    <p className="text-sm leading-6 text-[var(--color-foreground)] sm:text-lg sm:leading-7">
                      {prompt.question}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-secondary)]/72 px-3 py-1 text-xs font-medium text-[var(--color-muted-foreground)] transition-colors group-hover:bg-[var(--color-secondary)] group-hover:text-[var(--color-primary)]">
                      Ask this question
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-[var(--color-border)]/75 px-5 py-4 md:px-7">
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            submitQuestion(draft);
          }}
        >
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask a Bridgewater operations question..."
            aria-label="Operations question"
            disabled={isLoading}
            className="min-h-[120px] resize-none rounded-[1.6rem] bg-white/84 px-4 py-4 shadow-[var(--shadow-panel)]"
          />
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <SendHorizonal className="h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
