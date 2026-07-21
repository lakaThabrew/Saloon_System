import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Heart,
  LoaderCircle,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/salon/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

const API_BASE = "http://localhost:8080/api";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My profile · Grow & Grace" },
      { name: "description", content: "Manage your Grow & Grace profile and preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, appointments, updateSession } = useAuth();
  const client = useQueryClient();
  const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  const profileQuery = useQuery({
    queryKey: ["profile"],
    enabled: Boolean(user),
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/users/profile`, { headers });
      if (!response.ok) throw new Error("We couldn't load your profile.");
      return response.json();
    },
  });
  const saveProfile = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || "We couldn't save those details.");
      }
      return response.json();
    },
    onSuccess: (profile) => {
      updateSession(profile);
      client.setQueryData(["profile"], profile);
      toast.success("Your profile has been saved");
    },
    onError: (error) => toast.error(error.message),
  });

  if (!user) return <SignedOut />;
  if (profileQuery.isLoading) return <ProfileLoading />;
  if (profileQuery.isError) return <ProfileError onRetry={profileQuery.refetch} />;

  const profile = profileQuery.data;
  const myAppointments = appointments.filter((appointment) => appointment.customerId === user.id);
  const upcoming = myAppointments.filter((appointment) => appointment.status === "BOOKED").length;

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border bg-secondary/45">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"><Sparkles className="h-4 w-4 text-[color:var(--gold)]" /> Your Grow &amp; Grace <span className="text-[color:var(--gold)]">/</span> Profile</div>
          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar name={profile.fullName} large />
            <div><div className="flex flex-wrap items-center gap-3"><h1 className="font-display text-4xl sm:text-5xl">{profile.fullName}</h1>{profile.role === "ADMIN" && <Badge className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Administrator</Badge>}</div><p className="mt-2 text-muted-foreground">A little space for the details that make every visit feel personal.</p></div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          <MiniStat icon={CalendarDays} value={upcoming} label="Upcoming visits" />
          <MiniStat icon={Heart} value={myAppointments.length} label="Bookings made" tone="gold" />
          <MiniStat icon={CheckCircle2} value={formatMemberSince(profile.createdAt)} label="Grow & Grace member since" tone="plum" text />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <ProfileForm key={`${profile.id}-${profile.fullName}`} profile={profile} saving={saveProfile.isPending} onSave={saveProfile.mutate} />
          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm"><p className="text-sm font-medium text-[color:var(--gold)]">Your next visit</p><h2 className="mt-2 font-display text-2xl">Ready when you are.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Explore services, choose a time that suits you, and leave the rest to our team.</p><Button className="mt-5 w-full" asChild><Link to="/booking">Book an appointment <ChevronRight className="ml-1 h-4 w-4" /></Link></Button></div>
            <div className="rounded-2xl border border-border bg-secondary/45 p-6"><div className="grid h-10 w-10 place-items-center rounded-xl bg-card text-primary shadow-sm"><Sparkles className="h-5 w-5" /></div><h3 className="mt-4 font-display text-xl">A more personal ritual</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Tell us about your style, sensitivities, or preferences so every appointment starts a step ahead.</p></div>
          </aside>
        </div>
      </main>
    </SiteLayout>
  );
}

function ProfileForm({ profile, saving, onSave }) {
  const [form, setForm] = useState({ fullName: profile.fullName ?? "", phone: profile.phone ?? "", preferences: profile.preferences ?? "" });
  function update(key, value) { setForm({ ...form, [key]: value }); }
  function submit(event) { event.preventDefault(); onSave(form); }
  return <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"><div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-medium text-[color:var(--gold)]">Personal details</p><h2 className="mt-1 font-display text-3xl">Make it yours</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Update the details our team uses to make your time with us seamless.</p></div><span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary"><UserRound className="h-5 w-5" /></span></div><form onSubmit={submit} className="mt-7 space-y-6"><div className="grid gap-5 sm:grid-cols-2"><Field label="Full name"><Input required value={form.fullName} onChange={(event) => update("fullName", event.target.value)} /></Field><Field label="Phone number"><Input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Add your preferred number" /></Field></div><Field label="Email address"><div className="flex h-10 items-center gap-2 rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground"><Mail className="h-4 w-4" />{profile.email}</div><p className="mt-1.5 text-xs text-muted-foreground">Email changes are handled by the salon team for account security.</p></Field>{profile.role === "CUSTOMER" && <Field label="Style & appointment preferences"><Textarea rows={6} value={form.preferences} onChange={(event) => update("preferences", event.target.value)} placeholder="For example: preferred stylist, hair texture, products to avoid, or anything you'd like us to know." className="resize-none" /></Field>}<div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="h-3.5 w-3.5" />Your details are only used to support your appointments.</p><Button type="submit" disabled={saving}>{saving && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}{saving ? "Saving..." : "Save profile"}</Button></div></form></section>;
}

function Avatar({ name, large = false }) { return <span className={`grid shrink-0 place-items-center rounded-full bg-primary font-display text-primary-foreground shadow-xl shadow-primary/15 ${large ? "h-20 w-20 text-2xl sm:h-24 sm:w-24 sm:text-3xl" : "h-10 w-10 text-sm"}`}>{initials(name)}</span>; }
function MiniStat({ icon: Icon, value, label, tone = "default", text = false }) { const tones = { default: "bg-secondary text-primary", gold: "bg-[color:var(--gold)]/15 text-primary", plum: "bg-primary text-primary-foreground" }; return <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className={`mt-1 font-display ${text ? "text-xl" : "text-3xl"}`}>{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div><span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></span></div></div>; }
function Field({ label, children }) { return <label className="block text-sm font-medium"><span className="mb-1.5 block">{label}</span>{children}</label>; }
function SignedOut() { return <SiteLayout><main className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-4 py-16 text-center sm:px-8"><div className="w-full rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary"><UserRound className="h-6 w-6" /></div><h1 className="mt-6 font-display text-3xl">Your profile awaits</h1><p className="mx-auto mt-3 max-w-md text-muted-foreground">Sign in to see your details, preferences, and salon journey.</p><Button className="mt-7" asChild><Link to="/login">Sign in <ChevronRight className="ml-1 h-4 w-4" /></Link></Button></div></main></SiteLayout>; }
function ProfileLoading() { return <SiteLayout><main className="mx-auto max-w-7xl px-4 py-12 sm:px-8"><div className="skeleton h-48 rounded-3xl" /><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]"><div className="skeleton h-[32rem] rounded-2xl" /><div className="skeleton h-64 rounded-2xl" /></div></main></SiteLayout>; }
function ProfileError({ onRetry }) { return <SiteLayout><main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 text-center"><div className="w-full rounded-2xl border border-border bg-card p-8"><h1 className="font-display text-3xl">We couldn't open your profile</h1><p className="mt-3 text-muted-foreground">Please try again in a moment.</p><Button variant="outline" className="mt-6" onClick={onRetry}>Try again</Button></div></main></SiteLayout>; }
function initials(name = "") { return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
function formatMemberSince(value) { return value ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(value)) : "Today"; }
