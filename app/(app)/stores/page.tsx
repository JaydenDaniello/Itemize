import Link from "next/link";

type Store = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  imageUrl?: string | null;
};

export default async function StoresPage() {
  // Fetch stores from API route
  const stores: Store[] = await fetch("http://localhost:3000/api/stores", {
    cache: "no-store",
  }).then((res) => res.json());

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      {/* Header */}
      <section className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Stores
        </p>

        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Compare prices across stores
        </h1>

        <p className="max-w-2xl text-base text-slate-600">
          Browse available stores. Select one to view its items and pricing.
        </p>
      </section>

      {/* Empty State */}
      {stores.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-medium text-slate-900">
            No stores available yet.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Add stores to your database to populate this page.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/stores/${store.id}`}
              className="rounded-xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {store.imageUrl && (
                <img
                  src={store.imageUrl}
                  alt={store.name}
                  className="h-40 w-full object-cover"
                />
              )}

              <div className="p-4 flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  {store.name}
                </h2>

                <p className="text-sm text-slate-600">
                  {store.address}
                  <br />
                  {store.city}, {store.state} {store.zip}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
