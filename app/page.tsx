import Link from "next/link";

const quickLinks = [
  {
    title: "Browse recipes",
    description: "Explore the recipe list page.",
    href: "/recipes",
  },
  {
    title: "Recipe detail",
    description: "Jump to a sample recipe detail view.",
    href: "/recipes/123",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14">
      <section className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
          Itemize
        </p>
        <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
          Make meal planning simple again.
        </h1>
        <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
          Use the recipe pages to browse ideas and drill into meal details.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              {link.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{link.description}</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-600">
              Open page
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
