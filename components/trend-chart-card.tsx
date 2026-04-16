import { MetricTrendChart } from "@/components/charts/metric-trend-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MetricKey, TimeSeriesPoint } from "@/lib/types";

export function TrendChartCard({
  title,
  description,
  metric,
  data,
}: {
  title: string;
  description: string;
  metric: MetricKey;
  data: TimeSeriesPoint[];
}) {
  return (
    <Card className="h-full">
      <CardHeader className="gap-1">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <MetricTrendChart data={data} metric={metric} />
      </CardContent>
    </Card>
  );
}
