/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg(process.env.DATABASE_URL ?? "");
const prisma = new PrismaClient({ adapter });

const DEMO_STORES = [
  {
    slug: "aldi",
    name: "Aldi",
    address: "2451 S Hiawassee Rd",
    city: "Orlando",
    state: "FL",
    zip: "32835",
  },
  {
    slug: "walmart",
    name: "Walmart",
    address: "8990 Turkey Lake Rd",
    city: "Orlando",
    state: "FL",
    zip: "32819",
  },
  {
    slug: "whole-foods",
    name: "Whole Foods",
    address: "8003 Turkey Lake Rd",
    city: "Orlando",
    state: "FL",
    zip: "32819",
  },
];

const DEMO_ITEMS = [
  {
    id: "apple",
    normalizedName: "apple",
    name: "Apple",
    category: "produce",
    defaultUnit: "each",
    prices: { aldi: 0.79, walmart: 0.89, "whole-foods": 1.29 },
  },
  {
    id: "basil",
    normalizedName: "basil",
    name: "Basil",
    category: "produce",
    defaultUnit: "leaves",
    prices: { aldi: 1.49, walmart: 1.79, "whole-foods": 2.49 },
  },
  {
    id: "bread",
    normalizedName: "bread",
    name: "Bread",
    category: "bakery",
    defaultUnit: "loaf",
    prices: { aldi: 1.89, walmart: 2.19, "whole-foods": 3.99 },
  },
  {
    id: "butter",
    normalizedName: "butter",
    name: "Butter",
    category: "dairy",
    defaultUnit: "stick",
    prices: { aldi: 3.49, walmart: 3.89, "whole-foods": 4.99 },
  },
  {
    id: "carrot",
    normalizedName: "carrot",
    name: "Carrot",
    category: "produce",
    defaultUnit: "lb",
    prices: { aldi: 1.29, walmart: 1.49, "whole-foods": 2.19 },
  },
  {
    id: "cheese",
    normalizedName: "cheese",
    name: "Cheese",
    category: "dairy",
    defaultUnit: "oz",
    prices: { aldi: 2.69, walmart: 2.99, "whole-foods": 4.49 },
  },
  {
    id: "chicken",
    normalizedName: "chicken",
    name: "Chicken",
    category: "protein",
    defaultUnit: "lb",
    prices: { aldi: 6.99, walmart: 7.49, "whole-foods": 10.99 },
  },
  {
    id: "chilli",
    normalizedName: "chilli",
    name: "Chilli",
    category: "produce",
    defaultUnit: "each",
    prices: { aldi: 0.89, walmart: 0.99, "whole-foods": 1.49 },
  },
  {
    id: "chilli_powder",
    normalizedName: "chilli_powder",
    name: "Chilli Powder",
    category: "spice",
    defaultUnit: "jar",
    prices: { aldi: 1.79, walmart: 1.99, "whole-foods": 3.29 },
  },
  {
    id: "coriander_seeds",
    normalizedName: "coriander_seeds",
    name: "Coriander Seeds",
    category: "spice",
    defaultUnit: "jar",
    prices: { aldi: 1.69, walmart: 1.89, "whole-foods": 3.19 },
  },
  {
    id: "cream",
    normalizedName: "cream",
    name: "Cream",
    category: "dairy",
    defaultUnit: "cup",
    prices: { aldi: 2.29, walmart: 2.49, "whole-foods": 3.79 },
  },
  {
    id: "cumin_seeds",
    normalizedName: "cumin_seeds",
    name: "Cumin Seeds",
    category: "spice",
    defaultUnit: "jar",
    prices: { aldi: 1.59, walmart: 1.79, "whole-foods": 2.99 },
  },
  {
    id: "dried_fenugreek",
    normalizedName: "dried_fenugreek",
    name: "Dried Fenugreek",
    category: "spice",
    defaultUnit: "jar",
    prices: { aldi: 1.99, walmart: 2.29, "whole-foods": 3.79 },
  },
  {
    id: "egg",
    normalizedName: "egg",
    name: "Egg",
    category: "dairy",
    defaultUnit: "dozen",
    prices: { aldi: 2.49, walmart: 2.79, "whole-foods": 4.19 },
  },
  {
    id: "flour",
    normalizedName: "flour",
    name: "Flour",
    category: "pantry",
    defaultUnit: "bag",
    prices: { aldi: 2.19, walmart: 2.39, "whole-foods": 3.69 },
  },
  {
    id: "garam_masala",
    normalizedName: "garam_masala",
    name: "Garam Masala",
    category: "spice",
    defaultUnit: "jar",
    prices: { aldi: 1.99, walmart: 2.29, "whole-foods": 3.59 },
  },
  {
    id: "garlic",
    normalizedName: "garlic",
    name: "Garlic",
    category: "produce",
    defaultUnit: "bulb",
    prices: { aldi: 0.69, walmart: 0.79, "whole-foods": 1.19 },
  },
  {
    id: "ginger_paste",
    normalizedName: "ginger_paste",
    name: "Ginger Paste",
    category: "pantry",
    defaultUnit: "tube",
    prices: { aldi: 2.49, walmart: 2.79, "whole-foods": 4.29 },
  },
  {
    id: "green_chilli",
    normalizedName: "green_chilli",
    name: "Green Chilli",
    category: "produce",
    defaultUnit: "each",
    prices: { aldi: 0.89, walmart: 1.09, "whole-foods": 1.59 },
  },
  {
    id: "italian_seasoning",
    normalizedName: "italian_seasoning",
    name: "Italian Seasoning",
    category: "spice",
    defaultUnit: "jar",
    prices: { aldi: 1.59, walmart: 1.79, "whole-foods": 2.99 },
  },
  {
    id: "milk",
    normalizedName: "milk",
    name: "Milk",
    category: "dairy",
    defaultUnit: "gallon",
    prices: { aldi: 3.19, walmart: 3.39, "whole-foods": 4.89 },
  },
  {
    id: "olive_oil",
    normalizedName: "olive_oil",
    name: "Olive Oil",
    category: "pantry",
    defaultUnit: "bottle",
    prices: { aldi: 5.49, walmart: 5.99, "whole-foods": 8.99 },
  },
  {
    id: "onion",
    normalizedName: "onion",
    name: "Onion",
    category: "produce",
    defaultUnit: "lb",
    prices: { aldi: 1.19, walmart: 1.39, "whole-foods": 2.19 },
  },
  {
    id: "parmigiano_reggiano",
    normalizedName: "parmigiano_reggiano",
    name: "Parmigiano-Reggiano",
    category: "dairy",
    defaultUnit: "wedge",
    prices: { aldi: 4.49, walmart: 4.99, "whole-foods": 7.99 },
  },
  {
    id: "pasta",
    normalizedName: "pasta",
    name: "Pasta",
    category: "pantry",
    defaultUnit: "box",
    prices: { aldi: 1.29, walmart: 1.49, "whole-foods": 2.49 },
  },
  {
    id: "penne_rigate",
    normalizedName: "penne_rigate",
    name: "Penne Rigate",
    category: "pantry",
    defaultUnit: "box",
    prices: { aldi: 1.39, walmart: 1.59, "whole-foods": 2.69 },
  },
  {
    id: "pepper",
    normalizedName: "pepper",
    name: "Black Pepper",
    category: "spice",
    defaultUnit: "jar",
    prices: { aldi: 1.79, walmart: 1.99, "whole-foods": 3.29 },
  },
  {
    id: "potato",
    normalizedName: "potato",
    name: "Potato",
    category: "produce",
    defaultUnit: "lb",
    prices: { aldi: 0.99, walmart: 1.19, "whole-foods": 1.99 },
  },
  {
    id: "red_chilli_flakes",
    normalizedName: "red_chilli_flakes",
    name: "Red Chilli Flakes",
    category: "spice",
    defaultUnit: "jar",
    prices: { aldi: 1.59, walmart: 1.79, "whole-foods": 2.99 },
  },
  {
    id: "rice",
    normalizedName: "rice",
    name: "Rice",
    category: "pantry",
    defaultUnit: "bag",
    prices: { aldi: 2.29, walmart: 2.59, "whole-foods": 3.99 },
  },
  {
    id: "salt",
    normalizedName: "salt",
    name: "Salt",
    category: "spice",
    defaultUnit: "canister",
    prices: { aldi: 0.89, walmart: 0.99, "whole-foods": 1.79 },
  },
  {
    id: "sugar",
    normalizedName: "sugar",
    name: "Sugar",
    category: "pantry",
    defaultUnit: "bag",
    prices: { aldi: 2.39, walmart: 2.59, "whole-foods": 3.99 },
  },
  {
    id: "tomatoes",
    normalizedName: "tomatoes",
    name: "Tomatoes",
    category: "produce",
    defaultUnit: "can",
    prices: { aldi: 1.49, walmart: 1.69, "whole-foods": 2.49 },
  },
  {
    id: "turmeric_powder",
    normalizedName: "turmeric_powder",
    name: "Turmeric Powder",
    category: "spice",
    defaultUnit: "jar",
    prices: { aldi: 1.69, walmart: 1.89, "whole-foods": 3.19 },
  },
  {
    id: "vegetable_oil",
    normalizedName: "vegetable_oil",
    name: "Vegetable Oil",
    category: "pantry",
    defaultUnit: "bottle",
    prices: { aldi: 3.49, walmart: 3.79, "whole-foods": 5.49 },
  },
  {
    id: "water",
    normalizedName: "water",
    name: "Water",
    category: "beverage",
    defaultUnit: "gallon",
    prices: { aldi: 0.99, walmart: 1.09, "whole-foods": 1.69 },
  },
  {
    id: "yogurt",
    normalizedName: "yogurt",
    name: "Yogurt",
    category: "dairy",
    defaultUnit: "tub",
    prices: { aldi: 2.99, walmart: 3.29, "whole-foods": 4.79 },
  },
];

