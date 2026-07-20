import { Scissors, Instagram, Facebook, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Scissors className="h-4 w-4" />
            </span>
            <span className="font-display text-xl">Maison &amp; Blade</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A modern salon &amp; barber studio. Precision cuts, editorial colour, and the calm of a
            spa — all under one roof.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Visit</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            221 Rosewood Lane<br />Suite 4, Downtown<br />Tue – Sun · 9am – 7pm
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Follow</h4>
          <div className="mt-3 flex items-center gap-3 text-muted-foreground">
            <a href="#" aria-label="Instagram" className="hover:text-foreground"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-foreground"><Facebook className="h-4 w-4" /></a>
            <a href="mailto:hello@maisonblade.co" aria-label="Email" className="hover:text-foreground"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Maison &amp; Blade Studio. All rights reserved.
      </div>
    </footer>
  );
}
