import Link from "next/link";
import MealCard from "@/components/recipes/MealCard";
import { searchMeals } from "@/lib/themealdb";
import type { MealSummary } from "@/types/themealdb";

const DEFAULT_SEARCHES = ["Arrabiata", "Carbonara", "Chicken", "Pasta"];

type RecipesPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

function dedupeMeals(meals: MealSummary[]) {
  const seenIds = new Set<string>();
  return meals.filter((meal) => {
    if (seenIds.has(meal.idMeal)) return false;
    seenIds.add(meal.idMeal);
    return true;
  });
}

async function getDefaultMeals() {
  const mealGroups = await Promise.all(
    DEFAULT_SEARCHES.map((query) => searchMeals(query))
  );
  return dedupeMeals(mealGroups.flat()).slice(0, 12);
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim() ?? "";
  const isSearching = query.length > 0;

  let meals: MealSummary[] = [];
  let loadError = false;

  try {
    meals = isSearching ? await searchMeals(query) : await getDefaultMeals();
  } catch (error) {
    console.error("Failed to fetch meals:", error);
    loadError = true;
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
          Search TheMealDB for meal ideas, then add recipe ingredients to your shopping list.
        </p>
      </section>

      <form action="/recipes" className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="recipe-search">
          Search recipes
        </label>
        <input
          id="recipe-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search chicken, pasta, curry..."
          className="min-h-11 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="min-h-11 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Search
          </button>
          {isSearching && (
            <Link
              href="/recipes"
              className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Reset
            </Link>
          )}
        </div>
      </form>

      {isSearching && !loadError && (
        <p className="text-sm text-slate-600">
          {meals.length === 0
            ? `No recipes found for "${query}".`
            : `Showing ${meals.length} recipe${meals.length !== 1 ? "s" : ""} for "${query}".`}
        </p>
      )}

      {loadError ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-medium text-slate-900">
            Recipes are unavailable right now.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            TheMealDB could not be reached. Please try another search in a moment.
          </p>
        </div>
      ) : meals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-medium text-slate-900">
            No recipes found.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Try a broader search like chicken, pasta, beef, or curry.
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
