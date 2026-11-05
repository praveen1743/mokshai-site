// Saves a calculator's inputs/outputs so the booking form can attach them.
// sessionStorage only; wrapped in try/catch because storage can be blocked.
export function saveHandoff(tool: string, summary: Record<string, string>) {
  try {
    sessionStorage.setItem('moksh_calc', JSON.stringify({ tool, summary, at: new Date().toISOString() }));
  } catch {
    /* storage unavailable: the booking form simply won't prefill */
  }
}

export function readHandoff(): { tool: string; summary: Record<string, string> } | null {
  try {
    const raw = sessionStorage.getItem('moksh_calc');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === 'function') w.gtag('event', event, params);
}
