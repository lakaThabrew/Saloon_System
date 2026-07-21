import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  UsersRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/salon/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useServices, useStaff, useStaffSlots } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const API_BASE = "http://localhost:8080/api";
const appointmentStatuses = ["BOOKED", "COMPLETED", "CANCELLED", "NO_SHOW"];
const roles = ["CUSTOMER", "STAFF", "ADMIN"];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard · Maison & Blade" },
      { name: "description", content: "Manage salon bookings and accounts." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState("ALL");
  const [userSearch, setUserSearch] = useState("");
  const [userDialog, setUserDialog] = useState(null);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bookingForm, setBookingForm] = useState(emptyBooking());
  const isAdmin = user?.role === "ADMIN";
  const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};

  const appointmentsQuery = useQuery({
    queryKey: ["admin", "appointments"],
    enabled: isAdmin,
    queryFn: () => fetchAdmin("/appointments", { headers }),
  });
  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    enabled: isAdmin,
    queryFn: () => fetchAdmin("/users", { headers }),
  });
  const servicesQuery = useServices();
  const staffQuery = useStaff();
  const slotsQuery = useStaffSlots(bookingForm.staffId, bookingForm.date);

  const request = (path, options = {}) => fetchAdmin(path, {
    ...options,
    headers: { ...headers, "Content-Type": "application/json", ...options.headers },
  });
  const refresh = (key) => queryClient.invalidateQueries({ queryKey: ["admin", key] });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => request(`/appointments/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
    onSuccess: () => { refresh("appointments"); toast.success("Booking status updated"); },
    onError: showError,
  });
  const saveUser = useMutation({
    mutationFn: ({ id, data }) => request(id ? `/users/${id}` : "/users", { method: id ? "PUT" : "POST", body: JSON.stringify(data) }),
    onSuccess: () => { refresh("users"); setUserDialog(null); toast.success("User saved"); },
    onError: showError,
  });
  const changeRole = useMutation({
    mutationFn: ({ id, role }) => request(`/users/${id}/role`, { method: "PUT", body: JSON.stringify({ role }) }),
    onSuccess: () => { refresh("users"); toast.success("Access role updated"); },
    onError: showError,
  });
  const createBooking = useMutation({
    mutationFn: (data) => request("/appointments", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      refresh("appointments");
      setBookingDialog(false);
      setBookingForm(emptyBooking());
      toast.success("Booking created");
    },
    onError: showError,
  });
  const deleteRecord = useMutation({
    mutationFn: (target) => request(target.type === "user" ? `/users/${target.id}` : `/appointments/${target.id}`, { method: "DELETE" }),
    onSuccess: (_, target) => {
      refresh(target.type === "user" ? "users" : "appointments");
      setDeleteTarget(null);
      toast.success(`${target.type === "user" ? "User" : "Booking"} deleted`);
    },
    onError: showError,
  });

  const appointments = appointmentsQuery.data ?? [];
  const users = usersQuery.data ?? [];
  const filteredAppointments = useMemo(() => filterAppointments(appointments, bookingSearch, bookingFilter), [appointments, bookingSearch, bookingFilter]);
  const filteredUsers = useMemo(() => filterUsers(users, userSearch), [users, userSearch]);

  if (!user) return <AccessState signedOut />;
  if (!isAdmin) return <AccessState />;

  const booked = appointments.filter((appointment) => appointment.status === "BOOKED").length;
  const completed = appointments.filter((appointment) => appointment.status === "COMPLETED").length;

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border bg-secondary/45">
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
        <div className="absolute -bottom-32 left-[18%] h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-16">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-[color:var(--gold)]" /> Private workspace <span className="text-[color:var(--gold)]">/</span> Administration
          </div>
          <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><h1 className="font-display text-4xl sm:text-5xl">The salon, at a glance.</h1><p className="mt-3 max-w-xl text-muted-foreground">Welcome back, {user.fullName.split(" ")[0]}. Keep every guest experience beautifully on schedule.</p></div>
            <div className="flex items-center gap-2 rounded-full border border-primary/10 bg-card/70 px-4 py-2 text-sm shadow-sm backdrop-blur"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live management access</div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={CalendarDays} label="All bookings" value={appointments.length} detail="Every appointment in one place" />
          <StatCard icon={Clock3} label="Awaiting service" value={booked} detail="Currently confirmed bookings" tone="gold" />
          <StatCard icon={CheckCircle2} label="Completed" value={completed} detail="Guest visits finished" tone="green" />
          <StatCard icon={UsersRound} label="People" value={users.length} detail="Salon accounts" tone="plum" />
        </div>

        <Tabs defaultValue="bookings" className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm font-medium text-[color:var(--gold)]">Operations</p><h2 className="mt-1 font-display text-3xl">Keep the day flowing</h2></div><TabsList className="h-11 self-start rounded-xl p-1"><TabsTrigger value="bookings" className="gap-2 rounded-lg px-4"><CalendarDays className="h-4 w-4" /> Bookings</TabsTrigger><TabsTrigger value="users" className="gap-2 rounded-lg px-4"><UsersRound className="h-4 w-4" /> Users</TabsTrigger></TabsList></div>

          <TabsContent value="bookings" className="mt-6">
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between"><div><h3 className="font-display text-xl">Bookings</h3><p className="mt-1 text-sm text-muted-foreground">Create, update, or remove a visit.</p></div><div className="flex flex-col gap-2 sm:flex-row"><Button size="sm" onClick={() => setBookingDialog(true)}><Plus className="mr-1.5 h-4 w-4" /> Add booking</Button><SearchInput value={bookingSearch} onChange={setBookingSearch} placeholder="Search guests or services" /><Select value={bookingFilter} onValueChange={setBookingFilter}><SelectTrigger className="h-10 w-full sm:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All statuses</SelectItem>{appointmentStatuses.map((status) => <SelectItem key={status} value={status}>{toLabel(status)}</SelectItem>)}</SelectContent></Select></div></div>
              {appointmentsQuery.isLoading ? <LoadingRows /> : appointmentsQuery.isError ? <LoadError onRetry={appointmentsQuery.refetch} /> : <BookingTable appointments={filteredAppointments} pending={updateStatus.isPending} onStatusChange={(id, status) => updateStatus.mutate({ id, status })} onDelete={setDeleteTarget} />}
            </section>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-display text-xl">People & access</h3><p className="mt-1 text-sm text-muted-foreground">Add, edit, and set access for every account.</p></div><div className="flex flex-col gap-2 sm:flex-row"><Button size="sm" onClick={() => setUserDialog({ mode: "create" })}><UserPlus className="mr-1.5 h-4 w-4" /> Add person</Button><SearchInput value={userSearch} onChange={setUserSearch} placeholder="Search people" /></div></div>
              {usersQuery.isLoading ? <LoadingRows /> : usersQuery.isError ? <LoadError onRetry={usersQuery.refetch} /> : <UserTable users={filteredUsers} currentUserId={user.id} changingRole={changeRole.isPending} onRoleChange={(id, role) => changeRole.mutate({ id, role })} onEdit={(account) => setUserDialog({ mode: "edit", account })} onDelete={setDeleteTarget} />}
            </section>
          </TabsContent>
        </Tabs>

        <UserEditor key={userDialog?.account?.id ?? "new"} dialog={userDialog} onOpenChange={(open) => !open && setUserDialog(null)} onSave={(data) => saveUser.mutate({ id: userDialog?.account?.id, data })} saving={saveUser.isPending} />
        <BookingEditor open={bookingDialog} onOpenChange={setBookingDialog} form={bookingForm} setForm={setBookingForm} users={users} staff={staffQuery.data ?? []} services={servicesQuery.data ?? []} slots={slotsQuery.data ?? []} loadingSlots={slotsQuery.isLoading} onSave={createBooking.mutate} saving={createBooking.isPending} />
        <DeleteConfirm target={deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)} onConfirm={() => deleteRecord.mutate(deleteTarget)} deleting={deleteRecord.isPending} />
      </main>
    </SiteLayout>
  );
}

function BookingTable({ appointments, pending, onStatusChange, onDelete }) {
  return <Table><TableHeader><TableRow><TableHead className="pl-5">Guest</TableHead><TableHead>Visit</TableHead><TableHead>Service</TableHead><TableHead>Stylist</TableHead><TableHead>Status</TableHead><TableHead>Update</TableHead><TableHead className="pr-5 text-right">Delete</TableHead></TableRow></TableHeader><TableBody>{appointments.map((appointment) => <TableRow key={appointment.id}><TableCell className="pl-5"><p className="font-medium">{appointment.customerName}</p><p className="mt-0.5 text-xs text-muted-foreground">{appointment.customerEmail}</p></TableCell><TableCell><p>{formatDate(appointment.date)}</p><p className="mt-0.5 text-xs text-muted-foreground">{formatTime(appointment.startTime)}–{formatTime(appointment.endTime)}</p></TableCell><TableCell className="max-w-44"><p className="truncate">{appointment.services?.join(", ") || "—"}</p>{appointment.notes && <p className="mt-0.5 truncate text-xs text-muted-foreground">{appointment.notes}</p>}</TableCell><TableCell>{appointment.staffName}</TableCell><TableCell><StatusBadge status={appointment.status} /></TableCell><TableCell><Select value={appointment.status} onValueChange={(status) => onStatusChange(appointment.id, status)} disabled={pending}><SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger><SelectContent>{appointmentStatuses.map((status) => <SelectItem key={status} value={status}>{toLabel(status)}</SelectItem>)}</SelectContent></Select></TableCell><TableCell className="pr-5 text-right"><Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete({ type: "booking", id: appointment.id, name: `booking for ${appointment.customerName}` })}><Trash2 className="h-4 w-4" /><span className="sr-only">Delete booking</span></Button></TableCell></TableRow>)}{appointments.length === 0 && <EmptyRow columns={7} icon={CalendarDays} message="No bookings match those filters." />}</TableBody></Table>;
}

function UserTable({ users, currentUserId, changingRole, onRoleChange, onEdit, onDelete }) {
  return <Table><TableHeader><TableRow><TableHead className="pl-5">Person</TableHead><TableHead>Contact</TableHead><TableHead>Access</TableHead><TableHead>Joined</TableHead><TableHead className="pr-5 text-right">Manage</TableHead></TableRow></TableHeader><TableBody>{users.map((account) => <TableRow key={account.id}><TableCell className="pl-5"><div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm text-primary">{initials(account.fullName)}</span><span className="font-medium">{account.fullName}</span></div></TableCell><TableCell><p>{account.email}</p>{account.phone && <p className="mt-0.5 text-xs text-muted-foreground">{account.phone}</p>}</TableCell><TableCell><Select value={account.role} onValueChange={(role) => onRoleChange(account.id, role)} disabled={changingRole || account.id === currentUserId}><SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger><SelectContent>{roles.map((role) => <SelectItem key={role} value={role}>{toLabel(role)}</SelectItem>)}</SelectContent></Select></TableCell><TableCell className="text-muted-foreground">{formatDateTime(account.createdAt)}</TableCell><TableCell className="pr-5 text-right"><Button variant="ghost" size="icon" onClick={() => onEdit(account)}><Pencil className="h-4 w-4" /><span className="sr-only">Edit user</span></Button><Button variant="ghost" size="icon" disabled={account.id === currentUserId} className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete({ type: "user", id: account.id, name: account.fullName })}><Trash2 className="h-4 w-4" /><span className="sr-only">Delete user</span></Button></TableCell></TableRow>)}{users.length === 0 && <EmptyRow columns={5} icon={UsersRound} message="No people match that search." />}</TableBody></Table>;
}

function UserEditor({ dialog, onOpenChange, onSave, saving }) {
  const account = dialog?.account;
  const [form, setForm] = useState({ fullName: account?.fullName ?? "", email: account?.email ?? "", phone: account?.phone ?? "", password: "", role: account?.role ?? "CUSTOMER" });
  const isEdit = dialog?.mode === "edit";
  function submit(event) { event.preventDefault(); const data = isEdit ? { fullName: form.fullName, email: form.email, phone: form.phone } : form; onSave(data); }
  return <Dialog open={Boolean(dialog)} onOpenChange={onOpenChange}><DialogContent className="max-w-md rounded-2xl"><DialogHeader><DialogTitle className="font-display text-2xl">{isEdit ? "Edit person" : "Add a person"}</DialogTitle><DialogDescription>{isEdit ? "Keep their contact details polished and current." : "Create a new salon account with the right access."}</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-4"><Field label="Full name"><Input required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} /></Field><Field label="Email"><Input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field><Field label="Phone"><Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field>{!isEdit && <><Field label="Temporary password"><Input required minLength={8} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></Field><Field label="Access role"><Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{roles.map((role) => <SelectItem key={role} value={role}>{toLabel(role)}</SelectItem>)}</SelectContent></Select></Field></>}<DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving..." : isEdit ? "Save changes" : "Create account"}</Button></DialogFooter></form></DialogContent></Dialog>;
}

function BookingEditor({ open, onOpenChange, form, setForm, users, staff, services, slots, loadingSlots, onSave, saving }) {
  const customers = users.filter((account) => account.role === "CUSTOMER");
  const availableSlots = slots.filter((slot) => slot.status === "AVAILABLE");
  function update(next) { setForm({ ...form, ...next }); }
  function toggleService(id) { update({ serviceIds: form.serviceIds.includes(id) ? form.serviceIds.filter((item) => item !== id) : [...form.serviceIds, id] }); }
  function submit(event) { event.preventDefault(); onSave({ customerId: Number(form.customerId), slotId: Number(form.slotId), serviceIds: form.serviceIds, notes: form.notes }); }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-2xl"><DialogHeader><DialogTitle className="font-display text-2xl">Create a booking</DialogTitle><DialogDescription>Set up a guest visit in a few considered steps.</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-4"><Field label="Guest"><Select value={form.customerId} onValueChange={(customerId) => update({ customerId })}><SelectTrigger><SelectValue placeholder="Select a customer" /></SelectTrigger><SelectContent>{customers.map((customer) => <SelectItem key={customer.id} value={String(customer.id)}>{customer.fullName} · {customer.email}</SelectItem>)}</SelectContent></Select></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Stylist"><Select value={form.staffId} onValueChange={(staffId) => update({ staffId, slotId: "" })}><SelectTrigger><SelectValue placeholder="Select stylist" /></SelectTrigger><SelectContent>{staff.map((member) => <SelectItem key={member.id} value={String(member.id)}>{member.fullName}</SelectItem>)}</SelectContent></Select></Field><Field label="Date"><Input type="date" min={today()} value={form.date} onChange={(event) => update({ date: event.target.value, slotId: "" })} /></Field></div><Field label="Available time"><Select value={form.slotId} onValueChange={(slotId) => update({ slotId })} disabled={!form.staffId || loadingSlots}><SelectTrigger><SelectValue placeholder={loadingSlots ? "Loading times..." : "Select a time"} /></SelectTrigger><SelectContent>{availableSlots.map((slot) => <SelectItem key={slot.id} value={String(slot.id)}>{formatTime(slot.startTime)}–{formatTime(slot.endTime)}</SelectItem>)}</SelectContent></Select></Field><Field label="Services"><div className="grid gap-2 sm:grid-cols-2">{services.map((service) => <button key={service.id} type="button" onClick={() => toggleService(service.id)} className={cn("rounded-xl border px-3 py-3 text-left text-sm transition-colors", form.serviceIds.includes(service.id) ? "border-primary bg-secondary" : "border-border hover:bg-secondary/60")}><span className="block font-medium">{service.serviceName}</span><span className="mt-0.5 block text-xs text-muted-foreground">{service.durationMinutes} min</span></button>)}</div></Field><Field label="Booking note (optional)"><Input value={form.notes} onChange={(event) => update({ notes: event.target.value })} placeholder="Any useful details for the team" /></Field><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={saving || !form.customerId || !form.slotId || form.serviceIds.length === 0}>{saving ? "Creating..." : "Create booking"}</Button></DialogFooter></form></DialogContent></Dialog>;
}

function DeleteConfirm({ target, onOpenChange, onConfirm, deleting }) {
  return <AlertDialog open={Boolean(target)} onOpenChange={onOpenChange}><AlertDialogContent className="rounded-2xl"><AlertDialogHeader><AlertDialogTitle className="font-display text-2xl">Remove {target?.type === "user" ? "this person" : "this booking"}?</AlertDialogTitle><AlertDialogDescription>This permanently deletes {target?.name}. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep it</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleting} onClick={onConfirm}>{deleting ? "Removing..." : "Delete permanently"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}

function AccessState({ signedOut = false }) { return <SiteLayout><main className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-4 py-16 text-center sm:px-8"><div className="w-full rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary"><ShieldAlert className="h-6 w-6" /></div><p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-[color:var(--gold)]">Private area</p><h1 className="mt-2 font-display text-3xl">{signedOut ? "Sign in to continue" : "Admin access only"}</h1><p className="mx-auto mt-3 max-w-md text-muted-foreground">{signedOut ? "Please sign in with an administrator account to open the salon dashboard." : "This workspace is reserved for Maison & Blade administrators."}</p><Button className="mt-7" asChild><Link to={signedOut ? "/login" : "/"}>{signedOut ? "Sign in" : "Return home"}<ChevronRight className="ml-1 h-4 w-4" /></Link></Button></div></main></SiteLayout>; }
function StatCard({ icon: Icon, label, value, detail, tone = "default" }) { const tones = { default: "bg-secondary text-primary", gold: "bg-[color:var(--gold)]/15 text-primary", green: "bg-emerald-500/10 text-emerald-700", plum: "bg-primary text-primary-foreground" }; return <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 font-display text-3xl">{value}</p></div><span className={cn("grid h-10 w-10 place-items-center rounded-xl", tones[tone])}><Icon className="h-5 w-5" /></span></div><p className="mt-4 text-xs text-muted-foreground">{detail}</p></div>; }
function SearchInput({ value, onChange, placeholder }) { return <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full pl-9 sm:w-64" placeholder={placeholder} /></div>; }
function Field({ label, children }) { return <label className="block text-sm font-medium"><span className="mb-1.5 block">{label}</span>{children}</label>; }
function StatusBadge({ status }) { const styles = { BOOKED: "border-[color:var(--gold)]/30 bg-[color:var(--gold)]/15 text-primary", COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700", CANCELLED: "border-rose-200 bg-rose-50 text-rose-700", NO_SHOW: "border-slate-200 bg-slate-100 text-slate-600" }; return <Badge variant="outline" className={cn("whitespace-nowrap font-medium", styles[status])}>{status === "COMPLETED" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : status === "CANCELLED" ? <XCircle className="mr-1 h-3 w-3" /> : <Sparkles className="mr-1 h-3 w-3" />}{toLabel(status)}</Badge>; }
function LoadingRows() { return <div className="space-y-3 p-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="skeleton h-12 w-full" />)}</div>; }
function LoadError({ onRetry }) { return <div className="flex flex-col items-center gap-3 p-12 text-center"><p className="text-sm text-muted-foreground">We couldn't load this information.</p><Button variant="outline" size="sm" onClick={onRetry}>Try again</Button></div>; }
function EmptyRow({ columns, icon: Icon, message }) { return <TableRow><TableCell colSpan={columns} className="py-12 text-center"><Icon className="mx-auto h-5 w-5 text-muted-foreground" /><p className="mt-3 text-sm text-muted-foreground">{message}</p></TableCell></TableRow>; }
async function fetchAdmin(path, options = {}) { const response = await fetch(`${API_BASE}/admin${path}`, options); if (!response.ok) { const body = await response.json().catch(() => null); throw new Error(body?.message || "Your changes could not be saved."); } return response.status === 204 ? null : response.json(); }
function showError(error) { toast.error(error.message); }
function filterAppointments(appointments, search, status) { const query = search.trim().toLowerCase(); return appointments.filter((appointment) => { const text = [appointment.customerName, appointment.customerEmail, appointment.staffName, ...(appointment.services ?? [])].join(" ").toLowerCase(); return (status === "ALL" || appointment.status === status) && (!query || text.includes(query)); }); }
function filterUsers(users, search) { const query = search.trim().toLowerCase(); return users.filter((account) => !query || [account.fullName, account.email, account.phone, account.role].filter(Boolean).join(" ").toLowerCase().includes(query)); }
function emptyBooking() { return { customerId: "", staffId: "", slotId: "", serviceIds: [], date: today(), notes: "" }; }
function today() { return new Date().toISOString().slice(0, 10); }
function toLabel(value) { return value?.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function initials(name = "") { return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
function formatDate(value) { return value ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`)) : "—"; }
function formatTime(value) { return value ? new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(`1970-01-01T${value}`)) : "—"; }
function formatDateTime(value) { return value ? formatDate(value.slice(0, 10)) : "—"; }
