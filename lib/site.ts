import type { MetricKey, MetricUnit, TimeRange } from "@/lib/types";

export const APP_NAME = "Operations Intelligence";
export const APP_COMPANY = "Bridgewater Interiors";
export const APP_TAGLINE =
  "Internal operations intelligence for Bridgewater Interiors' just-in-time seating and interior systems network.";
export const APP_WORKSPACE_LABEL = "Internal network command workspace";
export const APP_MOTTO = "More Than Seats";

export const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/alerts", label: "Alerts" },
  { href: "/query", label: "Ask AI" },
] as const;

export type NavHref = (typeof NAV_ITEMS)[number]["href"];

export const TIME_RANGE_OPTIONS: Array<{ value: TimeRange; label: string }> = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "month_to_date", label: "Month To Date" },
];

export const APP_CONTEXT_PILLS = [
  "Detroit HQ",
  "4 U.S. facilities",
  "JIT interiors",
] as const;

export const BRIDGEWATER_SNAPSHOT = [
  { label: "Founded", value: "1998" },
  { label: "Headquarters", value: "Detroit, Michigan" },
  { label: "Footprint", value: "4 U.S. manufacturing facilities" },
  { label: "Core model", value: "JIT manufacturing, sequencing, and delivery" },
] as const;

export const BRIDGEWATER_CAPABILITIES = [
  "Seating systems",
  "Overhead systems",
  "Center console systems",
  "Certified Minority Business Enterprise",
] as const;

export const BRIDGEWATER_RECOGNITIONS = [
  {
    title: "2025 Ford Diverse Supplier of the Year",
    description:
      "Recent public Bridgewater updates highlight Ford's 2025 recognition for diverse supplier leadership.",
    href: "https://bridgewater-interiors.com/",
  },
  {
    title: "Automotive News Top Supplier recognition",
    description:
      "Bridgewater's public awards page also highlights recognition among North America's top suppliers.",
    href: "https://bridgewater-interiors.com/awards-recognition/",
  },
] as const;

export const METRIC_META: Record<
  MetricKey,
  {
    label: string;
    shortLabel: string;
    unit: MetricUnit;
    improvesWhen: "up" | "down";
    accent: string;
  }
> = {
  oee: {
    label: "Overall Equipment Effectiveness",
    shortLabel: "OEE",
    unit: "percent",
    improvesWhen: "up",
    accent: "#183B5A",
  },
  scrapRate: {
    label: "Scrap Rate",
    shortLabel: "Scrap",
    unit: "percent",
    improvesWhen: "down",
    accent: "#A55B3F",
  },
  otif: {
    label: "On Time In Full",
    shortLabel: "OTIF",
    unit: "percent",
    improvesWhen: "up",
    accent: "#4E6B5E",
  },
  inventoryHealth: {
    label: "Inventory Health",
    shortLabel: "Inventory",
    unit: "score",
    improvesWhen: "up",
    accent: "#6A7E8F",
  },
  downtime: {
    label: "Downtime",
    shortLabel: "Downtime",
    unit: "minutes",
    improvesWhen: "down",
    accent: "#B68A52",
  },
};
