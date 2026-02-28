/**
 * Ingredient normalization utility
 * Converts raw ingredient names into normalized form for matching
 */

// Synonym map: raw normalized name -> standardized name
const SYNONYM_MAP: Record<string, string> = {
  butter: 'butter',
  'unsalted butter': 'butter',
  'salted butter': 'butter',
  milk: 'milk',
  'whole milk': 'milk',
  'skim milk': 'milk',
  cream: 'cream',
  'heavy cream': 'cream',
  'sour cream': 'cream',
  egg: 'egg',
  eggs: 'egg',
  garlic: 'garlic',
  'garlic clove': 'garlic',
  'garlic cloves': 'garlic',
  onion: 'onion',
  onions: 'onion',
  salt: 'salt',
  pepper: 'pepper',
  'black pepper': 'pepper',
  flour: 'flour',
  'all purpose flour': 'flour',
  sugar: 'sugar',
  'white sugar': 'sugar',
  olive: 'olive oil',
  'olive oil': 'olive oil',
  water: 'water',
  tomato: 'tomato',
  tomatoes: 'tomato',
  cheese: 'cheese',
  oil: 'oil',
};

// Demo items database (hardcoded for now, will need replaced with DB query later)
export const DEMO_ITEMS = [
  { id: '1', name: 'Butter', normalizedName: 'butter' },
  { id: '2', name: 'Milk', normalizedName: 'milk' },
  { id: '3', name: 'Cream', normalizedName: 'cream' },
  { id: '4', name: 'Eggs', normalizedName: 'egg' },
  { id: '5', name: 'Garlic', normalizedName: 'garlic' },
  { id: '6', name: 'Onion', normalizedName: 'onion' },
  { id: '7', name: 'Salt', normalizedName: 'salt' },
  { id: '8', name: 'Black Pepper', normalizedName: 'pepper' },
  { id: '9', name: 'All Purpose Flour', normalizedName: 'flour' },
  { id: '10', name: 'Sugar', normalizedName: 'sugar' },
  { id: '11', name: 'Olive Oil', normalizedName: 'olive oil' },
  { id: '12', name: 'Water', normalizedName: 'water' },
  { id: '13', name: 'Tomato', normalizedName: 'tomato' },
  { id: '14', name: 'Cheese', normalizedName: 'cheese' },
  { id: '15', name: 'Vegetable Oil', normalizedName: 'oil' },
];

/**
 * Normalize an ingredient name for matching
 * - Convert to lowercase
 * - Trim whitespace
 * - Remove punctuation and special characters
 * - Replace common synonyms
 */
export function normalizeIngredient(rawName: string): string {
  let normalized = rawName
    .toLowerCase()
    .trim()
    // Remove punctuation: commas, periods, parentheses, etc.
    .replace(/[.,()!?\-–—]/g, '')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();

  // Check synonym map
  return SYNONYM_MAP[normalized] || normalized;
}

/**
 * Try to match a normalized ingredient name to a known item
 * Returns the matched item or null if no match found
 */
export function matchIngredient(
  normalizedName: string
): { itemId: string; name: string } | null {
  const matched = DEMO_ITEMS.find(
    (item) => item.normalizedName === normalizedName
  );
  return matched ? { itemId: matched.id, name: matched.name } : null;
}
