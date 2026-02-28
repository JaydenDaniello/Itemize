import type { Ingredient } from "@/types/themealdb";

type IngredientListProps = {
  ingredients: (Ingredient & { mapped?: boolean })[];
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
          className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
            ingredient.mapped === false
              ? 'border-amber-200 bg-amber-50'
              : 'border-slate-200 bg-white'
          }`}
        >
          <span className="font-medium text-slate-900">
            {ingredient.name}
          </span>
          <span className={ingredient.mapped === false ? 'text-amber-700' : 'text-slate-500'}>
            {ingredient.measure}
          </span>
        </li>
      ))}
    </ul>
  );
}
