import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, Check } from "lucide-react";
import { z } from "zod";
import { SiteLayout } from "@/components/salon/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SERVICES, STAFF, generateSlotsFor } from "@/lib/salon-data";
import { useAuth, cacheSlots } from "@/lib/auth-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  service: z.coerce.number().optional(),
});

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book an appointment · Maison & Blade" },
      {
        name: "description",
        content: "Reserve your slot online — pick services, stylist and time in seconds.",
      },
    ],
  }),
  validateSearch: searchSchema,
  component: BookingPage,
});

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function BookingPage() {
  const { service: preSelected } = Route.useSearch();
  const { user, appointments, bookAppointment, cancelAppointment } = useAuth();
  const navigate = useNavigate();

  const [serviceIds, setServiceIds] = useState(preSelected ? [preSelected] : []);
  const [staffId, setStaffId] = useState();
  const [date, setDate] = useState(tomorrowISO());
  const [slotId, setSlotId] = useState();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedServices = useMemo(
    () => SERVICES.filter((s) => serviceIds.includes(s.id)),
    [serviceIds],
  );
  const totalMinutes = selectedServices.reduce((a, s) => a + s.durationMinutes, 0);

  // Staff whose skill list covers every selected service.
  const availableStaff = useMemo(() => {
    if (serviceIds.length === 0) return STAFF;
    return STAFF.filter((st) => serviceIds.every((id) => st.serviceIds.includes(id)));
  }, [serviceIds]);

  // Mock replacement for GET /api/staff/{id}/slots?date=...
  const slots = useMemo(() => {
    if (!staffId) return [];
    const generated = generateSlotsFor(staffId, date);
    cacheSlots(generated);
    return generated;
  }, [staffId, date]);

  useEffect(() => {
    setSlotId(undefined);
  }, [staffId, date]);

  const canConfirm = serviceIds.length > 0 && staffId && slotId;

  function toggleService(id) {
    setServiceIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setStaffId(undefined);
  }

  async function confirm() {
    if (!user) {
      toast.error("Please sign in to complete your booking.");
      navigate({ to: "/login" });
      return;
    }
    if (!canConfirm || !slotId) return;
    setSubmitting(true);
    try {
      const appt = await bookAppointment({
        customerId: user.id,
        slotId,
        serviceIds,
        notes: notes.trim() || undefined,
      });
      toast.success("Appointment booked", {
        description: `${appt.serviceNames.join(", ")} · ${appt.date} at ${appt.startTime}`,
      });
      setServiceIds([]);
      setStaffId(undefined);
      setSlotId(undefined);
      setNotes("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not book appointment");
    } finally {
      setSubmitting(false);
    }
  }

  const myAppointments = user ? appointments.filter((a) => a.customerId === user.id) : [];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Reservations</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Book your visit</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Four quick steps. You'll receive a confirmation right away.
        </p>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Step 1 - Services (multi-select) */}
          <Step number={1} title="Choose one or more services" complete={serviceIds.length > 0}>
            <div className="grid gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => {
                const active = serviceIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className={cn(
                      "flex gap-3 rounded-xl border p-3 text-left transition-all",
                      active
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <img
                      src={s.imageUrl}
                      alt=""
                      width={80}
                      height={80}
                      loading="lazy"
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">
                        {s.category}
                      </div>
                      <div className="mt-0.5 truncate font-display text-base">{s.serviceName}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {s.durationMinutes} min · {s.targetGender}
                      </div>
                    </div>
                    {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>
          </Step>

          {/* Step 2 - Staff */}
          <Step
            number={2}
            title="Pick your stylist"
            complete={!!staffId}
            disabled={serviceIds.length === 0}
          >
            {availableStaff.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No stylist covers every selected service — please adjust your selection.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {availableStaff.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setStaffId(m.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
                      staffId === m.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-accent font-display text-accent-foreground">
                      {m.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <span className="text-sm font-medium">{m.fullName}</span>
                    <span className="text-xs text-muted-foreground">{m.specialization}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {m.experienceYears}+ yrs
                    </span>
                  </button>
                ))}
              </div>
            )}
          </Step>

          {/* Step 3 - Date & slot */}
          <Step number={3} title="Choose date & time" complete={!!slotId} disabled={!staffId}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Date</span>
                <input
                  type="date"
                  min={tomorrowISO()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {slots.map((slot) => {
                const disabled = slot.status !== "AVAILABLE";
                return (
                  <button
                    key={slot.id}
                    disabled={disabled}
                    onClick={() => setSlotId(slot.id)}
                    className={cn(
                      "rounded-md border py-2 text-sm transition-colors",
                      slotId === slot.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : disabled
                          ? "cursor-not-allowed border-dashed border-border/60 bg-muted/40 text-muted-foreground/50 line-through"
                          : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    {slot.startTime}
                  </button>
                );
              })}
            </div>
          </Step>

          {/* Step 4 - Confirm */}
          <Step number={4} title="Review & confirm" complete={false} disabled={!canConfirm}>
            {canConfirm && staffId && slotId ? (
              <div className="rounded-xl bg-secondary/50 p-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Services</span>
                  <span className="text-right">
                    {selectedServices.map((s) => s.serviceName).join(", ")}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-muted-foreground">Stylist</span>
                  <span>{STAFF.find((s) => s.id === staffId).fullName}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-muted-foreground">When</span>
                  <span>
                    {date} · {slots.find((s) => s.id === slotId)?.startTime}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-muted-foreground">Total duration</span>
                  <span>{totalMinutes} min</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete the steps above to see your summary.
              </p>
            )}
            <div className="mt-4">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Notes for your stylist (optional)</span>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything we should know?"
                  rows={3}
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button size="lg" disabled={!canConfirm || submitting} onClick={confirm}>
                <CalendarCheck2 className="mr-2 h-4 w-4" />
                {submitting ? "Booking…" : "Confirm booking"}
              </Button>
              {!user && (
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Sign in first</Link>
                </Button>
              )}
            </div>
          </Step>
        </div>

        {/* Sidebar - My appointments */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-lg">Your appointments</h3>
            {!user ? (
              <p className="mt-2 text-sm text-muted-foreground">
                <Link to="/login" className="underline underline-offset-4">
                  Sign in
                </Link>{" "}
                to see and manage your bookings.
              </p>
            ) : myAppointments.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No bookings yet — pick a service to get started.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {myAppointments
                  .slice()
                  .reverse()
                  .map((a) => (
                    <li
                      key={a.id}
                      className={cn(
                        "rounded-lg border border-border p-3 text-sm",
                        a.status === "CANCELLED" && "opacity-60",
                      )}
                    >
                      <div className="font-medium">{a.serviceNames.join(", ")}</div>
                      <div className="text-xs text-muted-foreground">with {a.staffName}</div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs">
                          {a.date} · {a.startTime}
                        </span>
                        {a.status === "BOOKED" ? (
                          <button
                            onClick={() => {
                              cancelAppointment(a.id);
                              toast.message("Booking cancelled");
                            }}
                            className="text-xs text-destructive hover:underline"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            {a.status}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}

function Step({ number, title, complete, disabled, children }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-6 transition-opacity",
        disabled && "opacity-60",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid h-8 w-8 place-items-center rounded-full text-sm font-medium",
            complete ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
          )}
        >
          {complete ? <Check className="h-4 w-4" /> : number}
        </span>
        <h2 className="font-display text-xl">{title}</h2>
      </div>
      <div className={cn("mt-5", disabled && "pointer-events-none")}>{children}</div>
    </section>
  );
}
