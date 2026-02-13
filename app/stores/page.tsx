export default function StoresPage() {
  // Placeholder until backend integration
  const stores: any[] = [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Stores
        </p>

        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Compare prices across stores
        </h1>

        <p className="max-w-2xl text-base text-slate-600">
          Once connected to the backend, this page will show store options,
          pricing data, and comparisons to help you find the best deals.
        </p>
      </section>

      {stores.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-medium text-slate-900">
            No stores available yet.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Connect the backend to load store data and price comparisons.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Later: map through stores */}
        </div>
      )}
    </main>
  );
}
