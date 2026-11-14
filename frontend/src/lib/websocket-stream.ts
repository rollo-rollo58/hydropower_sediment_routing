export interface StreamSample {
  sequence: number;
  inflow_m3s: number;
  level_m: number;
}

export function subscribeToReservoirStream(
  onSample: (sample: StreamSample) => void
): () => void {
  if (typeof window === "undefined") return () => undefined;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const socket = new WebSocket(`${base.replace(/^http/, "ws")}/api/ws`);
  socket.onmessage = (event: MessageEvent) => {
    try {
      const sample = JSON.parse(event.data) as StreamSample;
      if (Number.isFinite(sample.level_m)) onSample(sample);
    } catch {
      socket.close();
    }
  };
  return () => socket.close();
}
