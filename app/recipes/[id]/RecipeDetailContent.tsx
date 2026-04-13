'use client';

import Image from 'next/image';
import { useState } from 'react';
import IngredientList from '@/components/recipes/IngredientList';
import { useCartStore, type CartIngredient } from '@/lib/cartStore';
import { matchIngredient, normalizeIngredient } from '@/lib/normalizeIngredient';
import type { MealDetail } from '@/types/themealdb';

type RecipeDetailContentProps = {
  meal: MealDetail;
};

export default function RecipeDetailContent({ meal }: RecipeDetailContentProps) {
  const addIngredients = useCartStore((state) => state.addIngredients);
  const [addedToCart, setAddedToCart] = useState(false);

  const ingredients = meal.ingredients.map((ingredient) => {
    const normalizedName = normalizeIngredient(ingredient.name);
    const matched = matchIngredient(normalizedName);
    const measure = ingredient.measure || 'To taste';

    return {
      ...ingredient,
      measure,
      normalizedName,
      mapped: matched !== null,
      matchedName: matched?.name,
      itemId: matched?.itemId,
      key: normalizedName,
    };
  });

  const unmappedCount = ingredients.filter((ingredient) => !ingredient.mapped).length;

  const handleAddToCart = () => {
    const cartIngredients: CartIngredient[] = ingredients.map((ingredient) => ({
      key: ingredient.key,
      name: ingredient.name,
      measure: ingredient.measure,
      measures: [ingredient.measure],
      quantity: 1,
      mapped: ingredient.mapped,
      normalizedName: ingredient.normalizedName,
      recipeSources: [
        {
          recipeId: meal.idMeal,
          recipeName: meal.strMeal,
          quantity: 1,
          measures: [ingredient.measure],
        },
      ],
      matchedName: ingredient.matchedName,
      itemId: ingredient.itemId,
    }));

    addIngredients(cartIngredients);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Recipe
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          {meal.strMeal}
        </h1>
        <div className="flex flex-wrap gap-3">
          {meal.strCategory && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {meal.strCategory}
            </span>
          )}
          {meal.strArea && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {meal.strArea}
            </span>
          )}
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-6">
          {meal.strMealThumb && (
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <Image
                src={meal.strMealThumb}
                alt={meal.strMeal}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                className="object-cover"
              />
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Instructions</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {meal.strInstructions}
            </p>
          </div>
        </div>

        <div className="flex h-fit flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Ingredients</h2>
              <p className="mt-1 text-xs text-slate-500">
                {ingredients.length - unmappedCount} matched, {unmappedCount} need review
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                addedToCart
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {addedToCart ? 'Added' : 'Add to Cart'}
            </button>
          </div>
          <div className="mt-4">
            <IngredientList ingredients={ingredients} />
          </div>
          {ingredients.length > 0 && (
            <p className="mt-4 text-xs text-slate-500">
              {unmappedCount} unmapped ingredient{unmappedCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
