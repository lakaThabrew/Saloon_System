import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck2,
  Check,
  ChevronRight,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { z } from "zod";
import { SiteLayout } from "@/components/salon/Layout";
import { ScrollReveal } from "@/components/salon/ScrollReveal";
import {
  ServiceCardSkeleton,
  StaffCardSkeleton,
  SlotSkeleton,
} from "@/components/salon/Skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useServices, useStaff, useStaffSlots } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  service: z.coerce.number().optional(),
});

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book an appointment · Grow & Grace" },
      {
        name: "description",
        content:
          "Reserve your slot online — pick services, stylist and time in seconds.",
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

  const [serviceIds, setServiceIds] = useState(
    preSelected ? [preSelected] : [],
  );
  const [staffId, setStaffId] = useState();
  const [date, setDate] = useState(tomorrowISO());
  const [slotId, setSlotId] = useState();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: services = [], isLoading: isLoadingServices } = useServices();
  const { data: staffList = [], isLoading: isLoadingStaff } = useStaff();
  const { data: slots = [], isLoading: isLoadingSlots } = useStaffSlots(
    staffId,
    date,
  );

  const selectedServices = useMemo(
    () => services.filter((s) => serviceIds.includes(s.id)),
    [serviceIds, services],
  );
  const totalMinutes = selectedServices.reduce(
    (a, s) => a + s.durationMinutes,
    0,
  );

  // Staff whose skill list covers every selected service.
  const availableStaff = useMemo(() => {
    if (serviceIds.length === 0) return staffList;
    return staffList.filter((st) =>
      serviceIds.every((id) => st.serviceIds.includes(id)),
    );
  }, [serviceIds, staffList]);

  useEffect(() => {
    setSlotId(undefined);
  }, [staffId, date]);

  const canConfirm = serviceIds.length > 0 && staffId && slotId;

  // Progress calculation
  const completedSteps = [
    serviceIds.length > 0,
    !!staffId,
    !!slotId,
    false,
  ].filter(Boolean).length;
  const progress = (completedSteps / 4) * 100;

  function toggleService(id) {
    setServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
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
      setShowSuccess(true);
      toast.success("Appointment booked", {
        description: `${appt.serviceNames.join(", ")} · ${appt.date} at ${appt.startTime}`,
      });
      setTimeout(() => {
        setShowSuccess(false);
        setServiceIds([]);
        setStaffId(undefined);
        setSlotId(undefined);
        setNotes("");
      }, 3000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not book appointment",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const myAppointments = user
    ? appointments.filter((a) => a.customerId === user.id)
    : [];

  return (
    <SiteLayout>
      {/* ────────── Header ────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground animate-fade-up">
          Reservations
        </p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl animate-fade-up animate-delay-1">
          Book your visit
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground animate-fade-up animate-delay-2">
          Four quick steps. You'll receive a confirmation right away.
        </p>

        {/* Progress bar */}
        <div className="mt-6 animate-fade-up animate-delay-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{completedSteps} of 4 steps</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[color:var(--gold)] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_360px]">
        {/* ────────── Steps ────────── */}
        <div className="relative space-y-6">
          {/* Connecting line */}
          <div className="absolute left-[2.25rem] top-6 bottom-6 hidden w-px bg-border md:block" />

          {/* Step 1 - Services (multi-select) */}
          <Step
            number={1}
            title="Choose one or more services"
            complete={serviceIds.length > 0}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {isLoadingServices ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <ServiceCardSkeleton key={i} />
                ))
              ) : (
                services.map((s) => {
                  const active = serviceIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={cn(
                        "flex gap-3 rounded-xl border p-3 text-left transition-all duration-300",
                        active
                          ? "border-primary ring-2 ring-primary/20 bg-primary/[0.03] shadow-sm"
                          : "border-border hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm",
                      )}
                    >
                      <img
                        src={s.imageUrl}
                        alt=""
                        width={80}
                        height={80}
                        loading="lazy"
                        className="h-16 w-16 shrink-0 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">
                          {s.category}
                        </div>
                        <div className="mt-0.5 truncate font-display text-base">
                          {s.serviceName}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {s.durationMinutes} min · {s.targetGender}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-all duration-300",
                          active
                            ? "border-primary bg-primary text-primary-foreground scale-110"
                            : "border-border",
                        )}
                      >
                        {active && <Check className="h-3 w-3" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </Step>

          {/* Step 2 - Staff */}
          <Step
            number={2}
            title="Pick your stylist"
            complete={!!staffId}
            disabled={serviceIds.length === 0}
          >
            {isLoadingStaff ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <StaffCardSkeleton key={i} />
                ))}
              </div>
            ) : availableStaff.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No stylist covers every selected service — please adjust your
                selection.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {availableStaff.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setStaffId(m.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-300",
                      staffId === m.id
                        ? "border-primary ring-2 ring-primary/20 bg-primary/[0.03] shadow-sm"
                        : "border-border hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-12 w-12 place-items-center rounded-full font-display text-accent-foreground transition-all duration-300",
                        staffId === m.id
                          ? "bg-primary text-primary-foreground scale-110 shadow-md"
                          : "bg-accent",
                      )}
                    >
                      {m.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <span className="text-sm font-medium">{m.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {m.specialization}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {m.experienceYears}+ yrs
                    </span>
                  </button>
                ))}
              </div>
            )}
          </Step>

          {/* Step 3 - Date & slot */}
          <Step
            number={3}
            title="Choose date & time"
            complete={!!slotId}
            disabled={!staffId}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Date</span>
                <input
                  type="date"
                  min={tomorrowISO()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm transition-all duration-300 focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/20"
                />
              </label>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {isLoadingSlots ? (
                <SlotSkeleton />
              ) : slots.length === 0 && staffId ? (
                <div className="col-span-full flex flex-col items-center gap-2 py-6 text-center">
                  <Sparkles className="h-5 w-5 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No slots available for this date.
                  </p>
                </div>
              ) : (
                slots.map((slot) => {
                  const disabled = slot.status !== "AVAILABLE";
                  return (
                    <button
                      key={slot.id}
                      disabled={disabled}
                      onClick={() => setSlotId(slot.id)}
                      className={cn(
                        "rounded-lg border py-2.5 text-sm font-medium transition-all duration-300",
                        slotId === slot.id
                          ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/10 scale-105"
                          : disabled
                            ? "cursor-not-allowed border-dashed border-border/60 bg-muted/40 text-muted-foreground/50 line-through"
                            : "border-border bg-card hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm",
                      )}
                    >
                      {slot.startTime}
                    </button>
                  );
                })
              )}
            </div>
          </Step>

          {/* Step 4 - Confirm */}
          <Step
            number={4}
            title="Review & confirm"
            complete={showSuccess}
            disabled={!canConfirm}
          >
            {showSuccess ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center animate-scale-in">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <PartyPopper className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-display text-2xl">You're all set!</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your appointment has been booked. See you soon!
                  </p>
                </div>
              </div>
            ) : canConfirm && staffId && slotId ? (
              <div className="rounded-xl bg-secondary/50 p-5 text-sm space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Services</span>
                  <span className="text-right font-medium">
                    {selectedServices.map((s) => s.serviceName).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stylist</span>
                  <span className="font-medium">
                    {staffList.find((s) => s.id === staffId)?.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">When</span>
                  <span className="font-medium">
                    {date} · {slots.find((s) => s.id === slotId)?.startTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total duration</span>
                  <span className="font-medium">{totalMinutes} min</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete the steps above to see your summary.
              </p>
            )}
            <div className="mt-4">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">
                  Notes for your stylist (optional)
                </span>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything we should know?"
                  rows={3}
                  className="transition-all duration-300 focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/20"
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                size="lg"
                disabled={!canConfirm || submitting}
                onClick={confirm}
                className="relative"
              >
                {submitting ? (
                  <>
                    <span className="btn-spinner mr-2" /> Booking…
                  </>
                ) : (
                  <>
                    <CalendarCheck2 className="mr-2 h-4 w-4" /> Confirm booking
                  </>
                )}
              </Button>
              {!user && (
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Sign in first</Link>
                </Button>
              )}
            </div>
          </Step>
        </div>

        {/* ────────── Sidebar - My appointments ────────── */}
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display text-lg">Your appointments</h3>
            {!user ? (
              <p className="mt-2 text-sm text-muted-foreground">
                <Link
                  to="/login"
                  className="text-foreground underline underline-offset-4 transition-colors hover:text-[color:var(--gold)]"
                >
                  Sign in
                </Link>{" "}
                to see and manage your bookings.
              </p>
            ) : myAppointments.length === 0 ? (
              <div className="mt-4 flex flex-col items-center gap-3 py-6 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary">
                  <CalendarCheck2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No bookings yet — pick a service to get started.
                </p>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {myAppointments
                  .slice()
                  .reverse()
                  .map((a) => (
                    <li
                      key={a.id}
                      className={cn(
                        "rounded-xl border border-border p-3 text-sm transition-all duration-300 hover:shadow-sm",
                        a.status === "CANCELLED" && "opacity-50",
                      )}
                    >
                      <div className="font-medium">
                        {a.serviceNames.join(", ")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        with {a.staffName}
                      </div>
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
                            className="text-xs text-destructive transition-colors hover:underline"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
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
        "relative rounded-2xl border bg-card p-6 transition-all duration-500",
        disabled
          ? "border-border/60 opacity-50"
          : complete
            ? "border-primary/30 shadow-sm"
            : "border-border",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "relative z-10 grid h-8 w-8 place-items-center rounded-full text-sm font-medium transition-all duration-500",
            complete
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "bg-muted text-foreground",
          )}
        >
          {complete ? <Check className="h-4 w-4" /> : number}
        </span>
        <h2 className="font-display text-xl">{title}</h2>
        {complete && (
          <ChevronRight className="ml-auto h-4 w-4 text-primary/60" />
        )}
      </div>
      <div
        className={cn(
          "mt-5 transition-all duration-500",
          disabled && "pointer-events-none",
        )}
      >
        {children}
      </div>
    </section>
  );
}
