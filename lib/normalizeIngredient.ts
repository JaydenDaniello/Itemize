/**
 * Ingredient normalization utility
 * Converts raw ingredient names into normalized form for matching.
 */

import { normalizeIngredient } from "./ingredient/normalize";

const SYNONYM_MAP: Record<string, string> = {
  apple: 'apple',
  apples: 'apple',
  bacon: 'bacon',
  basil: 'basil',
  beef: 'beef',
  bread: 'bread',
  butter: 'butter',
  'unsalted butter': 'butter',
  'salted butter': 'butter',
  carrot: 'carrot',
  carrots: 'carrot',
  celery: 'celery',
  cheddar: 'cheese',
  'cheddar cheese': 'cheese',
  chicken: 'chicken',
  'chicken breast': 'chicken',
  'chicken breasts': 'chicken',
  'chicken thigh': 'chicken',
  'chicken thighs': 'chicken',
  chilli: 'chili',
  chili: 'chili',
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
  'all-purpose flour': 'flour',
  sugar: 'sugar',
  'white sugar': 'sugar',
  'caster sugar': 'sugar',
  olive: 'olive oil',
  'olive oil': 'olive oil',
  pasta: 'pasta',
  parsley: 'parsley',
  potato: 'potato',
  potatoes: 'potato',
  rice: 'rice',
  water: 'water',
  tomato: 'tomato',
  tomatoes: 'tomato',
  'tomato paste': 'tomato paste',
  'tomato puree': 'tomato puree',
  cheese: 'cheese',
  parmesan: 'cheese',
  'parmesan cheese': 'cheese',
  oil: 'oil',
  'vegetable oil': 'oil',
};

// Demo items database. Replace with a DB query once Chance's item data is seeded.
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
  { id: '16', name: 'Chicken', normalizedName: 'chicken' },
  { id: '17', name: 'Pasta', normalizedName: 'pasta' },
  { id: '18', name: 'Rice', normalizedName: 'rice' },
  { id: '19', name: 'Potato', normalizedName: 'potato' },
  { id: '20', name: 'Carrot', normalizedName: 'carrot' },
  { id: '21', name: 'Celery', normalizedName: 'celery' },
  { id: '22', name: 'Bacon', normalizedName: 'bacon' },
  { id: '23', name: 'Bread', normalizedName: 'bread' },
  { id: '24', name: 'Apple', normalizedName: 'apple' },
  { id: '25', name: 'Basil', normalizedName: 'basil' },
  { id: '26', name: 'Parsley', normalizedName: 'parsley' },
  { id: '27', name: 'Chili', normalizedName: 'chili' },
  { id: '28', name: 'Tomato Paste', normalizedName: 'tomato paste' },
  { id: '29', name: 'Tomato Puree', normalizedName: 'tomato puree' },
];

/**
 * Try to match a normalized ingredient name to a known item.
 */
export function matchIngredient(
  normalizedName: string
): { itemId: string; name: string } | null {
  const matched = DEMO_ITEMS.find(
    (item) => item.normalizedName === normalizedName
  );
  return matched ? { itemId: matched.id, name: matched.name } : null;
}
