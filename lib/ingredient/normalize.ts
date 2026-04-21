export function normalizeIngredient(raw: string) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[.,()!?]/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, "_");
}
