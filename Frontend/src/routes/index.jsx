import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Leaf,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import heroImage from "@/assets/salon-hero.jpg";
import colorImage from "@/assets/services/color.jpg";
import spaImage from "@/assets/services/spa.jpg";
import nailsImage from "@/assets/services/nails.jpg";
import { SiteLayout } from "@/components/salon/Layout";
import { ScrollReveal } from "@/components/salon/ScrollReveal";
import { FeaturedServiceSkeleton, StaffHomeSkeleton } from "@/components/salon/Skeleton";
import { Button } from "@/components/ui/button";
import { useServices, useStaff } from "@/lib/api";

export const Route = createFileRoute("/")(  {
  component: Home,
});

const fallbackFeatured = [
  { id: "haircut", serviceName: "Signature Haircut", category: "HAIR", durationMinutes: 60, targetGender: "ALL", imageUrl: nailsImage },
  { id: "colour", serviceName: "Full Colour", category: "COLOR", durationMinutes: 120, targetGender: "ALL", imageUrl: colorImage },
  { id: "ritual", serviceName: "Scalp & Hair Spa", category: "SPA", durationMinutes: 60, targetGender: "ALL", imageUrl: spaImage },
];

function Home() {
  const { data: services = [], isLoading: isLoadingServices } = useServices();
  const { data: staff = [], isLoading: isLoadingStaff } = useStaff();
  const featured = services.length ? services.slice(0, 3) : fallbackFeatured;

  return (
    <SiteLayout>
      {/* ────────────────── HERO ────────────────── */}
      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
        <div className="absolute -bottom-48 left-1/3 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:py-20">
          <div className="relative z-10 animate-fade-up">
            <div className="mb-7 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-primary-foreground/60">
              <span className="h-px w-10 bg-[color:var(--gold)]" />
              Downtown beauty studio
            </div>
            <h1 className="display-balance max-w-xl font-display text-6xl leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-[6.25rem]">
              Feel good.{" "}
              <em className="font-display font-medium text-[color:var(--gold)]">
                Look
              </em>{" "}
              unforgettable.
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-primary-foreground/65">
              Precision cuts, luminous colour, and slow spa rituals —
              personalised for the way you want to feel.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="bg-[color:var(--gold)] text-primary shadow-xl shadow-black/10 hover:bg-[color:var(--gold)]/90 animate-glow"
                asChild
              >
                <Link to="/booking">
                  Find your appointment <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link to="/services">Explore the menu</Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-primary-foreground/15 pt-5 text-sm text-primary-foreground/60">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-[color:var(--gold)] text-[color:var(--gold)]" />
                <strong className="text-primary-foreground">4.9</strong> rating
              </span>
              <span>2,400+ happy visits</span>
            </div>
          </div>

          <div className="relative animate-fade-in animate-delay-2">
            <div className="absolute -inset-5 rounded-[2rem] border border-[color:var(--gold)]/20" />
            <div className="relative aspect-[0.9] overflow-hidden rounded-[1.5rem] bg-black/20 shadow-2xl shadow-black/25 sm:aspect-[1.05] md:aspect-[0.88]">
              <img
                src={heroImage}
                alt="Warmly lit Maison and Blade salon interior"
                className="h-full w-full object-cover animate-image-drift"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-primary/5" />
              <div className="absolute right-5 top-5 flex h-24 w-24 animate-drift flex-col items-center justify-center rounded-full border border-white/30 bg-primary/35 text-center text-[10px] uppercase tracking-[0.16em] backdrop-blur-md">
                <Sparkles className="mb-1 h-4 w-4 text-[color:var(--gold)]" />
                <span>Good hair</span>
                <span>good mood</span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <ArrowUpRight className="mb-1 h-5 w-5 shrink-0 text-[color:var(--gold)]" />
              </div>
            </div>
            <div className="absolute -bottom-7 -left-4 hidden w-44 rounded-2xl bg-background p-4 text-foreground shadow-xl sm:block md:-left-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Open today
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="mt-2 font-display text-2xl">9am — 7pm</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tue — Sun · Downtown
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── MARQUEE ────────────────── */}
      <div className="overflow-hidden border-b border-border bg-background py-5 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          <span>Hair · Colour · Care</span>
          <span className="text-[color:var(--gold)]">✦</span>
          <span>Feel like yourself, only better</span>
          <span className="text-[color:var(--gold)]">✦</span>
          <span>Hair · Colour · Care</span>
          <span className="text-[color:var(--gold)]">✦</span>
          <span>Feel like yourself, only better</span>
          <span className="text-[color:var(--gold)]">✦</span>
        </div>
      </div>

      {/* ────────────────── VALUE PROPS ────────────────── */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-8 md:grid-cols-3 md:gap-12">
          {[
            {
              icon: ShieldCheck,
              title: "Considered expertise",
              body: "Master stylists who listen first and create with intention.",
            },
            {
              icon: Clock,
              title: "Your time matters",
              body: "Easy online booking and an on-time promise, every visit.",
            },
            {
              icon: Leaf,
              title: "A calmer ritual",
              body: "A warm, clean studio designed to help you slow down.",
            },
          ].map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 120}>
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-background text-[color:var(--gold)] transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-[color:var(--gold)]/10">
                  <feature.icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-xl">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ────────────────── FEATURED SERVICES ────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                The menu
              </p>
              <h2 className="display-balance mt-3 max-w-lg font-display text-5xl leading-none">
                Small rituals. <em>Big</em> energy.
              </h2>
            </div>
            <Link
              to="/services"
              className="group flex items-center gap-2 text-sm font-medium"
            >
              View all services{" "}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </ScrollReveal>

        {isLoadingServices ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <FeaturedServiceSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {featured.map((service, index) => (
              <ScrollReveal key={service.id} delay={index * 120} variant="scale">
                <Link
                  to="/services"
                  className="group relative block overflow-hidden rounded-[1.25rem] border border-border bg-card"
                >
                  <div className="aspect-[0.9] overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt={service.serviceName}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-5 pb-5 pt-24 text-white">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--gold)]">
                          {service.category}
                        </p>
                        <h3 className="mt-1 font-display text-2xl">
                          {service.serviceName}
                        </h3>
                        <p className="mt-1 text-xs text-white/60">
                          {service.durationMinutes} minutes
                        </p>
                      </div>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 transition-all duration-300 group-hover:bg-[color:var(--gold)] group-hover:text-primary group-hover:scale-110">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* ────────────────── ABOUT / METHOD ────────────────── */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-8 md:grid-cols-[0.9fr_1.1fr]">
          <ScrollReveal variant="right" className="relative mx-auto w-full max-w-md md:order-2">
            <div className="absolute -bottom-5 -left-5 h-2/3 w-2/3 rounded-[2rem] bg-accent/50" />
            <img
              src={colorImage}
              alt="Stylist creating luminous colour"
              className="relative aspect-[0.85] w-full rounded-[1.5rem] object-cover shadow-xl"
            />
            <div className="absolute -right-5 top-10 grid h-24 w-24 animate-drift place-items-center rounded-full border border-background bg-[color:var(--gold)] text-center text-xs font-medium uppercase tracking-widest text-primary shadow-lg">
              Since
              <br />
              2014
            </div>
          </ScrollReveal>

          <ScrollReveal variant="left" className="md:order-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              The Maison method
            </p>
            <h2 className="display-balance mt-3 max-w-xl font-display text-5xl leading-[1.02]">
              The best version of you still feels like <em>you.</em>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
              We believe the most beautiful work begins with a good
              conversation. Every appointment is personal, unhurried, and built
              around your real life.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "A personal consultation before every service",
                "Techniques tailored to your texture and routine",
                "Thoughtful products chosen for long-term care",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-9" asChild>
              <Link to="/booking">
                Meet your stylist <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* ────────────────── TEAM ────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                The people
              </p>
              <h2 className="mt-3 font-display text-5xl leading-none">
                Hands you'll want to sit with.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Talent, warmth, and a very good eye for what will suit you.
            </p>
          </div>
        </ScrollReveal>

        {isLoadingStaff ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StaffHomeSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {staff.map((member, index) => (
              <ScrollReveal
                key={member.id}
                delay={(index % 4) * 120}
                variant="scale"
              >
                <div className="group rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-accent font-display text-2xl text-accent-foreground transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20">
                    {member.fullName
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>
                  <h3 className="mt-5 font-display text-2xl">
                    {member.fullName}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {member.specialization}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-widest text-[color:var(--gold)]">
                    {member.experienceYears}+ years
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* ────────────────── CTA ────────────────── */}
      <ScrollReveal variant="scale">
        <section className="mx-4 mb-24 overflow-hidden rounded-[1.5rem] bg-primary px-6 py-16 text-center text-primary-foreground sm:mx-8 sm:px-12 md:mx-auto md:max-w-7xl">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <p className="relative text-[10px] font-medium uppercase tracking-[0.28em] text-[color:var(--gold)]">
            Your next chapter
          </p>
          <h2 className="relative mx-auto mt-4 max-w-xl font-display text-5xl leading-none">
            Ready when you are.
          </h2>
          <p className="relative mx-auto mt-5 max-w-md text-sm leading-6 text-primary-foreground/60">
            Pick a service, a stylist, and a time that works. We'll take care of
            the rest.
          </p>
          <Button
            size="lg"
            className="relative mt-8 bg-[color:var(--gold)] text-primary hover:bg-[color:var(--gold)]/90 animate-glow"
            asChild
          >
            <Link to="/booking">
              Book an appointment <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </ScrollReveal>
    </SiteLayout>
  );
}
