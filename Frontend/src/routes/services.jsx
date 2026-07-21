import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/salon/Layout";
import { ScrollReveal } from "@/components/salon/ScrollReveal";
import { ServiceCardLargeSkeleton } from "@/components/salon/Skeleton";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/salon-data";
import { useServices } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services · Grow & Grace" },
      {
        name: "description",
        content:
          "Explore our full menu of hair, colour, spa, nails and makeup services.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [cat, setCat] = useState("ALL");
  const { data: services = [], isLoading } = useServices();
  const filtered =
    cat === "ALL" ? services : services.filter((s) => s.category === cat);

  return (
    <SiteLayout>
      {/* ────────── Header ────────── */}
      <section className="relative mx-auto max-w-7xl overflow-hidden px-4 pb-12 pt-20 sm:px-8">
        <div className="absolute -right-24 top-6 h-56 w-56 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute left-1/2 bottom-0 h-40 w-40 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
        <p className="relative text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          The menu · Made for you
        </p>
        <h1 className="relative mt-4 max-w-2xl font-display text-6xl leading-none md:text-7xl animate-fade-up">
          A little <em>something</em> for every mood.
        </h1>
        <p className="relative mt-5 max-w-xl leading-7 text-muted-foreground animate-fade-up animate-delay-1">
          Every service starts with a short consultation so we can tailor the
          experience to you.
        </p>
      </section>

      {/* ────────── Filter pills ────────── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap gap-2 border-b border-border pb-7">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              aria-pressed={cat === c.value}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                cat === c.value
                  ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/10 scale-105"
                  : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground hover:shadow-sm",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* ────────── Service grid ────────── */}
        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardLargeSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s, index) => (
              <ScrollReveal
                key={s.id}
                delay={(index % 3) * 100}
                variant="scale"
              >
                <article className="group flex flex-col overflow-hidden rounded-[1.25rem] border border-border bg-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-accent/5">
                  <div className="relative aspect-[1.15] w-full overflow-hidden">
                    <img
                      src={s.imageUrl}
                      alt={s.serviceName}
                      width={1200}
                      height={900}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/85 text-foreground opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 group-hover:scale-110">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-secondary-foreground">
                        {s.category}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {s.targetGender}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl">
                      {s.serviceName}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                      {s.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4" /> {s.durationMinutes} min
                      </span>
                      <Button size="sm" className="group/btn" asChild>
                        <Link to="/booking" search={{ service: s.id }}>
                          Book{" "}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* ────────── Empty state ────────── */}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
              <Sparkles className="h-6 w-6 text-[color:var(--gold)]" />
            </div>
            <div>
              <p className="font-display text-xl">Nothing here — yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                No services in this category right now. Check back soon or try a
                different filter.
              </p>
            </div>
            <Button variant="outline" onClick={() => setCat("ALL")}>
              View all services
            </Button>
          </div>
        )}
      </div>

      {/* ────────── CTA banner ────────── */}
      <ScrollReveal variant="scale">
        <section className="mx-4 mb-24 mt-20 overflow-hidden rounded-[1.5rem] bg-secondary/50 px-6 py-12 sm:mx-8 sm:px-12 md:mx-auto md:max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Not sure where to start?
              </p>
              <h2 className="mt-2 font-display text-3xl">
                Let's find your perfect ritual.
              </h2>
            </div>
            <Button asChild>
              <Link to="/booking">
                Talk to a stylist <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </ScrollReveal>
    </SiteLayout>
  );
}
