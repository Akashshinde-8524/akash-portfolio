/**
 * Ensures an external URL has a protocol (https://) so the browser
 * treats it as an external website instead of a relative local route.
 */
export function formatExternalUrl(url) {
  if (!url) return "";
  const trimmed = String(url).trim();
  if (!trimmed) return "";
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
