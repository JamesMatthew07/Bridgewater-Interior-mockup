import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { InventorySignal } from "@/lib/types";

function signalValue(signal: InventorySignal) {
  return signal.unit === "%" ? `${signal.value}%` : `${signal.value}`;
}

function signalTarget(signal: InventorySignal) {
  return signal.unit === "%" ? `${signal.target}%` : `${signal.target}`;
}

export function InventorySignalList({
  signals,
}: {
  signals: InventorySignal[];
}) {
  return (
    <Card>
      <CardHeader className="gap-1">
        <CardTitle>Inventory Signals</CardTitle>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Material coverage, planner confidence, and kitting health in one view.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {signals.map((signal) => (
          <div
            key={signal.label}
            className="rounded-[calc(var(--radius)*1.1)] border border-[var(--color-border)]/70 bg-white/62 px-4 py-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-[var(--color-foreground)]">
                  {signal.label}
                </p>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {signal.narrative}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-[var(--color-foreground)]">
                  {signalValue(signal)}
                </p>
                <p className="text-[var(--color-muted-foreground)]">
                  Target {signalTarget(signal)}
                </p>
              </div>
            </div>
            <Progress
              className="mt-4"
              value={(signal.value / Math.max(signal.target, 1)) * 100}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
