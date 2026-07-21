import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Clock, ShieldCheck, Star } from "lucide-react";
import heroImage from "@/assets/salon-hero.jpg";
import { SiteLayout } from "@/components/salon/Layout";
import { Button } from "@/components/ui/button";
import { useServices, useStaff } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data: services = [], isLoading: isLoadingServices } = useServices();
  const { data: staff = [], isLoading: isLoadingStaff } = useStaff();
  const featured = services.slice(0, 4);
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-[color:var(--gold)]" /> Now booking Autumn '26
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-6xl">
              A modern studio for hair, colour &amp; care.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Precision cuts, editorial colour, and slow, considered spa rituals — book with our
              stylists in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link to="/booking">
                  Book an appointment <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/services">View services</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[color:var(--gold)] text-[color:var(--gold)]" />
                <span className="font-medium text-foreground">4.9</span> / 5
              </div>
              <div>2,400+ appointments</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-accent/40 blur-2xl" />
            <img
              src={heroImage}
              alt="Warm, softly-lit salon interior with vanity mirrors"
              width={1600}
              height={1200}
              className="h-full w-full rounded-2xl object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Master stylists",
              body: "10+ years each, trained in Paris & Tokyo.",
            },
            {
              icon: Clock,
              title: "On-time, always",
              body: "We honour your schedule — no waiting rooms.",
            },
            {
              icon: Sparkles,
              title: "Clean, calm space",
              body: "Sanitised tools, single-use linens, soft light.",
            },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background text-[color:var(--gold)] ring-1 ring-border">
                <f.icon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-base font-medium">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured services */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">The Menu</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">Signature services</h2>
          </div>
          <Link
            to="/services"
            className="text-sm text-foreground underline underline-offset-4 hover:text-primary"
          >
            See all
          </Link>
        </div>
        {isLoadingServices ? (
          <div className="mt-10 py-10 text-center text-muted-foreground">Loading services...</div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((s) => (
              <div
                key={s.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
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
                <div className="p-5">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    {s.category}
                  </span>
                  <h3 className="mt-2 font-display text-xl">{s.serviceName}</h3>
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{s.durationMinutes} min</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs uppercase text-secondary-foreground">
                      {s.targetGender}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Team */}
      <section className="bg-secondary/30 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">The Team</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">Hands you'll want to sit with.</h2>
          {isLoadingStaff ? (
            <div className="mt-10 py-10 text-center text-muted-foreground">Loading staff...</div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {staff.map((m) => (
                <div key={m.id} className="rounded-2xl bg-card p-6">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-accent font-display text-2xl text-accent-foreground">
                    {m.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="mt-4 font-medium">{m.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{m.specialization}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.experienceYears}+ years</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-3xl md:text-4xl">Ready when you are.</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Pick a service, a stylist, and a time that works. We'll take care of the rest.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link to="/booking">
            Book now <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </SiteLayout>
  );
}