const DEMO_RECIPES = [
  {
    externalId: "52771",
    title: "Spicy Arrabiata Penne",
    ingredients: [
      { rawName: "penne rigate", measure: "1 pound", normalizedName: "penne_rigate" },
      { rawName: "olive oil", measure: "1/4 cup", normalizedName: "olive_oil" },
      { rawName: "garlic", measure: "3 cloves", normalizedName: "garlic" },
      { rawName: "chopped tomatoes", measure: "1 tin", normalizedName: "tomatoes" },
      { rawName: "red chilli flakes", measure: "1/2 teaspoon", normalizedName: "red_chilli_flakes" },
      { rawName: "italian seasoning", measure: "1/2 teaspoon", normalizedName: "italian_seasoning" },
      { rawName: "basil", measure: "6 leaves", normalizedName: "basil" },
      { rawName: "Parmigiano-Reggiano", measure: "sprinkling", normalizedName: "parmigiano_reggiano" },
    ],
  },
  {
    externalId: "52795",
    title: "Chicken Handi",
    ingredients: [
      { rawName: "Chicken", measure: "1.2 kg", normalizedName: "chicken" },
      { rawName: "Onion", measure: "5 thinly sliced", normalizedName: "onion" },
      { rawName: "Tomatoes", measure: "2 finely chopped", normalizedName: "tomatoes" },
      { rawName: "Garlic", measure: "8 cloves chopped", normalizedName: "garlic" },
      { rawName: "Ginger paste", measure: "1 tbsp", normalizedName: "ginger_paste" },
      { rawName: "Vegetable oil", measure: "1/4 cup", normalizedName: "vegetable_oil" },
      { rawName: "Cumin seeds", measure: "2 tsp", normalizedName: "cumin_seeds" },
      { rawName: "Coriander seeds", measure: "3 tsp", normalizedName: "coriander_seeds" },
      { rawName: "Turmeric powder", measure: "1 tsp", normalizedName: "turmeric_powder" },
      { rawName: "Chilli powder", measure: "1 tsp", normalizedName: "chilli_powder" },
      { rawName: "Green chilli", measure: "2", normalizedName: "green_chilli" },
      { rawName: "Yogurt", measure: "1 cup", normalizedName: "yogurt" },
      { rawName: "Cream", measure: "3/4 cup", normalizedName: "cream" },
      { rawName: "fenugreek", measure: "3 tsp Dried", normalizedName: "dried_fenugreek" },
      { rawName: "Garam masala", measure: "1 tsp", normalizedName: "garam_masala" },
      { rawName: "Salt", measure: "To taste", normalizedName: "salt" },
    ],
  },
];

