/**
 * Neutralise dangerous URL schemes before a value reaches an <a href> / src.
 *
 * CMS-controlled fields (banner ctaHref, social links in site settings) are
 * attacker-influenced: a stored value like `javascript:...`, `data:text/html,…`
 * or `vbscript:…` would execute script when placed in an href. This allow-lists
 * safe schemes and blocks everything else, defending visitors even if a
 * malicious value is already stored in the database.
 */
export function safeUrl(url: string | null | undefined): string {
  if (!url) return "";
  const raw = String(url).trim();

  // Strip control chars / whitespace attackers use to obfuscate schemes
  // (e.g. "java\tscript:", " javascript:") before inspecting the scheme.
  const deobfuscated = Array.from(raw)
    .filter((ch) => ch.charCodeAt(0) > 0x20)
    .join("")
    .toLowerCase();

  // Explicitly block known script-capable / data schemes.
  if (/^(javascript|data|vbscript|file|blob):/.test(deobfuscated)) return "";

  // Allow the safe explicit schemes.
  if (/^(https?:|mailto:|tel:)/i.test(raw)) return raw;

  // Any *other* explicit scheme (foo:) → block.
  if (/^[a-z][a-z0-9+.-]*:/.test(deobfuscated)) return "";

  // No scheme → relative path, /path, ./path, #anchor, protocol-relative → safe.
  return raw;
}
