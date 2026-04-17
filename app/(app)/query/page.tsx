import { QueryWorkbench } from "@/components/query-workbench";
import { coerceQuestion } from "@/lib/url-state";

export default async function QueryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const initialQuestion = coerceQuestion(params.q) ?? "";

  return (
    <QueryWorkbench
      initialQuestion={initialQuestion}
      initialResponse={null}
      autoRunFromUrl={Boolean(coerceQuestion(params.q))}
    />
  );
}
