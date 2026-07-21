import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Users } from "lucide-react";
import { SiteLayout } from "@/components/salon/Layout";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/salon-data";
import { useServices } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services · Maison & Blade" },
      {
        name: "description",
        content: "Explore our full menu of hair, colour, spa, nails and makeup services.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [cat, setCat] = useState("ALL");
  const { data: services = [], isLoading } = useServices();
  const filtered = cat === "ALL" ? services : services.filter((s) => s.category === cat);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">The Menu</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Services</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Every service starts with a short consultation so we can tailor the experience to you.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap gap-2 border-b border-border pb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                cat === c.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground">Loading services...</div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <article
                key={s.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={s.imageUrl}
                    alt={s.serviceName}
                    width={1200}
                    height={900}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs uppercase tracking-wide text-secondary-foreground">
                      {s.category}
                    </span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs uppercase text-muted-foreground">
                      {s.targetGender}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl">{s.serviceName}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.description}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" /> {s.durationMinutes} min
                    </span>
                    <Button size="sm" asChild>
                      <Link to="/booking" search={{ service: s.id }}>
                        Book
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <Users className="h-6 w-6" />
            <p>No services in this category yet.</p>
          </div>
        )}
      </div>

      <div className="h-20" />
    </SiteLayout>
  );
}
