// Sends a Google tag event when gtag is present (it is only loaded after consent).
export function track(event: string, params: Record<string, unknown> = {}) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === 'function') w.gtag('event', event, params);
}
