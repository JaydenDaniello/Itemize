import IngredientList from "@/components/recipes/IngredientList";
import type { Ingredient } from "@/types/themealdb";

const ingredients: Ingredient[] = [];

type RecipeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { id } = await params;
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Recipe
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Meal details
        </h1>
        <p className="text-sm text-slate-500">Meal ID: {id}</p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
          <p className="mt-3 text-sm text-slate-600">
            Connect this page to TheMealDB to show a meal image, category, and
            instructions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Ingredients</h2>
          <div className="mt-4">
            <IngredientList ingredients={ingredients} />
          </div>
        </div>
      </section>
    </main>
  );
}
