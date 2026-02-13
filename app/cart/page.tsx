export default function CartPage() {
  // For now, your cart is empty. Later this will come from your backend.
  const cartItems: any[] = [];

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
          This page will show all the items you’ve added from recipes or manual
          selections. Once connected to the backend, you’ll see quantities,
          estimated prices, and store comparisons.
        </p>
      </section>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-medium text-slate-900">
            Your cart is empty.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Add ingredients from a recipe or search for items to begin building
            your list.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Later: map through cart items */}
        </div>
      )}
    </main>
  );
}
