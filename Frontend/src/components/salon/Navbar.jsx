import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  LogOut,
  Menu,
  Scissors,
  ShieldCheck,
  User as UserIcon,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/booking", label: "Book" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full border-b transition-all duration-500 ${
          scrolled
            ? "border-border/60 bg-background/92 shadow-sm backdrop-blur-xl"
            : "border-transparent bg-background/60 backdrop-blur-lg"
        }`}
      >
        {/* Promo banner */}
        <div className="flex h-8 items-center justify-center bg-primary px-4 text-[10px] font-medium uppercase tracking-[0.2em] text-primary-foreground">
          <span className="animate-banner-pulse">
            Complimentary consultation with every first visit
          </span>
          <ArrowUpRight className="ml-1.5 h-3 w-3 text-[color:var(--gold)]" />
        </div>

        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/15 transition-all duration-500 group-hover:rotate-[-10deg] group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/25">
              <Scissors className="h-4 w-4" />
            </span>
            <span className="font-display text-[1.35rem] tracking-tight">
              Maison{" "}
              <span className="text-[color:var(--gold)]">&amp;</span> Blade
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="relative text-sm text-muted-foreground transition-colors after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-[color:var(--gold)] after:transition-all after:duration-300 hover:text-foreground hover:after:w-full"
                activeProps={{ className: "text-foreground font-medium after:w-full after:bg-[color:var(--gold)]" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className="relative flex items-center gap-1.5 text-sm text-muted-foreground transition-colors after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-[color:var(--gold)] after:transition-all after:duration-300 hover:text-foreground hover:after:w-full"
                activeProps={{ className: "text-foreground font-medium after:w-full after:bg-[color:var(--gold)]" }}
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Admin
              </Link>
            )}
          </nav>

          {/* Desktop auth actions + mobile burger */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm sm:flex">
                  <UserIcon className="h-3.5 w-3.5" /> {user.fullName.split(" ")[0]}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate({ to: "/" });
                  }}
                  className="hidden md:inline-flex"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild className="hidden md:inline-flex">
                  <Link to="/register">Join</Link>
                </Button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-lg text-foreground transition-colors hover:bg-secondary md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div className={`mobile-menu-panel ${menuOpen ? "open" : ""}`}>
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <span className="font-display text-lg">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-secondary"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-secondary"
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {l.label}
            </Link>
          ))}
          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-secondary"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              <ShieldCheck className="h-4 w-4" /> Admin dashboard
            </Link>
          )}
        </nav>

        <div className="mt-2 border-t border-border px-4 pt-4">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-secondary/60 px-4 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent font-display text-sm text-accent-foreground">
                  {user.fullName.split(" ").map((n) => n[0]).join("")}
                </span>
                <div>
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full" onClick={() => setMenuOpen(false)}>
                <Link to="/register">Join Maison &amp; Blade</Link>
              </Button>
              <Button variant="outline" asChild className="w-full" onClick={() => setMenuOpen(false)}>
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile footer */}
        <div className="mt-auto p-4 pt-6">
          <p className="text-xs text-muted-foreground">
            Tue — Sun · 9am – 7pm
            <br />
            221 Rosewood Lane, Downtown
          </p>
        </div>
      </div>
    </>
  );
}
