import { createContext, useContext, useEffect, useState } from "react";

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

  const API_BASE = "http://localhost:8080/api";

  async function register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      let errorMsg = "Registration failed.";
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          errorMsg = json.message || text;
        } catch (e) {
          errorMsg = text;
        }
      }
      throw new Error(errorMsg);
    }
    
    const session = await res.json();
    write(SESSION_KEY, session);
    setUser(session);
  }

  async function login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      let errorMsg = "Invalid email or password.";
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          errorMsg = json.message || text;
        } catch (e) {
          errorMsg = text;
        }
      }
      throw new Error(errorMsg);
    }
    
    const session = await res.json();
    write(SESSION_KEY, session);
    setUser(session);
  }

  function logout() {
    if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  function updateSession(profile) {
    const next = { ...user, ...profile };
    write(SESSION_KEY, next);
    setUser(next);
  }

  async function bookAppointment(req) {
    if (!user) throw new Error("Please sign in to book.");
    
    // Add the customerId to the request for the backend
    const appointmentReq = {
      ...req,
      customerId: user.id
    };

    const res = await fetch(`${API_BASE}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(appointmentReq),
    });

    if (!res.ok) {
      let errorMsg = "Failed to book appointment.";
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          errorMsg = json.message || text;
        } catch (e) {
          errorMsg = text;
        }
      }
      throw new Error(errorMsg);
    }

    const appt = await res.json();
    
    // Transform backend appointment response to frontend format
    const formattedAppt = {
      id: appt.id,
      customerId: appt.customer?.id,
      slotId: appt.slot?.id,
      staffId: appt.slot?.staff?.id,
      staffName: appt.slot?.staff?.fullName,
      date: appt.slot?.date,
      startTime: appt.slot?.startTime,
      serviceIds: appt.services?.map(s => s.id) || [],
      serviceNames: appt.services?.map(s => s.serviceName) || [],
      totalMinutes: appt.services?.reduce((a, s) => a + s.durationMinutes, 0) || 0,
      notes: appt.notes,
      status: appt.status,
      createdAt: appt.createdAt || new Date().toISOString(),
    };

    const next = [...appointments, formattedAppt];
    setAppointments(next);
    write(APPTS_KEY, next);
    return formattedAppt;
  }

  function cancelAppointment(id) {
    // Currently backend doesn't support cancel, we just do it locally for now
    const next = appointments.map((a) => (a.id === id ? { ...a, status: "CANCELLED" } : a));
    setAppointments(next);
    write(APPTS_KEY, next);
  }

  return (
    <AuthContext.Provider
      value={{ user, appointments, login, register, logout, updateSession, bookAppointment, cancelAppointment }}
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


