interface Props { status: string; level: number; }

export function OperationsHeader({ status, level }: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pb-7">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-ink text-white">
          <svg viewBox="0 0 40 40" width="32" aria-hidden="true">
            <path d="M4 10H36M4 20H36M4 30H36" stroke="currentColor" strokeWidth="2" />
            <path d="M11 5V35M29 5V35" stroke="#e9ab53" strokeWidth="3" />
          </svg>
        </div>
        <div>
          <p className="eyebrow">Reservoir intelligence / research simulator</p>
          <h1 className="text-2xl font-bold tracking-tight">Cascade Operations</h1>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="rounded-full bg-white px-4 py-2 text-moss">{status}</span>
        <span className="rounded-full bg-ink px-4 py-2 text-white">
          Pool {level.toFixed(2)} m
        </span>
      </div>
    </header>
  );
}
