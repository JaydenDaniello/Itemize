import { lookupMeal } from "@/lib/themealdb";
import RecipeDetailContent from "./RecipeDetailContent";

type RecipeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { id } = await params;
  const meal = await lookupMeal(id);

  if (!meal) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Recipe
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Meal not found
          </h1>
        </header>
      </main>
    );
  }

  return <RecipeDetailContent meal={meal} />;
}
