'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import {
  usePreferencesStore,
  type OptimizeFor,
} from '@/lib/preferencesStore';
import type { CartIngredient } from '@/lib/cartStore';
import { normalizeIngredient } from '@/lib/ingredient/normalize';

type EditingCartItem = {
  index: number;
  quantity: string;
  measure: string;
} | null;

type RawStore = {
  id?: string;
  storeId?: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  isFavorite?: boolean;
  isExcluded?: boolean;
};

type Store = {
  storeId: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  isFavorite: boolean;
  isExcluded: boolean;
};

type PreferencesResponse = {
  userPreference: {
    optimizeFor: OptimizeFor;
    monthlyBudget: string | null;
    perTripBudget: string | null;
  };
  stores: RawStore[];
};

type CartResponse = {
  cart: {
    id: string;
    ownerId: string;
    storeId: string | null;
    status: 'ACTIVE' | 'CHECKED_OUT' | 'ARCHIVED';
  };
  items: Array<{
    id: string;
    itemId: string;
    name: string;
    quantity: number;
    unit: string | null;
  }>;
};

export default function CartPage() {
  const cartItems = useCartStore((state) => state.items);
  const setItems = useCartStore((state) => state.setItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateItem = useCartStore((state) => state.updateItem);

  const optimizeFor = usePreferencesStore((state) => state.optimizeFor);
  const perTripBudget = usePreferencesStore((state) => state.perTripBudget);
  const setOptimizeFor = usePreferencesStore((state) => state.setOptimizeFor);
  const setPerTripBudget = usePreferencesStore(
    (state) => state.setPerTripBudget
  );

  const [editingItem, setEditingItem] = useState<EditingCartItem>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [storesError, setStoresError] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState('');

  const mappedCount = cartItems.filter((item) => item.mapped).length;
  const unmappedCount = cartItems.length - mappedCount;

  const readyItems = cartItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.mapped);

  const reviewItems = cartItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.mapped);

  const totalIngredientCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const selectedStore =
    stores.find((store) => store.storeId === selectedStoreId) ?? stores[0];

  useEffect(() => {
    let cancelled = false;

    async function loadCartPreferences() {
      setStoresLoading(true);
      setStoresError(false);

      try {
        const response = await fetch('/api/preferences', {
          credentials: 'include',
        });

        const body = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(body?.error || 'Failed to load preferences');
        }

        const data = body as PreferencesResponse;

        const normalizedStores: Store[] = data.stores
          .map((store) => {
            const resolvedStoreId = store.storeId ?? store.id;

            if (!resolvedStoreId) {
              return null;
            }

            return {
              storeId: resolvedStoreId,
              name: store.name,
              address: store.address,
              city: store.city,
              state: store.state,
              zip: store.zip,
              isFavorite: store.isFavorite ?? false,
              isExcluded: store.isExcluded ?? false,
            };
          })
          .filter((store): store is Store => store !== null);

        const uniqueStores = Array.from(
          new Map(
            normalizedStores.map((store) => [store.storeId, store])
          ).values()
        );

        const availableStores = uniqueStores
          .filter((store) => !store.isExcluded)
          .sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));

        if (!cancelled) {
          setOptimizeFor(data.userPreference.optimizeFor ?? 'cost');
          setPerTripBudget(data.userPreference.perTripBudget ?? '');
          setStores(availableStores);

          setSelectedStoreId((currentStoreId) => {
            if (
              currentStoreId &&
              availableStores.some((store) => store.storeId === currentStoreId)
            ) {
              return currentStoreId;
            }

            return availableStores[0]?.storeId ?? '';
          });
        }
      } catch (error) {
        console.error('Failed to load cart preferences:', error);
        if (!cancelled) setStoresError(true);
      } finally {
        if (!cancelled) setStoresLoading(false);
      }
    }

    void loadCartPreferences();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAccountCart() {
      try {
        const response = await fetch('/api/cart', {
          credentials: 'include',
        });

        const body = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(body?.error || 'Failed to load cart');
        }

        const data = body as CartResponse;

        const hydratedItems: CartIngredient[] = data.items.map((item) => {
          const measure = item.unit?.trim() || 'To taste';

          return {
            key: item.id,
            name: item.name,
            measure,
            measures: [measure],
            quantity: item.quantity,
            mapped: true,
            normalizedName: normalizeIngredient(item.name),
            recipeSources: [],
            matchedName: item.name,
            itemId: item.itemId,
          };
        });

        if (!cancelled) {
          setItems(hydratedItems);
        }
      } catch (error) {
        console.error('Failed to load account cart:', error);
      }
    }

    void loadAccountCart();

    return () => {
      cancelled = true;
    };
  }, []);

  const renderCartItem = (item: CartIngredient, index: number) => {
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
            <p
              className={`text-sm ${
                item.mapped ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {item.measure || 'To taste'} -{' '}
              {item.mapped
                ? `Matched${item.matchedName ? ` to ${item.matchedName}` : ''}`
                : 'Needs review'}
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
  };

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
          This page collects ingredients from recipes and prepares them for
          store comparison. Matched ingredients can be priced later; unmatched
          ingredients need a quick review.
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

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Shopping preferences
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                Tune the next store comparison
              </h2>
              <p className="max-w-2xl text-sm text-slate-600">
                These settings are loaded from your saved account preferences and
                can be adjusted here for this shopping session.
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_14rem]">
              <fieldset className="grid gap-3 sm:grid-cols-2">
                <legend className="sr-only">Optimization preference</legend>
                {[
                  {
                    value: 'cost',
                    title: 'Lowest cost',
                    description:
                      'Favor stores with the cheapest estimated cart total.',
                  },
                  {
                    value: 'convenience',
                    title: 'Fewest stops',
                    description: 'Favor plans that keep the shopping trip simple.',
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      optimizeFor === option.value
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="optimizeFor"
                      value={option.value}
                      checked={optimizeFor === option.value}
                      onChange={(event) =>
                        setOptimizeFor(event.currentTarget.value as OptimizeFor)
                      }
                      className="sr-only"
                    />
                    <span className="block text-sm font-semibold text-slate-900">
                      {option.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate-600">
                      {option.description}
                    </span>
                  </label>
                ))}
              </fieldset>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Trip budget
                <div className="flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                  <span className="text-slate-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="decimal"
                    value={perTripBudget}
                    onChange={(event) =>
                      setPerTripBudget(event.currentTarget.value)
                    }
                    placeholder="Optional"
                    className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-900 outline-none"
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Store comparison
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                Compare this cart across stores
              </h2>
              <p className="max-w-2xl text-sm text-slate-600">
                Store totals will use seeded prices when they are connected. For
                now, stores reflect your saved favorites and exclusions.
              </p>
            </div>

            {storesLoading ? (
              <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                Loading stores for comparison...
              </div>
            ) : storesError ? (
              <div className="mt-5 rounded-xl border border-dashed border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700">
                Preferences or stores could not be loaded.
              </div>
            ) : stores.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-amber-200 bg-amber-50 px-4 py-5 text-sm text-amber-800">
                No stores are currently available for comparison. Check your
                excluded stores in Preferences.
              </div>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {stores.map((store) => (
                  <div
                    key={store.storeId}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {store.name}
                          </h3>
                          {store.isFavorite && (
                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                              Favorite
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-600">
                          {[store.address, store.city, store.state, store.zip]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                        Pending
                      </span>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-xs font-medium text-slate-500">
                          Ready items
                        </dt>
                        <dd className="font-semibold text-emerald-700">
                          {mappedCount}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-slate-500">
                          Missing
                        </dt>
                        <dd className="font-semibold text-amber-700">
                          {unmappedCount}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-slate-500">
                          Preference
                        </dt>
                        <dd className="font-semibold capitalize text-slate-900">
                          {store.isFavorite ? 'Favorite' : optimizeFor}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-slate-500">
                          Est. total
                        </dt>
                        <dd className="font-semibold text-slate-900">
                          Awaiting prices
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Routing and distance
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                Maps data will complete the trip plan
              </h2>
              <p className="max-w-2xl text-sm text-slate-600">
                This area is reserved for Google Maps distance, drive time, and
                route planning once routing is implemented.
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[16rem_1fr]">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Route target
                <select
                  value={selectedStore?.storeId ?? ''}
                  onChange={(event) => setSelectedStoreId(event.currentTarget.value)}
                  disabled={stores.length === 0}
                  className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {stores.length === 0 ? (
                    <option value="">No stores loaded</option>
                  ) : (
                    stores.map((store) => (
                      <option key={store.storeId} value={store.storeId}>
                        {store.name}
                      </option>
                    ))
                  )}
                </select>
              </label>

              <dl className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Distance
                  </dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-900">
                    Pending Maps
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Drive time
                  </dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-900">
                    Pending Maps
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Route
                  </dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-900">
                    Not planned
                  </dd>
                </div>
              </dl>
            </div>
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

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Ready to price
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  Matched ingredients
                </h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                {readyItems.length}
              </span>
            </div>

            {readyItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-5 text-sm text-emerald-800">
                No matched ingredients yet.
              </div>
            ) : (
              <div className="grid gap-3">
                {readyItems.map(({ item, index }) => renderCartItem(item, index))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">
                  Needs review
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  Unmatched ingredients
                </h2>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                {reviewItems.length}
              </span>
            </div>

            {reviewItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50 px-4 py-5 text-sm text-amber-800">
                Everything in this cart is ready for pricing.
              </div>
            ) : (
              <div className="grid gap-3">
                {reviewItems.map(({ item, index }) => renderCartItem(item, index))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}