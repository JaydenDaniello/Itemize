'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { normalizeIngredient } from './normalizeIngredient';

export type CartIngredient = {
  key: string;
  name: string;
  measure: string;
  measures: string[];
  quantity: number;
  mapped: boolean;
  normalizedName: string;
  recipeSources: RecipeSource[];
  matchedName?: string;
  itemId?: string;
};

export type RecipeSource = {
  recipeId: string;
  recipeName: string;
  quantity: number;
  measures: string[];
};

type CartStore = {
  items: CartIngredient[];
  addIngredients: (ingredients: CartIngredient[]) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addIngredients: (ingredients) =>
        set((state) => ({
          items: mergeCartIngredients(state.items, ingredients),
        })),
      removeItem: (index) =>
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'itemize-cart',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Partial<CartStore> | undefined;
        return {
          items: (state?.items ?? []).map(normalizeStoredCartIngredient),
        };
      },
    }
  )
);

function mergeCartIngredients(
  existingItems: CartIngredient[],
  newItems: CartIngredient[]
): CartIngredient[] {
  const merged = new Map<string, CartIngredient>();

  [...existingItems, ...newItems].forEach((item) => {
    const normalizedItem = normalizeStoredCartIngredient(item);
    const existing = merged.get(normalizedItem.normalizedName);

    if (!existing) {
      merged.set(normalizedItem.normalizedName, normalizedItem);
      return;
    }

    const measures = [...existing.measures, ...normalizedItem.measures];

    merged.set(normalizedItem.normalizedName, {
      ...existing,
      key: normalizedItem.normalizedName,
      measure: summarizeMeasures(measures),
      measures,
      quantity: existing.quantity + normalizedItem.quantity,
      recipeSources: mergeRecipeSources(
        existing.recipeSources,
        normalizedItem.recipeSources
      ),
      mapped: existing.mapped || normalizedItem.mapped,
      itemId: existing.itemId ?? normalizedItem.itemId,
      matchedName: existing.matchedName ?? normalizedItem.matchedName,
    });
  });

  return Array.from(merged.values());
}

function normalizeStoredCartIngredient(
  item: Partial<CartIngredient>
): CartIngredient {
  const normalizedName =
    item.normalizedName ?? normalizeIngredient(item.name ?? '');
  const measure = item.measure ?? '';
  const measures = item.measures?.length ? item.measures : [measure];
  const key = normalizedName;
  const recipeSources = item.recipeSources?.length
    ? item.recipeSources
    : [];

  return {
    key,
    name: item.name ?? normalizedName,
    measure: summarizeMeasures(measures),
    measures,
    quantity: item.quantity ?? 1,
    mapped: item.mapped ?? false,
    normalizedName,
    recipeSources,
    matchedName: item.matchedName,
    itemId: item.itemId,
  };
}

function mergeRecipeSources(
  existingSources: RecipeSource[],
  newSources: RecipeSource[]
): RecipeSource[] {
  const sources = new Map<string, RecipeSource>();

  [...existingSources, ...newSources].forEach((source) => {
    const existing = sources.get(source.recipeId);

    if (!existing) {
      sources.set(source.recipeId, source);
      return;
    }

    const measures = [...existing.measures, ...source.measures];

    sources.set(source.recipeId, {
      ...existing,
      quantity: existing.quantity + source.quantity,
      measures,
    });
  });

  return Array.from(sources.values());
}

type ParsedMeasure = {
  amount: number;
  unit: string;
  family: 'mass' | 'volume' | 'count';
  baseAmount: number;
};

const MASS_UNITS: Record<string, number> = {
  g: 1,
  gram: 1,
  grams: 1,
  kg: 1000,
  kilogram: 1000,
  kilograms: 1000,
  oz: 28.3495,
  ounce: 28.3495,
  ounces: 28.3495,
  lb: 453.592,
  lbs: 453.592,
  pound: 453.592,
  pounds: 453.592,
};

