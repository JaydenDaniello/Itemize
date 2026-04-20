import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface StorePageProps {
  params: {
    id: string;
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { id } = await params;
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      storeItems: {
        include: { item: true },
      },
    },
  });

  if (!store) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      {/* Header */}
      <section className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Store
        </p>

        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          {store.name}
        </h1>

        <p className="max-w-2xl text-base text-slate-600">
          Browse items available at this store and compare prices across stores.
        </p>

        <p className="text-xs text-slate-500">
          Prices may vary by location. Values shown are estimates or accurate as of 4/19/2026.
        </p>
      </section>

      {/* Empty State */}
      {store.storeItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-medium text-slate-900">
            No items available for this store.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Add StoreItems in the database to populate this page.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {store.storeItems.map((storeItem) => (
            <div
              key={storeItem.id}
              className="rounded-xl border border-slate-200 p-4 shadow-sm"
            >
              <p className="text-lg font-medium text-slate-900">
                {storeItem.item.name}
              </p>

              <p className="mt-2 text-emerald-600 font-semibold text-xl">
                ${storeItem.price.toFixed(2)}
              </p>

              {/* Optional: Add to cart button */}
              {/* <button className="mt-4 w-full rounded-lg bg-emerald-600 py-2 text-white font-medium hover:bg-emerald-700">
                Add to Cart
              </button> */}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
