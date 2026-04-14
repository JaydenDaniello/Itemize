'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/lib/cartStore';

type EditingCartItem = {
  index: number;
  quantity: string;
  measure: string;
} | null;

export default function CartPage() {
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateItem = useCartStore((state) => state.updateItem);
  const [editingItem, setEditingItem] = useState<EditingCartItem>(null);

  const mappedCount = cartItems.filter((item) => item.mapped).length;
  const unmappedCount = cartItems.length - mappedCount;
  const totalIngredientCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Cart
        </p>

        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Review your shopping list
        </h1>

        <p className="max-w-2xl text-base text-slate-600">
          This page collects ingredients from recipes and prepares them for store comparison.
          Matched ingredients can be priced later; unmatched ingredients need a quick review.
        </p>
      </section>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-medium text-slate-900">
            Your cart is empty.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            <Link
              href="/recipes"
              className="font-medium text-emerald-600 hover:text-emerald-700"
            >
              Browse recipes
            </Link>{' '}
            and add ingredients to your cart.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Cart rows
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {cartItems.length}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Ready to price
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-900">
                {mappedCount}
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                Need review
              </p>
              <p className="mt-2 text-2xl font-semibold text-amber-900">
                {unmappedCount}
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Store comparison handoff
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {mappedCount} ingredient{mappedCount !== 1 ? 's are' : ' is'} ready
              for store price matching. {unmappedCount} ingredient
              {unmappedCount !== 1 ? 's need' : ' needs'} a manual match before
              store totals can be trusted.
            </p>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              {totalIngredientCount} ingredient
              {totalIngredientCount !== 1 ? 's' : ''} from selected recipes
            </p>
            <button
              onClick={() => clearCart()}
              className="w-fit rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              Clear cart
            </button>
          </div>

          <div className="grid gap-3">
            {cartItems.map((item, index) => {
              const isEditing = editingItem?.index === index;

              return (
                <div
                  key={item.key ?? `${item.name}-${item.measure}-${index}`}
                  className={`flex flex-col gap-4 rounded-xl border px-4 py-3 sm:flex-row sm:items-start sm:justify-between ${
                    item.mapped
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-amber-200 bg-amber-50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      {item.quantity > 1 && (
                        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600">
                          x{item.quantity}
                        </span>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="mt-3 grid gap-3 sm:grid-cols-[7rem_1fr]">
                        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                          Quantity
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={editingItem.quantity}
                            onChange={(event) =>
                              setEditingItem({
                                ...editingItem,
                                quantity: event.target.value,
                              })
                            }
                            className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                          Measure
                          <input
                            type="text"
                            value={editingItem.measure}
                            onChange={(event) =>
                              setEditingItem({
                                ...editingItem,
                                measure: event.target.value,
                              })
                            }
                            className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          />
                        </label>
                      </div>
                    ) : (
                      <p className={`text-sm ${item.mapped ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {item.measure || 'To taste'} - {item.mapped ? `Matched${item.matchedName ? ` to ${item.matchedName}` : ''}` : 'Needs review'}
                      </p>
                    )}

                    {item.recipeSources.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.recipeSources.map((source) => (
                          <span
                            key={source.recipeId}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                            title={`${source.recipeName}: ${source.measures.join(' + ')}`}
                          >
                            {source.recipeName}
                            <span className="ml-1 text-slate-500">
                              ({source.measures.join(' + ')})
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 sm:ml-4">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="rounded px-3 py-1 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            updateItem(index, {
                              quantity: Number(editingItem.quantity),
                              measure: editingItem.measure,
                            });
                            setEditingItem(null);
                          }}
                          className="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                        >
                          Done
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            setEditingItem({
                              index,
                              quantity: item.quantity.toString(),
                              measure: item.measure,
                            })
                          }
                          className="rounded px-3 py-1 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeItem(index)}
                          className="rounded px-3 py-1 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