const VOLUME_UNITS: Record<string, number> = {
  ml: 1,
  milliliter: 1,
  milliliters: 1,
  l: 1000,
  liter: 1000,
  liters: 1000,
  tsp: 4.92892,
  teaspoon: 4.92892,
  teaspoons: 4.92892,
  tbsp: 14.7868,
  tablespoon: 14.7868,
  tablespoons: 14.7868,
  cup: 236.588,
  cups: 236.588,
  pint: 473.176,
  pints: 473.176,
  quart: 946.353,
  quarts: 946.353,
  gallon: 3785.41,
  gallons: 3785.41,
};

const COUNT_UNITS = new Set([
  'can',
  'cans',
  'clove',
  'cloves',
  'large',
  'medium',
  'small',
  'piece',
  'pieces',
  'slice',
  'slices',
]);

function summarizeMeasures(measures: string[]): string {
  const cleanedMeasures = measures
    .map((measure) => measure.trim())
    .filter(Boolean);

  if (cleanedMeasures.length === 0) return 'To taste';
  if (cleanedMeasures.length === 1) return cleanedMeasures[0];

  const parsedMeasures = cleanedMeasures.map(parseMeasure);
  const firstFamily = parsedMeasures[0]?.family;
  const canConvert =
    firstFamily !== undefined &&
    parsedMeasures.every((measure): measure is ParsedMeasure => {
      return measure !== null && measure.family === firstFamily;
    });

  if (!canConvert) {
    return dedupeMeasures(cleanedMeasures).join(' + ');
  }

  const total = parsedMeasures.reduce(
    (sum, measure) => sum + measure.baseAmount,
    0
  );

  if (firstFamily === 'mass') return formatMass(total);
  if (firstFamily === 'volume') return formatVolume(total);
  return formatAmount(total, parsedMeasures[0].unit);
}

function parseMeasure(measure: string): ParsedMeasure | null {
  const normalizedMeasure = measure
    .toLowerCase()
    .replace(/,/g, '')
    .trim();

  const match = normalizedMeasure.match(
    /^(\d+(?:\.\d+)?|\d+\s+\d+\/\d+|\d+\/\d+)\s*([a-z]+)\b/
  );

  if (!match) return null;

  const amount = parseAmount(match[1]);
  const unit = match[2];

  if (amount === null) return null;

  if (MASS_UNITS[unit]) {
    return {
      amount,
      unit,
      family: 'mass',
      baseAmount: amount * MASS_UNITS[unit],
    };
  }

  if (VOLUME_UNITS[unit]) {
    return {
      amount,
      unit,
      family: 'volume',
      baseAmount: amount * VOLUME_UNITS[unit],
    };
  }

  if (COUNT_UNITS.has(unit)) {
    return {
      amount,
      unit,
      family: 'count',
      baseAmount: amount,
    };
  }

  return null;
}

function parseAmount(value: string): number | null {
  const parts = value.trim().split(/\s+/);

  if (parts.length === 2) {
    const whole = Number(parts[0]);
    const fraction = parseFraction(parts[1]);
    return Number.isFinite(whole) && fraction !== null ? whole + fraction : null;
  }

  if (value.includes('/')) return parseFraction(value);

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function parseFraction(value: string): number | null {
  const [numerator, denominator] = value.split('/').map(Number);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) return null;
  if (denominator === 0) return null;
  return numerator / denominator;
}

function formatMass(grams: number): string {
  if (grams >= 1000) return `${formatNumber(grams / 1000)} kg`;
  return `${formatNumber(grams)} g`;
}

function formatVolume(milliliters: number): string {
  if (milliliters >= 1000) return `${formatNumber(milliliters / 1000)} L`;
  return `${formatNumber(milliliters)} ml`;
}

function formatAmount(amount: number, unit: string): string {
  return `${formatNumber(amount)} ${unit}`;
}

function formatNumber(value: number): string {
  return Number(value.toFixed(2)).toString();
}

function dedupeMeasures(measures: string[]): string[] {
  return Array.from(new Set(measures));
}
