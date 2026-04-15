"use client";

import { useState } from "react";
import RegisterModal from "@/components/auth/RegisterModal";
import LoginModal from "@/components/auth/LoginModal";
import Link from "next/link";

export default function LandingPage() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
            Itemize
          </p>

          <h1 className="mt-4 text-5xl font-semibold text-slate-900">
            Smarter grocery shopping starts with better meal planning.
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            Choose recipes, compare stores, and build optimized grocery trips
            based on cost and convenience.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setRegisterOpen(true)}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white"
            >
              Get Started
            </button>

            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700"
            >
              Sign In
            </button>

            <Link href="/home">Enter App - temporary link</Link>
          </div>
        </section>
      </main>

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
    </>
  );
}