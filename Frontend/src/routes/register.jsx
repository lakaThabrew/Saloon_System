import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Scissors, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/salon/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account · Maison & Blade" }] }),
  component: RegisterPage,
});

const GENDERS = [
  { value: "FEMALE", label: "Female" },
  { value: "MALE", label: "Male" },
  { value: "UNISEX", label: "Non-binary / Other" },
];

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-400" };
  if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-400" };
  if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-400" };
  if (score <= 4) return { score: 4, label: "Strong", color: "bg-emerald-400" };
  return { score: 5, label: "Very strong", color: "bg-emerald-500" };
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    gender: "FEMALE",
    preferences: "",
  });
  const [loading, setLoading] = useState(false);

  const strength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password],
  );

  async function onSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        gender: form.gender,
        preferences: form.preferences.trim() || undefined,
      });
      toast.success("Account created");
      navigate({ to: "/booking" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "transition-all duration-300 focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/20";

  return (
    <SiteLayout>
      <div className="mx-auto flex min-h-[75vh] max-w-5xl items-center px-4 py-16 sm:px-6">
        <div className="grid w-full gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-xl md:grid-cols-[1fr_1.2fr] animate-scale-in">
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
                Your journey starts here.
              </h2>
              <p className="max-w-xs text-sm leading-6 text-primary-foreground/60">
                Create your account and discover a new standard of care.
                Personalised services, easy booking, and a space that feels like
                yours.
              </p>
              <div className="mt-6 space-y-3 text-xs text-primary-foreground/50">
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[color:var(--gold)]" />
                  Book in seconds, cancel anytime
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[color:var(--gold)]" />
                  Track your visit history
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[color:var(--gold)]" />
                  Personalised recommendations
                </div>
              </div>
            </div>

            <p className="relative text-xs text-primary-foreground/40">
              © {new Date().getFullYear()} Maison &amp; Blade Studio
            </p>
          </div>

          {/* Form panel */}
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <h1 className="font-display text-3xl md:text-4xl">
              Join Maison &amp; Blade.
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create an account to book and track your visits.
            </p>
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  required
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    className={cn(
                      "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm appearance-none cursor-pointer",
                      inputClass,
                    )}
                  >
                    {GENDERS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={inputClass}
                />
                {/* Password strength indicator */}
                {form.password && (
                  <div className="space-y-1.5 animate-fade-in">
                    <div className="strength-bar">
                      <div
                        className={cn("strength-bar-fill", strength.color)}
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Password strength:{" "}
                      <span className="font-medium text-foreground">
                        {strength.label}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferences">
                  Preferences{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="preferences"
                  rows={2}
                  placeholder="Preferred stylist, allergies, etc."
                  value={form.preferences}
                  onChange={(e) =>
                    setForm({ ...form, preferences: e.target.value })
                  }
                  className={inputClass}
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
                    <span className="btn-spinner mr-2" /> Creating…
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-foreground underline underline-offset-4 transition-colors hover:text-[color:var(--gold)]"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