function parseMeasure(measure) {
  if (!measure || typeof measure !== "string") {
    return { quantity: null, unit: null };
  }

  const trimmed = measure.trim();

  if (!trimmed || trimmed.toLowerCase() === "to taste") {
    return { quantity: null, unit: trimmed || null };
  }

  const match = trimmed.match(
    /^(\d+(?:\.\d+)?|\d+\s+\d+\/\d+|\d+\/\d+)\s*(.*)$/
  );

  if (!match) {
    return { quantity: null, unit: trimmed };
  }

  const quantity = parseAmount(match[1]);
  const unit = match[2]?.trim() || null;

  return {
    quantity,
    unit,
  };
}

function parseAmount(input) {
  if (!input) return null;

  const parts = input.trim().split(/\s+/);

  if (parts.length === 2 && parts[1].includes("/")) {
    const whole = Number(parts[0]);
    const fraction = parseFraction(parts[1]);
    return Number.isFinite(whole) && fraction !== null ? whole + fraction : null;
  }

  if (input.includes("/")) {
    return parseFraction(input);
  }

  const value = Number(input);
  return Number.isFinite(value) ? value : null;
}

function parseFraction(input) {
  const [numerator, denominator] = input.split("/").map(Number);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return null;
  }

  return numerator / denominator;
}

