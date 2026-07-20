import { createContext, useContext, useEffect, useState } from "react";
import { SERVICES, STAFF } from "./salon-data";

/**
 * Auth + appointments store.
 *
 * Shape mirrors the Spring Boot backend:
 *   POST /api/auth/register  { fullName, email, password, phone, gender, preferences }
 *   POST /api/auth/login     { email, password }   -> { token, role }
 *   POST /api/appointments   AppointmentRequest    -> Appointment
 *
 * While no live API is wired up, we persist to localStorage so the flow is
 * fully usable. All calls are async so swapping in `fetch()` is a one-liner.
 */

const AuthContext = createContext(null);

const USERS_KEY = "salon.users";
const SESSION_KEY = "salon.session";
const APPTS_KEY = "salon.appointments";

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function issueToken() {
  // Placeholder token; the real API returns a JWT.
  return `mock.${crypto.randomUUID()}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setUser(read(SESSION_KEY, null));
    setAppointments(read(APPTS_KEY, []));
  }, []);

  async function register(data) {
    const users = read(USERS_KEY, []);
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error("An account with that email already exists.");
    }
    const record = {
      id: crypto.randomUUID(),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      preferences: data.preferences,
      role: "CUSTOMER",
      token: issueToken(),
      password: data.password,
    };
    write(USERS_KEY, [...users, record]);
    const { password: _p, ...session } = record;
    write(SESSION_KEY, session);
    setUser(session);
  }

  async function login(email, password) {
    const users = read(USERS_KEY, []);
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) throw new Error("Invalid email or password.");
    const refreshed = { ...found, token: issueToken() };
    write(
      USERS_KEY,
      users.map((u) => (u.id === refreshed.id ? refreshed : u)),
    );
    const { password: _p, ...session } = refreshed;
    write(SESSION_KEY, session);
    setUser(session);
  }

  function logout() {
    if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  async function bookAppointment(req) {
    if (!user) throw new Error("Please sign in to book.");
    const services = SERVICES.filter((s) => req.serviceIds.includes(s.id));
    if (services.length === 0) throw new Error("Select at least one service.");

    // Resolve staff + slot from mock slot pool (real backend does this server-side).
    const staffId = Math.floor(req.slotId / 10000);
    const staff = STAFF.find((s) => s.id === staffId);
    if (!staff) throw new Error("Unknown stylist.");
    // We can't reverse-engineer the date from the id, so require the caller to
    // pass it through the request in real use. For the mock, we look it up
    // from the currently-known slot pools cached in memory.
    const slot = slotCache.get(req.slotId);
    if (!slot) throw new Error("That slot is no longer available.");

    const appt = {
      id: crypto.randomUUID(),
      customerId: user.id,
      slotId: req.slotId,
      staffId,
      staffName: staff.fullName,
      date: slot.date,
      startTime: slot.startTime,
      serviceIds: req.serviceIds,
      serviceNames: services.map((s) => s.serviceName),
      totalMinutes: services.reduce((a, s) => a + s.durationMinutes, 0),
      notes: req.notes,
      status: "BOOKED",
      createdAt: new Date().toISOString(),
    };
    const next = [...appointments, appt];
    setAppointments(next);
    write(APPTS_KEY, next);
    return appt;
  }

  function cancelAppointment(id) {
    const next = appointments.map((a) => (a.id === id ? { ...a, status: "CANCELLED" } : a));
    setAppointments(next);
    write(APPTS_KEY, next);
  }

  return (
    <AuthContext.Provider
      value={{ user, appointments, login, register, logout, bookAppointment, cancelAppointment }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/* Slot cache — populated by pages that fetch slots; used by bookAppointment
 * to resolve date/time when the mock "creates" an appointment. */
const slotCache = new Map();
export function cacheSlots(slots) {
  for (const s of slots)
    slotCache.set(s.id, { date: s.date, startTime: s.startTime, endTime: s.endTime });
}
