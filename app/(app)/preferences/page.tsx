"use client";

import { useEffect, useMemo, useState } from "react";

type OptimizeFor = "cost" | "convenience";

type StorePreferenceItem = {
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
  stores: StorePreferenceItem[];
};

function buildSnapshot(input: {
  optimizeFor: OptimizeFor;
  monthlyBudget: string;
  perTripBudget: string;
  stores: StorePreferenceItem[];
}) {
  return JSON.stringify(input);
}

export default function PreferencesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [optimizeFor, setOptimizeFor] = useState<OptimizeFor>("cost");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [perTripBudget, setPerTripBudget] = useState("");
  const [stores, setStores] = useState<StorePreferenceItem[]>([]);

  const [initialSnapshot, setInitialSnapshot] = useState("");

  async function loadPreferences() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/preferences", {
        credentials: "include",
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(body?.error || "Failed to load preferences");
      }

      const data = body as PreferencesResponse;

      const nextOptimizeFor = data.userPreference.optimizeFor ?? "cost";
      const nextMonthlyBudget = data.userPreference.monthlyBudget ?? "";
      const nextPerTripBudget = data.userPreference.perTripBudget ?? "";
      const nextStores = data.stores;

      setOptimizeFor(nextOptimizeFor);
      setMonthlyBudget(nextMonthlyBudget);
      setPerTripBudget(nextPerTripBudget);
      setStores(nextStores);

      setInitialSnapshot(
        buildSnapshot({
          optimizeFor: nextOptimizeFor,
          monthlyBudget: nextMonthlyBudget,
          perTripBudget: nextPerTripBudget,
          stores: nextStores,
        })
      );
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Could not load preferences");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPreferences();
  }, []);

  const favoriteCount = useMemo(
    () => stores.filter((store) => store.isFavorite).length,
    [stores]
  );

  const excludedCount = useMemo(
    () => stores.filter((store) => store.isExcluded).length,
    [stores]
  );

  const isDirty =
    buildSnapshot({
      optimizeFor,
      monthlyBudget,
      perTripBudget,
      stores,
    }) !== initialSnapshot;

  function updateStorePreference(
    storeId: string,
    field: "isFavorite" | "isExcluded",
    value: boolean
  ) {
    setSuccess("");
    setError("");

    setStores((current) =>
      current.map((store) => {
        if (store.storeId !== storeId) return store;

        if (field === "isFavorite") {
          return {
            ...store,
            isFavorite: value,
            isExcluded: value ? false : store.isExcluded,
          };
        }

        return {
          ...store,
          isExcluded: value,
          isFavorite: value ? false : store.isFavorite,
        };
      })
    );
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    const monthlyValue =
      monthlyBudget.trim() === "" ? null : Number(monthlyBudget);
    const perTripValue =
      perTripBudget.trim() === "" ? null : Number(perTripBudget);

    if (
      (monthlyValue !== null &&
        (!Number.isFinite(monthlyValue) || monthlyValue < 0)) ||
      (perTripValue !== null &&
        (!Number.isFinite(perTripValue) || perTripValue < 0))
    ) {
      setError("Enter valid non-negative budget values.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          optimizeFor,
          monthlyBudget,
          perTripBudget,
          storePreferences: stores
            .filter((store) => store.isFavorite || store.isExcluded)
            .map((store) => ({
              storeId: store.storeId,
              isFavorite: store.isFavorite,
              isExcluded: store.isExcluded,
            })),
        }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(body?.error || "Failed to save preferences");
      }

      setSuccess("Preferences saved.");
      setInitialSnapshot(
        buildSnapshot({
          optimizeFor,
          monthlyBudget,
          perTripBudget,
          stores,
        })
      );
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Could not save preferences");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12">
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm text-slate-600">
          Loading preferences...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Preferences
        </p>

        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Customize your shopping preferences
        </h1>

        <p className="max-w-2xl text-base text-slate-600">
          Set your default budget and preferred stores. These settings can be
          used later to guide cart comparisons and recommendations.
        </p>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Optimize for
          </p>
          <p className="mt-2 text-2xl font-semibold capitalize text-slate-900">
            {optimizeFor}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Favorite stores
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-900">
            {favoriteCount}
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-700">
            Excluded stores
          </p>
          <p className="mt-2 text-2xl font-semibold text-red-900">
            {excludedCount}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
            Account preferences
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            Default shopping settings
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">
            These settings apply to your account and can be used throughout the
            app.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_14rem_14rem]">
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="sr-only">Optimization preference</legend>

            {[
              {
                value: "cost",
                title: "Lowest cost",
                description: "Favor cheaper store outcomes.",
              },
              {
                value: "convenience",
                title: "Convenience",
                description: "Favor simpler shopping trips.",
              },
            ].map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  optimizeFor === option.value
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="optimizeFor"
                  value={option.value}
                  checked={optimizeFor === option.value}
                  onChange={(event) => {
                    setOptimizeFor(event.currentTarget.value as OptimizeFor);
                    setSuccess("");
                    setError("");
                  }}
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
            Monthly budget
            <div className="flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <span className="text-slate-500">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={monthlyBudget}
                onChange={(event) => {
                  setMonthlyBudget(event.currentTarget.value);
                  setSuccess("");
                  setError("");
                }}
                placeholder="Optional"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-900 outline-none"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Per-trip budget
            <div className="flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <span className="text-slate-500">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={perTripBudget}
                onChange={(event) => {
                  setPerTripBudget(event.currentTarget.value);
                  setSuccess("");
                  setError("");
                }}
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
            Store preferences
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            Favorite or exclude stores
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">
            Favorite stores can be prioritized later. Excluded stores can be
            ignored in future comparisons.
          </p>
        </div>

        <div className="mt-5 grid gap-4">
          {stores.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600">
              No stores available.
            </div>
          ) : (
            stores.map((store) => (
              <div
                key={store.storeId}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{store.name}</h3>
                    <p className="mt-1 text-xs text-slate-600">
                      {[store.address, store.city, store.state, store.zip]
                        .filter(Boolean)
                        .join(", ")}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {store.isFavorite && (
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                          Favorite
                        </span>
                      )}
                      {store.isExcluded && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                          Excluded
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={store.isFavorite}
                        onChange={(event) =>
                          updateStorePreference(
                            store.storeId,
                            "isFavorite",
                            event.currentTarget.checked
                          )
                        }
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Favorite
                    </label>

                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={store.isExcluded}
                        onChange={(event) =>
                          updateStorePreference(
                            store.storeId,
                            "isExcluded",
                            event.currentTarget.checked
                          )
                        }
                        className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      Exclude
                    </label>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {(error || success) && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            error
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || success}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {saving ? "Saving..." : "Save preferences"}
        </button>
      </div>
    </main>
  );
}