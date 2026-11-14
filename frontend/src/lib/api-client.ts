import type { Dashboard, ScenarioResult } from "../types/domain";

const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getDashboard(signal?: AbortSignal): Promise<Dashboard> {
  const response = await fetch(`${base}/api/dashboard`, { signal, cache: "no-store" });
  if (!response.ok) throw new Error(`Dashboard request failed: ${response.status}`);
  return (await response.json()) as Dashboard;
}

export async function getScenario(
  kind: string,
  index: number,
  signal?: AbortSignal
): Promise<ScenarioResult> {
  const query = new URLSearchParams({ kind, index: String(index) });
  const response = await fetch(`${base}/api/scenarios?${query}`, { signal });
  if (!response.ok) throw new Error(`Scenario request failed: ${response.status}`);
  return (await response.json()) as ScenarioResult;
}
