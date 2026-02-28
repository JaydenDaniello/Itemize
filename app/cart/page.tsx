'use client';

import { useCartStore } from '@/lib/cartStore';
import Link from 'next/link';

export default function CartPage() {
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeItem = useCartStore((state) => state.removeItem);

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
          This page shows all the items you've added from recipes. Once connected to the backend, you'll see quantities,
          estimated prices, and store comparisons.
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
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Browse recipes
            </Link>
            {' '}and add ingredients to your cart.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">
              {cartItems.length} ingredient{cartItems.length !== 1 ? 's' : ''} in cart
            </p>
            <button
              onClick={() => clearCart()}
              className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear cart
            </button>
          </div>

          <div className="grid gap-3">
            {cartItems.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  item.mapped
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-amber-200 bg-amber-50'
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className={`text-sm ${item.mapped ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {item.measure || 'To taste'} {item.mapped && '✓ Matched'}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="ml-4 px-3 py-1 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
