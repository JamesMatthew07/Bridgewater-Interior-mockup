import "server-only";

import { buildFallbackQueryResponse, buildModelPayload } from "@/lib/ai/query-context";
import type { AiAnswer, QueryRequest, QueryResponse } from "@/lib/types";

const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";

function getClientConfig() {
  return {
    apiKey: process.env.OPENAI_API_KEY?.trim(),
    model: process.env.OPENAI_MODEL?.trim(),
    baseUrl:
      process.env.OPENAI_BASE_URL?.trim().replace(/\/$/, "") ??
      DEFAULT_OPENAI_BASE_URL,
  };
}

function extractMessageContent(content: unknown) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (
          typeof item === "object" &&
          item !== null &&
          "type" in item &&
          item.type === "text" &&
          "text" in item &&
          typeof item.text === "string"
        ) {
          return item.text;
        }

        return "";
      })
      .join("");
  }

  return "";
}

function extractJsonCandidate(raw: string) {
  const trimmed = raw.trim();

  if (!trimmed) {
    return null;
  }

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch?.[1]) {
    return fenceMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isAiAnswer(value: unknown): value is AiAnswer {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<AiAnswer>;

  return (
    typeof candidate.question === "string" &&
    typeof candidate.summary === "string" &&
    isStringArray(candidate.insights) &&
    typeof candidate.confidence === "string" &&
    isStringArray(candidate.recommendedActions) &&
    typeof candidate.context === "object" &&
    candidate.context !== null &&
    Array.isArray(candidate.context.plants) &&
    Array.isArray(candidate.context.sources) &&
    typeof candidate.context.timeRange === "string" &&
    typeof candidate.chart === "object" &&
    candidate.chart !== null &&
    typeof candidate.chart.title === "string" &&
    typeof candidate.chart.type === "string" &&
    Array.isArray(candidate.chart.series)
  );
}

function parseAiAnswer(raw: string) {
  const candidate = extractJsonCandidate(raw);

  if (!candidate) {
    return null;
  }

  try {
    const parsed = JSON.parse(candidate);
    return isAiAnswer(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function resolveOpenAiCompatibleQuery(
  request: QueryRequest,
): Promise<QueryResponse> {
  const fallback = buildFallbackQueryResponse(request);
  const config = getClientConfig();

  if (!config.apiKey || !config.model) {
    return fallback;
  }

  const payload = buildModelPayload(request);

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are an operations intelligence assistant for a manufacturing dashboard. Use only the provided structured data. The retrievedContext section is the highest-priority grounding and represents the most relevant operating records for the question. When the user does not explicitly ask for a time window, synthesize the overall Bridgewater operating picture from the full provided scope rather than narrowing to a short window. Never invent plants, metrics, trends, or causes. Return valid JSON only, with no markdown, no prose outside JSON, and exactly this shape: {\"question\":string,\"summary\":string,\"insights\":string[],\"context\":{\"timeRange\":string,\"plants\":string[],\"sources\":string[]},\"chart\":{\"type\":\"line\"|\"bar\"|\"area\",\"title\":string,\"subtitle\"?:string,\"series\":[{\"label\":string,\"value\":number,\"baseline\"?:number}]},\"confidence\":\"high\"|\"medium\"|\"low\",\"recommendedActions\":string[]}. Write a direct summary, then use insights and recommendedActions to add concrete operational context, comparisons, and next steps.",
          },
          {
            role: "user",
            content: JSON.stringify(payload),
          },
        ],
      }),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });

    if (!response.ok) {
      return fallback;
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: unknown;
        };
      }>;
    };

    const content = extractMessageContent(data.choices?.[0]?.message?.content);
    const answer = parseAiAnswer(content);

    if (!answer) {
      return fallback;
    }

    return {
      mode: "live",
      answer,
      grounding: payload.retrievedContext,
    };
  } catch {
    return fallback;
  }
}
