import { useEffect, useState } from "react";
import { ArrowUp, Scissors, Instagram, Facebook, Mail } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <footer className="border-t border-border/60 bg-primary text-primary-foreground">
        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 px-8 py-6">
          <span className="h-px flex-1 bg-primary-foreground/10" />
          <Scissors className="h-4 w-4 text-[color:var(--gold)] rotate-90" />
          <span className="h-px flex-1 bg-primary-foreground/10" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-8 md:grid-cols-4">
          <ScrollReveal className="md:col-span-2" delay={0}>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--gold)] text-primary transition-transform duration-300 hover:scale-110">
                <Scissors className="h-4 w-4" />
              </span>
              <span className="font-display text-xl">
                Maison <span className="text-[color:var(--gold)]">&amp;</span>{" "}
                Blade
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/65">
              A modern salon &amp; barber studio. Precision cuts, editorial
              colour, and the calm of a spa — all under one roof.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold)]">
              Visit
            </h4>
            <p className="mt-3 text-sm leading-6 text-primary-foreground/65">
              221 Rosewood Lane
              <br />
              Suite 4, Downtown
              <br />
              Tue – Sun · 9am – 7pm
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold)]">
              Follow
            </h4>
            <div className="mt-3 flex items-center gap-4 text-primary-foreground/65">
              <a
                href="#"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-primary-foreground/15 transition-all duration-300 hover:scale-110 hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)]/10 hover:text-[color:var(--gold)]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-full border border-primary-foreground/15 transition-all duration-300 hover:scale-110 hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)]/10 hover:text-[color:var(--gold)]"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@maisonblade.co"
                aria-label="Email"
                className="grid h-9 w-9 place-items-center rounded-full border border-primary-foreground/15 transition-all duration-300 hover:scale-110 hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)]/10 hover:text-[color:var(--gold)]"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </ScrollReveal>
        </div>

        <div className="flex items-center justify-between border-t border-primary-foreground/10 px-4 py-4 text-xs text-primary-foreground/45 sm:px-8">
          © {new Date().getFullYear()} Maison &amp; Blade Studio. All rights
          reserved.
        </div>
      </footer>

      {/* Back-to-top FAB */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`back-to-top grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-110 hover:bg-[color:var(--gold)] hover:text-primary ${showTop ? "visible" : ""}`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </>
  );
}
