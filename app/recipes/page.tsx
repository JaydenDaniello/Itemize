import MealCard from "@/components/recipes/MealCard";
import type { MealSummary } from "@/types/themealdb";

const meals: MealSummary[] = [];

export default function RecipesPage() {
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
          Browse recipes the database of recipes. Use search or filters
          to discover meal ideas in seconds.
        </p>
      </section>

      {meals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-medium text-slate-900">
            No recipes loaded yet.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Connect the list to TheMealDB to fetch data.
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
