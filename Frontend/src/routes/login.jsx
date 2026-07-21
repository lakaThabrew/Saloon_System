import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Scissors, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/salon/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · Maison & Blade" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate({ to: "/booking" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <div className="mx-auto flex min-h-[75vh] max-w-5xl items-center px-4 py-16 sm:px-6">
        <div className="grid w-full gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-xl md:grid-cols-[1fr_1fr] animate-scale-in">
          {/* Decorative side panel */}
          <div className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground md:flex md:flex-col md:justify-between">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--gold)] text-primary">
                  <Scissors className="h-4 w-4" />
                </span>
                <span className="font-display text-xl">
                  Maison <span className="text-[color:var(--gold)]">&amp;</span>{" "}
                  Blade
                </span>
              </div>
            </div>

            <div className="relative space-y-4">
              <Sparkles className="h-6 w-6 text-[color:var(--gold)] animate-float" />
              <h2 className="font-display text-4xl leading-tight">
                Good to see you again.
              </h2>
              <p className="max-w-xs text-sm leading-6 text-primary-foreground/60">
                Sign in to manage your appointments, track your visit history,
                and book your next session.
              </p>
            </div>

            <p className="relative text-xs text-primary-foreground/40">
              © {new Date().getFullYear()} Maison &amp; Blade Studio
            </p>
          </div>

          {/* Form panel */}
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <h1 className="font-display text-3xl md:text-4xl">Welcome back.</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to manage your appointments.
            </p>
            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="transition-all duration-300 focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-300 focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/20"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner mr-2" /> Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                New here?{" "}
                <Link
                  to="/register"
                  className="text-foreground underline underline-offset-4 transition-colors hover:text-[color:var(--gold)]"
                >
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
