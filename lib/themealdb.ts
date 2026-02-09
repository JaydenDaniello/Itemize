import type {
  MealDBListResponse,
  MealDBLookupResponse,
  MealDetail,
  MealSummary,
  Ingredient,
} from "@/types/themealdb";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

function buildUrl(path: string, params?: Record<string, string>) {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
}

function toMealSummary(meal: MealSummary): MealSummary {
  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
  };
}

function toIngredients(meal: Record<string, unknown>): Ingredient[] {
  const ingredients: Ingredient[] = [];
  for (let index = 1; index <= 20; index += 1) {
    const name = String(meal[`strIngredient${index}`] ?? "").trim();
    const measure = String(meal[`strMeasure${index}`] ?? "").trim();
    if (name) {
      ingredients.push({ name, measure });
    }
  }
  return ingredients;
}

export async function searchMeals(query: string): Promise<MealSummary[]> {
  const url = buildUrl("/search.php", { s: query });
  const response = await fetch(url, { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error("Failed to fetch meals.");
  }
  const data = (await response.json()) as MealDBListResponse;
  return (data.meals ?? []).map(toMealSummary);
}

export async function lookupMeal(id: string): Promise<MealDetail | null> {
  const url = buildUrl("/lookup.php", { i: id });
  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error("Failed to fetch meal details.");
  }
  const data = (await response.json()) as MealDBLookupResponse;
  const meal = data.meals?.[0];
  if (!meal) {
    return null;
  }

  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strCategory: meal.strCategory,
    strArea: meal.strArea,
    strInstructions: meal.strInstructions,
    strYoutube: meal.strYoutube,
    strSource: meal.strSource,
    ingredients: toIngredients(meal as Record<string, unknown>),
  };
}
