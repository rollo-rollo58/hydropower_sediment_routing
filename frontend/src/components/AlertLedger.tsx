import type { Alert } from "../types/domain";

interface Props { alerts: Alert[]; }

export function AlertLedger({ alerts }: Props) {
  return (
    <section className="panel p-5">
      <p className="eyebrow">Synthetic threshold monitor</p>
      <h2 className="mb-4 text-lg font-semibold">Alert ledger</h2>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div key={alert.code} className="flex gap-3 rounded-lg bg-mist p-3 text-sm">
            <span className={`h-3 w-3 shrink-0 rounded-full ${alert.severity === "warning"
              ? "bg-amber-500" : "bg-lake"}`} />
            <div><p className="font-semibold">{alert.code}</p>
              <p className="text-slate-600">{alert.detail}</p></div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Thresholds are for research visualization; not physical plant alarms.
      </p>
    </section>
  );
}
