import MealCard from "@/components/recipes/MealCard";
import { searchMeals } from "@/lib/themealdb";
import type { MealSummary } from "@/types/themealdb";

export default async function RecipesPage() {
  // Fetch popular meals from TheMealDB
  let meals: MealSummary[] = [];
  try {
    // Try fetching a few different popular recipes
    const aroundTheWorldMeals = await Promise.all([
      searchMeals("Arrabiata"),
      searchMeals("Carbonara"),
      searchMeals("Chicken"),
      searchMeals("Pasta"),
    ]);
    
    // Flatten and deduplicate
    const allMeals = aroundTheWorldMeals.flat();
    const seenIds = new Set<string>();
    meals = allMeals.filter((meal) => {
      if (seenIds.has(meal.idMeal)) return false;
      seenIds.add(meal.idMeal);
      return true;
    }).slice(0, 12); // Limit to 12 meals
  } catch (error) {
    console.error("Failed to fetch meals:", error);
    meals = [];
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Recipes
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Find your next favorite meal
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          Browse recipes from around the world. Click any recipe to see ingredients and instructions.
        </p>
      </section>

      {meals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-medium text-slate-900">
            No recipes loaded yet.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Unable to fetch recipes from TheMealDB. Please try again later.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </main>
  );
}
