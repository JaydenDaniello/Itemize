'use client';

import { useRouter } from "next/navigation";
import type { MealSummary } from "@/types/themealdb";

type MealCardProps = {
  meal: MealSummary;
};

export default function MealCard({ meal }: MealCardProps) {
  const router = useRouter();

  async function handleClick() {
    // Fire ingestion in the background (non-blocking)
    fetch(`/api/recipes/ingest?id=${meal.idMeal}`, {
      method: "POST",
    }).catch(() => {});

    // Navigate immediately
    router.push(`/recipes/${meal.idMeal}`);
  }

  return (
    <div
      onClick={handleClick}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
          {meal.strMeal}
        </h3>
        <span className="text-sm text-slate-500">View recipe details</span>
      </div>
    </div>
  );
}
