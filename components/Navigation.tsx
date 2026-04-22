'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { logoutUser } from '@/lib/auth/client';

const navItems = [
  { href: '/home', label: 'Home' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/cart', label: 'Cart' },
  { href: '/stores', label: 'Stores' },
  {href: '/preferences', label: 'Preferences' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const cartItemCount = useCartStore((state) => state.items.length);

  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href: string) => {
    if (href === '/home') {
      return pathname === '/home';
    }
    return pathname.startsWith(href);
  };

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logoutUser();

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="font-bold text-xl text-emerald-600">
            Itemize
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? 'text-emerald-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.label}
                    {item.href === '/cart' && cartItemCount > 0 && (
                      <span className="inline-flex items-center justify-center bg-emerald-600 text-white text-xs font-semibold rounded-full w-5 h-5">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-sm font-medium text-slate-600 hover:text-red-600"
            >
              {loggingOut ? "Signing out..." : "Logout"}
            </button>
        </div>
      </div>
    </nav>
  );
}
