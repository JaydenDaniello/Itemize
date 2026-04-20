export function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function parseMeasure(measure: string) {
  if (!measure) return { quantity: 1, unit: "unit" };

  const parts = measure.trim().split(" ");
  const quantity = parseFloat(parts[0]);
  const unit = parts.slice(1).join(" ") || "unit";

  return {
    quantity: isNaN(quantity) ? 1 : quantity,
    unit,
  };
}
