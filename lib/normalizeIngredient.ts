import { normalizeIngredient as normalizeRawIngredient } from "./ingredient/normalize";

type DemoItem = {
  id: string;
  name: string;
  normalizedName: string;
};

const ALIAS_MAP: Record<string, string> = {
  all_purpose_flour: "flour",
  allpurpose_flour: "flour",
  apples: "apple",
  black_pepper: "pepper",
  butter_unsalted: "butter",
  butter_salted: "butter",
  carrots: "carrot",
  cheddar_cheese: "cheese",
  chicken_breast: "chicken",
  chicken_breasts: "chicken",
  chicken_thigh: "chicken",
  chicken_thighs: "chicken",
  chopped_tomatoes: "tomatoes",
  chili: "chilli",
  chilli: "chilli",
  chillies: "chilli",
  coriander_seed: "coriander_seeds",
  cumin_seed: "cumin_seeds",
  dried_fenugreek_leaves: "dried_fenugreek",
  eggs: "egg",
  fenugreek: "dried_fenugreek",
  garlic_clove: "garlic",
  garlic_cloves: "garlic",
  ginger_garlic_paste: "ginger_paste",
  green_chillies: "green_chilli",
  heavy_cream: "cream",
  italian_herbs: "italian_seasoning",
  kasuri_methi: "dried_fenugreek",
  olive: "olive_oil",
  onions: "onion",
  parmigianoreggiano: "parmigiano_reggiano",
  parmesan: "parmigiano_reggiano",
  parmesan_cheese: "parmigiano_reggiano",
  penne: "penne_rigate",
  potatoes: "potato",
  red_chile_flakes: "red_chilli_flakes",
  red_chilli_flake: "red_chilli_flakes",
  skim_milk: "milk",
  sour_cream: "cream",
  tomatoes: "tomatoes",
  tomato: "tomatoes",
  vegetable_oil: "vegetable_oil",
  whole_milk: "milk",
  white_sugar: "sugar",
  yoghurt: "yogurt",
};

export const DEMO_ITEMS: DemoItem[] = [
  { id: "apple", name: "Apple", normalizedName: "apple" },
  { id: "basil", name: "Basil", normalizedName: "basil" },
  { id: "bread", name: "Bread", normalizedName: "bread" },
  { id: "butter", name: "Butter", normalizedName: "butter" },
  { id: "carrot", name: "Carrot", normalizedName: "carrot" },
  { id: "cheese", name: "Cheese", normalizedName: "cheese" },
  { id: "chicken", name: "Chicken", normalizedName: "chicken" },
  { id: "chilli", name: "Chilli", normalizedName: "chilli" },
  { id: "chilli_powder", name: "Chilli Powder", normalizedName: "chilli_powder" },
  { id: "coriander_seeds", name: "Coriander Seeds", normalizedName: "coriander_seeds" },
  { id: "cream", name: "Cream", normalizedName: "cream" },
  { id: "cumin_seeds", name: "Cumin Seeds", normalizedName: "cumin_seeds" },
  { id: "dried_fenugreek", name: "Dried Fenugreek", normalizedName: "dried_fenugreek" },
  { id: "egg", name: "Egg", normalizedName: "egg" },
  { id: "flour", name: "Flour", normalizedName: "flour" },
  { id: "garam_masala", name: "Garam Masala", normalizedName: "garam_masala" },
  { id: "garlic", name: "Garlic", normalizedName: "garlic" },
  { id: "ginger_paste", name: "Ginger Paste", normalizedName: "ginger_paste" },
  { id: "green_chilli", name: "Green Chilli", normalizedName: "green_chilli" },
  { id: "italian_seasoning", name: "Italian Seasoning", normalizedName: "italian_seasoning" },
  { id: "milk", name: "Milk", normalizedName: "milk" },
  { id: "olive_oil", name: "Olive Oil", normalizedName: "olive_oil" },
  { id: "onion", name: "Onion", normalizedName: "onion" },
  { id: "parmigiano_reggiano", name: "Parmigiano-Reggiano", normalizedName: "parmigiano_reggiano" },
  { id: "pasta", name: "Pasta", normalizedName: "pasta" },
  { id: "penne_rigate", name: "Penne Rigate", normalizedName: "penne_rigate" },
  { id: "pepper", name: "Black Pepper", normalizedName: "pepper" },
  { id: "potato", name: "Potato", normalizedName: "potato" },
  { id: "red_chilli_flakes", name: "Red Chilli Flakes", normalizedName: "red_chilli_flakes" },
  { id: "rice", name: "Rice", normalizedName: "rice" },
  { id: "salt", name: "Salt", normalizedName: "salt" },
  { id: "sugar", name: "Sugar", normalizedName: "sugar" },
  { id: "tomatoes", name: "Tomatoes", normalizedName: "tomatoes" },
  { id: "turmeric_powder", name: "Turmeric Powder", normalizedName: "turmeric_powder" },
  { id: "vegetable_oil", name: "Vegetable Oil", normalizedName: "vegetable_oil" },
  { id: "water", name: "Water", normalizedName: "water" },
  { id: "yogurt", name: "Yogurt", normalizedName: "yogurt" },
];

const DEMO_ITEM_MAP = new Map(
  DEMO_ITEMS.map((item) => [item.normalizedName, item])
);

export function getCanonicalIngredientName(raw: string): string {
  const normalized = normalizeRawIngredient(raw);
  return ALIAS_MAP[normalized] ?? normalized;
}

export function matchIngredient(
  rawOrNormalizedName: string
): { itemId: string; name: string; normalizedName: string } | null {
  const normalizedName = getCanonicalIngredientName(rawOrNormalizedName);
  const matched = DEMO_ITEM_MAP.get(normalizedName);

  if (!matched) return null;

  return {
    itemId: matched.id,
    name: matched.name,
    normalizedName: matched.normalizedName,
  };
}
