import type { Ingredient } from "@/types/themealdb";

type IngredientListProps = {
  ingredients: (Ingredient & { mapped?: boolean; matchedName?: string })[];
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
          <span className="text-right">
            <span className={ingredient.mapped === false ? 'block text-amber-700' : 'block text-slate-500'}>
              {ingredient.measure}
            </span>
            {ingredient.mapped !== undefined && (
              <span className={ingredient.mapped ? 'block text-xs text-emerald-700' : 'block text-xs text-amber-700'}>
                {ingredient.mapped ? 'Matched' : 'Needs review'}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
