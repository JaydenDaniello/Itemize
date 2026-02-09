import type { Ingredient } from "@/types/themealdb";

type IngredientListProps = {
  ingredients: Ingredient[];
};

export default function IngredientList({ ingredients }: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <p className="text-sm text-slate-500">No ingredients listed.</p>
    );
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {ingredients.map((ingredient) => (
        <li
          key={`${ingredient.name}-${ingredient.measure}`}
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <span className="font-medium text-slate-900">
            {ingredient.name}
          </span>
          <span className="text-slate-500">{ingredient.measure}</span>
        </li>
      ))}
    </ul>
  );
}
