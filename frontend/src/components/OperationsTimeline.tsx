const steps = [
  { time: "00:00", label: "Forecast ingest", phase: "Complete" },
  { time: "03:00", label: "Synthetic hydrograph check", phase: "Complete" },
  { time: "06:00", label: "Gate envelope review", phase: "In review" },
  { time: "09:00", label: "Sediment sensitivity", phase: "Queued" }
];

export function OperationsTimeline() {
  return (
    <section className="panel p-5">
      <p className="eyebrow">Scheduled simulation milestones</p>
      <h2 className="mb-4 text-lg font-semibold">Operations timeline</h2>
      <ol className="space-y-4 border-l-2 border-mist pl-5">
        {steps.map((step) => (
          <li key={step.time} className="relative">
            <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-lake" />
            <div className="flex justify-between gap-3 text-sm">
              <span><b className="mr-2 text-lake">{step.time}</b>{step.label}</span>
              <span className="text-slate-500">{step.phase}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
