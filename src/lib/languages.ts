// Language helpers. Tuma's agent (Gemini) understands dozens of languages, so we never limit the language
// to a fixed list: any valid ISO 639 code is accepted and passed through.

/** "sw-KE" -> "sw". Returns null for anything that is not a language code. */
export function cleanCode(x: unknown): string | null {
  if (typeof x !== "string") return null;
  const c = x.trim().toLowerCase();
  return /^[a-z]{2,3}(-[a-z0-9]{2,8})*$/.test(c) ? c.split("-")[0] : null;
}

/** Any valid language code, or "en". */
export const normLang = (x: unknown) => cleanCode(x) ?? "en";

const NAME_OVERRIDES: Record<string, string> = { pcm: "Nigerian Pidgin" };

/** English name of a language for prompts ("Hausa"). Unknown codes give "English". */
export function languageName(code: unknown): string {
  const c = cleanCode(code);
  if (!c) return "English";
  if (NAME_OVERRIDES[c]) return NAME_OVERRIDES[c];
  try {
    return new Intl.DisplayNames(["en"], { type: "language", fallback: "none" }).of(c) ?? "English";
  } catch {
    return "English";
  }
}
