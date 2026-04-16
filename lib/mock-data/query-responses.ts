import type { QueryPreset } from "@/lib/types";
import { PLANTS } from "@/lib/mock-data/plants";

const PLANT_NAMES = Object.fromEntries(
  PLANTS.map((plant) => [plant.id, plant.name]),
) as Record<string, string>;

const OXFORD = PLANT_NAMES["plant-1"];
const WARREN = PLANT_NAMES["plant-2"];
const LANSING = PLANT_NAMES["plant-3"];
const DETROIT = PLANT_NAMES["plant-4"];

export const QUERY_PRESETS: QueryPreset[] = [
  {
    id: "attention-first",
    label: "Top risk today",
    question: "Which Bridgewater facility needs attention first today?",
    answer: {
      question: "Which Bridgewater facility needs attention first today?",
      summary:
        `${WARREN} needs attention first today because it combines the weakest OEE, the highest scrap rate, and two active high-severity alerts.`,
      insights: [
        `${WARREN} is the only facility where both scrap and downtime are worsening at the same time.`,
        "Its OEE has fallen below the rest of the network by a visible margin this week.",
        "Planner confidence is also dropping as scrap consumes trim material faster than planned.",
      ],
      context: {
        timeRange: "today",
        plants: [WARREN],
        sources: ["MES", "CMMS", "ERP"],
      },
      chart: {
        type: "bar",
        title: "Bridgewater facility risk comparison - Today",
        subtitle: "Higher score indicates more operational attention required.",
        series: [
          { label: OXFORD, value: 26 },
          { label: WARREN, value: 88 },
          { label: LANSING, value: 41 },
          { label: DETROIT, value: 57 },
        ],
      },
      confidence: "high",
      recommendedActions: [
        `Escalate maintenance recovery actions at ${WARREN} before the next shift handoff.`,
        "Review the highest-loss trim families on Line 4 and Line 5.",
      ],
    },
  },
  {
    id: "plant-2-oee",
    label: "Warren OEE drop",
    question: "Why did Warren OEE drop yesterday?",
    answer: {
      question: "Why did Warren OEE drop yesterday?",
      summary:
        `${WARREN} OEE dropped because downtime kept rising while scrap worsened again, reducing availability and quality at the same time.`,
      insights: [
        `Downtime minutes stayed well above ${WARREN}'s normal maintenance baseline.`,
        "Scrap rose again, suggesting the quality issue was not contained within one shift.",
        "The combined effect is stronger than a pure throughput slowdown, which is why OEE moved sharply.",
      ],
      context: {
        timeRange: "yesterday",
        plants: [WARREN],
        sources: ["MES", "CMMS"],
      },
      chart: {
        type: "line",
        title: `${WARREN} OEE vs Downtime - Last 7 Days`,
        series: [
          { label: "Apr 9", value: 0.71, baseline: 121 },
          { label: "Apr 10", value: 0.7, baseline: 125 },
          { label: "Apr 11", value: 0.7, baseline: 126 },
          { label: "Apr 12", value: 0.69, baseline: 129 },
          { label: "Apr 13", value: 0.68, baseline: 133 },
          { label: "Apr 14", value: 0.67, baseline: 137 },
          { label: "Apr 15", value: 0.66, baseline: 141 },
        ],
      },
      confidence: "high",
      recommendedActions: [
        "Prioritize the maintenance backlog tied to unplanned trim-tool and tooling stops.",
        "Contain the top scrap family before the next production window opens.",
      ],
    },
  },
  {
    id: "worst-scrap",
    label: "Worst scrap trend",
    question: "Which Bridgewater facility has the worst scrap trend this week?",
    answer: {
      question: "Which Bridgewater facility has the worst scrap trend this week?",
      summary:
        `${WARREN} has the worst scrap trend this week by a clear margin, and it is still moving in the wrong direction day over day.`,
      insights: [
        `${WARREN} is the only facility with a sustained upward scrap pattern across the full seven-day window.`,
        `${OXFORD} and ${LANSING} are both improving, while ${DETROIT} is elevated but comparatively flat.`,
        "Because the increase is persistent rather than spiky, it is more likely to keep driving alerts if left alone.",
      ],
      context: {
        timeRange: "last_7_days",
        plants: [OXFORD, WARREN, LANSING, DETROIT],
        sources: ["MES"],
      },
      chart: {
        type: "bar",
        title: "Scrap rate change - Last 7 Days",
        series: [
          { label: OXFORD, value: -0.003 },
          { label: WARREN, value: 0.009 },
          { label: LANSING, value: -0.001 },
          { label: DETROIT, value: 0.001 },
        ],
      },
      confidence: "high",
      recommendedActions: [
        `Treat ${WARREN} scrap as the primary quality escalation this week.`,
        `Benchmark containment actions against the more stable lines in ${OXFORD} and ${LANSING}.`,
      ],
    },
  },
  {
    id: "plant-4-downtime",
    label: "Detroit downtime trend",
    question: "Show downtime trend for Detroit over the last 30 days.",
    answer: {
      question: "Show downtime trend for Detroit over the last 30 days.",
      summary:
        `${DETROIT} downtime is elevated but mostly range-bound, which suggests the larger risk there is inventory instability rather than a fresh equipment event.`,
      insights: [
        "Downtime has hovered in the low-to-high 90 minute range without a breakout spike.",
        `The more visible deterioration in ${DETROIT} is inventory health, not line stoppage.`,
        `This makes ${DETROIT} a planning-risk story more than a maintenance-recovery story.`,
      ],
      context: {
        timeRange: "last_30_days",
        plants: [DETROIT],
        sources: ["MES", "ERP"],
      },
      chart: {
        type: "line",
        title: `${DETROIT} downtime - Last 30 Days`,
        series: [
          { label: "Apr 8", value: 95 },
          { label: "Apr 9", value: 93 },
          { label: "Apr 10", value: 96 },
          { label: "Apr 11", value: 95 },
          { label: "Apr 12", value: 97 },
          { label: "Apr 13", value: 98 },
          { label: "Apr 14", value: 96 },
          { label: "Apr 15", value: 97 },
        ],
      },
      confidence: "medium",
      recommendedActions: [
        `Keep downtime on watch, but direct the main escalation toward kit balancing and transfer approvals in ${DETROIT}.`,
      ],
    },
  },
  {
    id: "otif-risk",
    label: "Orders at OTIF risk",
    question: "Which Bridgewater orders are most at risk of missing OTIF targets?",
    answer: {
      question: "Which Bridgewater orders are most at risk of missing OTIF targets?",
      summary:
        `The highest OTIF risk is currently concentrated in ${LANSING} outbound orders and ${DETROIT} mixed-model final assemblies.`,
      insights: [
        `${LANSING} risk appears tied to staging and packaging flow rather than core production output.`,
        `${DETROIT} risk is driven more by material imbalance and sequencing friction.`,
        `${WARREN} is operationally weaker overall, but its near-term OTIF risk is still less concentrated than ${LANSING}'s outbound queue pressure.`,
      ],
      context: {
        timeRange: "month_to_date",
        plants: [LANSING, DETROIT],
        sources: ["ERP", "MES"],
      },
      chart: {
        type: "bar",
        title: "Orders at risk of OTIF miss",
        series: [
          { label: OXFORD, value: 6 },
          { label: WARREN, value: 11 },
          { label: LANSING, value: 14 },
          { label: DETROIT, value: 12 },
        ],
      },
      confidence: "medium",
      recommendedActions: [
        `Review outbound queue bottlenecks in ${LANSING} before expediting more production.`,
        `Rebalance component coverage for ${DETROIT}'s mixed-model schedule.`,
      ],
    },
  },
  {
    id: "plant-3-otif-soft",
    label: "Lansing OTIF softness",
    question: "Why is Lansing OTIF softer even with strong OEE?",
    answer: {
      question: "Why is Lansing OTIF softer even with strong OEE?",
      summary:
        `${LANSING} OTIF is softening because outbound staging and packaging friction are slowing shipment release even while core line performance remains strong.`,
      insights: [
        "OEE continues to lead the network, so the issue is not basic throughput loss on the production lines.",
        "Packaging verification and staging congestion are creating a handoff bottleneck after production is complete.",
        `That makes ${LANSING} a service-execution problem rather than a plant-efficiency problem.`,
      ],
      context: {
        timeRange: "last_7_days",
        plants: [LANSING],
        sources: ["ERP", "MES", "CMMS"],
      },
      chart: {
        type: "line",
        title: `${LANSING} OTIF vs OEE - Last 7 Days`,
        series: [
          { label: "Apr 9", value: 0.93, baseline: 0.86 },
          { label: "Apr 10", value: 0.92, baseline: 0.86 },
          { label: "Apr 11", value: 0.92, baseline: 0.87 },
          { label: "Apr 12", value: 0.92, baseline: 0.87 },
          { label: "Apr 13", value: 0.91, baseline: 0.87 },
          { label: "Apr 14", value: 0.91, baseline: 0.87 },
          { label: "Apr 15", value: 0.9, baseline: 0.88 },
        ],
      },
      confidence: "high",
      recommendedActions: [
        "Stabilize the packaging lane and trailer staging queue before adding more production expedites.",
        "Track OTIF separately from OEE so the service issue is not masked by strong line efficiency.",
      ],
    },
  },
  {
    id: "inventory-risk",
    label: "Highest inventory risk",
    question: "Which Bridgewater facility has the highest inventory risk right now?",
    answer: {
      question: "Which Bridgewater facility has the highest inventory risk right now?",
      summary:
        `${DETROIT} has the highest inventory risk right now because stock is sitting in the wrong places, transfer requests are rising, and kitting accuracy is slipping.`,
      insights: [
        `${DETROIT} still shows healthy aggregate coverage, but that is hiding localized shortages across critical assembly families.`,
        `${WARREN} is the close second risk because scrap burn is draining specific trim inputs faster than planned.`,
        `${OXFORD} remains the most stable inventory operation in the network.`,
      ],
      context: {
        timeRange: "today",
        plants: [OXFORD, WARREN, LANSING, DETROIT],
        sources: ["ERP", "MES"],
      },
      chart: {
        type: "bar",
        title: "Inventory risk by facility",
        subtitle: "Higher score indicates greater inventory imbalance and planning pressure.",
        series: [
          { label: OXFORD, value: 28 },
          { label: WARREN, value: 74 },
          { label: LANSING, value: 43 },
          { label: DETROIT, value: 79 },
        ],
      },
      confidence: "high",
      recommendedActions: [
        `Escalate component rebalancing and transfer approvals for ${DETROIT} before the next shift schedule freezes.`,
        `Keep ${WARREN} material burn under watch so quality loss does not turn into a broader coverage issue.`,
      ],
    },
  },
  {
    id: "plant-1-benchmark",
    label: "Why Oxford leads",
    question: "Why is Oxford / Eastaboga the current benchmark facility?",
    answer: {
      question: "Why is Oxford / Eastaboga the current benchmark facility?",
      summary:
        `${OXFORD} is the benchmark facility because it is improving on OEE, holding the lowest scrap rate, and sustaining strong inventory and service stability with minimal alert pressure.`,
      insights: [
        `${OXFORD} is the only facility pairing efficiency gains with lower scrap and steady OTIF at the same time.`,
        "Its inventory signals show higher planner confidence and fewer expedites than the rest of the network.",
        "The remaining watch alert is minor trim changeover variability, not a structural performance issue.",
      ],
      context: {
        timeRange: "last_7_days",
        plants: [OXFORD],
        sources: ["MES", "ERP"],
      },
      chart: {
        type: "line",
        title: `${OXFORD} OEE vs network average - Last 7 Days`,
        series: [
          { label: "Apr 9", value: 0.81, baseline: 0.79 },
          { label: "Apr 10", value: 0.82, baseline: 0.79 },
          { label: "Apr 11", value: 0.83, baseline: 0.79 },
          { label: "Apr 12", value: 0.82, baseline: 0.78 },
          { label: "Apr 13", value: 0.83, baseline: 0.78 },
          { label: "Apr 14", value: 0.84, baseline: 0.78 },
          { label: "Apr 15", value: 0.84, baseline: 0.8 },
        ],
      },
      confidence: "high",
      recommendedActions: [
        `Use ${OXFORD} as the operating benchmark for daily management cadence and changeover discipline.`,
        `Harvest sequencing and shift-hand-off practices from ${OXFORD} for ${WARREN} and ${DETROIT} recovery work.`,
      ],
    },
  },
  {
    id: "plant-2-loss-drivers",
    label: "Warren loss drivers",
    question: "Which losses are driving Warren attention today?",
    answer: {
      question: "Which losses are driving Warren attention today?",
      summary:
        `${WARREN} attention is being driven by maintenance-related downtime first, tooling disruption second, and then scrap-linked quality holds that are amplifying both problems.`,
      insights: [
        "Maintenance backlog remains the largest direct source of downtime minutes.",
        "Tooling and quality holds are reinforcing each other, which makes recovery slower than a normal equipment issue.",
        "Material delay is no longer a side story because unstable yield is now affecting coverage and planner confidence too.",
      ],
      context: {
        timeRange: "today",
        plants: [WARREN],
        sources: ["CMMS", "MES", "ERP"],
      },
      chart: {
        type: "bar",
        title: `${WARREN} loss drivers - Current Window`,
        series: [
          { label: "Maintenance", value: 231 },
          { label: "Tooling", value: 168 },
          { label: "Foam And Trim Delay", value: 124 },
          { label: "Changeover", value: 112 },
          { label: "Quality Hold", value: 97 },
        ],
      },
      confidence: "high",
      recommendedActions: [
        `Sequence ${WARREN} recovery around maintenance backlog first, then contain the tooling-related scrap loop.`,
        "Run material coverage checks in parallel so recovery work does not trigger a second supply constraint.",
      ],
    },
  },
  {
    id: "plant-4-inventory",
    label: "Detroit inventory health",
    question: "Why is inventory health weakening in Detroit?",
    answer: {
      question: "Why is inventory health weakening in Detroit?",
      summary:
        `${DETROIT} inventory health is weakening because overall coverage is masking localized shortages, kit accuracy is slipping, and transfer approvals are not clearing fast enough.`,
      insights: [
        "The problem is distribution, not total stock volume, so planners are seeing shortages in the wrong families even while days of supply looks high.",
        "Transfer requests and kit substitutions are both rising, which is making the next two shifts harder to stabilize.",
        "Downtime is elevated but secondary; the core issue is material imbalance across the mixed-model schedule.",
      ],
      context: {
        timeRange: "last_7_days",
        plants: [DETROIT],
        sources: ["ERP", "MES"],
      },
      chart: {
        type: "line",
        title: `${DETROIT} inventory health - Last 7 Days`,
        series: [
          { label: "Apr 9", value: 0.75, baseline: 0.79 },
          { label: "Apr 10", value: 0.74, baseline: 0.79 },
          { label: "Apr 11", value: 0.74, baseline: 0.79 },
          { label: "Apr 12", value: 0.73, baseline: 0.79 },
          { label: "Apr 13", value: 0.72, baseline: 0.79 },
          { label: "Apr 14", value: 0.72, baseline: 0.79 },
          { label: "Apr 15", value: 0.71, baseline: 0.79 },
        ],
      },
      confidence: "high",
      recommendedActions: [
        `Prioritize transfer approvals and kit rebalancing before treating ${DETROIT} as a pure downtime problem.`,
        "Separate localized shortage monitoring from aggregate days-of-supply reporting for the plant leadership view.",
      ],
    },
  },
];