async function seedStores() {
  const storesBySlug = new Map();

  for (const store of DEMO_STORES) {
    const seeded = await prisma.store.upsert({
      where: { slug: store.slug },
      update: {
        name: store.name,
        address: store.address,
        city: store.city,
        state: store.state,
        zip: store.zip,
      },
      create: store,
    });

    storesBySlug.set(store.slug, seeded);
  }

  return storesBySlug;
}

async function seedItems() {
  const itemsByNormalizedName = new Map();

  for (const item of DEMO_ITEMS) {
    const seeded = await prisma.item.upsert({
      where: { normalizedName: item.normalizedName },
      update: {
        name: item.name,
        category: item.category,
        defaultUnit: item.defaultUnit,
      },
      create: {
        id: item.id,
        name: item.name,
        normalizedName: item.normalizedName,
        category: item.category,
        defaultUnit: item.defaultUnit,
      },
    });

    itemsByNormalizedName.set(item.normalizedName, seeded);
  }

  return itemsByNormalizedName;
}

async function seedStoreItems(storesBySlug, itemsByNormalizedName) {
  for (const item of DEMO_ITEMS) {
    const itemRow = itemsByNormalizedName.get(item.normalizedName);

    for (const [slug, price] of Object.entries(item.prices)) {
      const store = storesBySlug.get(slug);

      await prisma.storeItem.upsert({
        where: {
          storeId_itemId: {
            storeId: store.id,
            itemId: itemRow.id,
          },
        },
        update: {
          price,
          currency: "USD",
          isEstimated: true,
          userConfirmed: false,
          lastUpdated: new Date(),
        },
        create: {
          storeId: store.id,
          itemId: itemRow.id,
          price,
          currency: "USD",
          isEstimated: true,
          userConfirmed: false,
        },
      });
    }
  }
}

async function seedRecipes(itemsByNormalizedName) {
  for (const recipe of DEMO_RECIPES) {
    const seededRecipe = await prisma.recipe.upsert({
      where: { externalId: recipe.externalId },
      update: {
        title: recipe.title,
        source: "themealdb",
      },
      create: {
        externalId: recipe.externalId,
        title: recipe.title,
        source: "themealdb",
      },
    });

    for (const ingredient of recipe.ingredients) {
      const item = itemsByNormalizedName.get(ingredient.normalizedName);
      const { quantity, unit } = parseMeasure(ingredient.measure);

      await prisma.recipeIngredient.upsert({
        where: {
          recipeId_rawName: {
            recipeId: seededRecipe.id,
            rawName: ingredient.rawName,
          },
        },
        update: {
          quantity,
          unit,
          itemId: item?.id ?? null,
        },
        create: {
          recipeId: seededRecipe.id,
          rawName: ingredient.rawName,
          quantity,
          unit,
          itemId: item?.id ?? null,
        },
      });
    }
  }
}

async function main() {
  const storesBySlug = await seedStores();
  const itemsByNormalizedName = await seedItems();
  await seedStoreItems(storesBySlug, itemsByNormalizedName);
  await seedRecipes(itemsByNormalizedName);

  console.log(
    `Seeded ${DEMO_STORES.length} demo stores, ${DEMO_ITEMS.length} demo items, and ${DEMO_RECIPES.length} demo recipes.`
  );
}

main()
  .catch((error) => {
    console.error("Failed to seed demo data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
