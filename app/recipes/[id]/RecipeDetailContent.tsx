'use client';

import Image from 'next/image';
import { useCartStore, type CartIngredient } from '@/lib/cartStore';
import { normalizeIngredient, matchIngredient } from '@/lib/normalizeIngredient';
import type { MealDetail } from '@/types/themealdb';
import IngredientList from '@/components/recipes/IngredientList';
import { useState } from 'react';

type RecipeDetailContentProps = {
  meal: MealDetail;
};

export default function RecipeDetailContent({ meal }: RecipeDetailContentProps) {
  const addIngredients = useCartStore((state) => state.addIngredients);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    // Normalize and match each ingredient
    const cartIngredients: CartIngredient[] = meal.ingredients.map(
      (ingredient) => {
        const normalized = normalizeIngredient(ingredient.name);
        const matched = matchIngredient(normalized);

        return {
          name: ingredient.name,
          measure: ingredient.measure,
          quantity: 1,
          mapped: !!matched,
          itemId: matched?.itemId,
        };
      }
    );

    // Add to cart store
    addIngredients(cartIngredients);

    // Show feedback
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
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {meal.strCategory}
            </span>
          )}
          {meal.strArea && (
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {meal.strArea}
            </span>
          )}
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Meal Overview */}
        <div className="flex flex-col gap-6">
          {meal.strMealThumb && (
            <div className="relative w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              <Image
                src={meal.strMealThumb}
                alt={meal.strMeal}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                className="object-cover"
              />
            </div>
          )}

          {/* Instructions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Instructions</h2>
            <p className="mt-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {meal.strInstructions}
            </p>
          </div>
        </div>

        {/* Ingredients */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-fit">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Ingredients</h2>
            <button
              onClick={handleAddToCart}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                addedToCart
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {addedToCart ? '✓ Added' : 'Add to Cart'}
            </button>
          </div>
          <div className="mt-4">
            <IngredientList
              ingredients={meal.ingredients.map((ing) => ({
                ...ing,
                mapped: matchIngredient(normalizeIngredient(ing.name)) !== null,
              }))}
            />
          </div>
          {meal.ingredients.length > 0 && (
            <p className="mt-4 text-xs text-slate-500">
              {meal.ingredients.filter((ing) => !matchIngredient(normalizeIngredient(ing.name))).length} unmapped
              ingredient{meal.ingredients.filter((ing) => !matchIngredient(normalizeIngredient(ing.name))).length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
