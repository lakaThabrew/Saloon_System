// Types mirror the Spring Boot backend entities so the frontend stays
// swap-in-ready once a REST base URL is provided.
// Backend contracts:
//   GET  /api/services             -> Service[]
//   GET  /api/staff                -> Staff[]
//   GET  /api/staff/{id}/slots?date=YYYY-MM-DD -> TimeSlot[]
//   POST /api/appointments         -> Appointment  (body: AppointmentRequest)
//   POST /api/auth/register|login  -> { token, role }
//
// The `imageUrl` field is a frontend-only augmentation because the backend
// Service entity has no image column.

import haircutImg from "@/assets/services/haircut.jpg";
import beardImg from "@/assets/services/beard.jpg";
import colorImg from "@/assets/services/color.jpg";
import spaImg from "@/assets/services/spa.jpg";
import nailsImg from "@/assets/services/nails.jpg";
import makeupImg from "@/assets/services/makeup.jpg";
import kidsImg from "@/assets/services/kids.jpg";
import blowoutImg from "@/assets/services/blowout.jpg";

export type Gender = "MALE" | "FEMALE" | "UNISEX";
export type Role = "CUSTOMER" | "STAFF" | "ADMIN";
export type AppointmentStatus = "BOOKED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
export type TimeSlotStatus = "AVAILABLE" | "BOOKED" | "BLOCKED";

// The backend `ServiceCategory` enum is empty in the reference repo, so we
// treat category as a free-form string label managed on the frontend.
export type ServiceCategory =
  | "HAIR" | "BEARD" | "COLOR" | "SPA" | "NAILS" | "MAKEUP";

export interface SalonService {
  id: number;
  serviceName: string;
  category: ServiceCategory;
  targetGender: Gender;
  durationMinutes: number;
  description: string;
  isActive: boolean;
  imageUrl: string; // frontend-only
}

export interface Staff {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  specialization: string;
  experienceYears: number;
  serviceIds: number[];
}

export interface TimeSlot {
  id: number;
  staffId: number;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  status: TimeSlotStatus;
}

export interface AppointmentRequest {
  customerId: number | string;
  slotId: number;
  serviceIds: number[];
  notes?: string;
}

export interface Appointment {
  id: string;
  customerId: number | string;
  slotId: number;
  staffId: number;
  staffName: string;
  date: string;
  startTime: string;
  serviceIds: number[];
  serviceNames: string[];
  totalMinutes: number;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
}

/* --------------------------------- Mock data ---------------------------------
 * The backend runs separately (Spring Boot + MySQL). While it's not connected,
 * these mocks keep the UI fully functional. Swap the four functions at the
 * bottom of this file for `fetch(...)` calls to hit the real API.
 * ------------------------------------------------------------------------- */

export const SERVICES: SalonService[] = [
  { id: 1, serviceName: "Signature Haircut", category: "HAIR", targetGender: "UNISEX", durationMinutes: 45,
    description: "Consultation, precision cut & styling to finish.", isActive: true, imageUrl: haircutImg },
  { id: 2, serviceName: "Classic Beard Trim", category: "BEARD", targetGender: "MALE", durationMinutes: 30,
    description: "Line-up, shape & hot towel finish.", isActive: true, imageUrl: beardImg },
  { id: 3, serviceName: "Full Colour", category: "COLOR", targetGender: "UNISEX", durationMinutes: 90,
    description: "Single-process colour with a glossing treatment.", isActive: true, imageUrl: colorImg },
  { id: 4, serviceName: "Balayage", category: "COLOR", targetGender: "FEMALE", durationMinutes: 150,
    description: "Hand-painted lived-in highlights.", isActive: true, imageUrl: colorImg },
  { id: 5, serviceName: "Scalp & Hair Spa", category: "SPA", targetGender: "UNISEX", durationMinutes: 60,
    description: "Deep-conditioning ritual with a scalp massage.", isActive: true, imageUrl: spaImg },
  { id: 6, serviceName: "Gel Manicure", category: "NAILS", targetGender: "UNISEX", durationMinutes: 45,
    description: "Shape, cuticle care & long-wear gel polish.", isActive: true, imageUrl: nailsImg },
  { id: 7, serviceName: "Bridal Makeup", category: "MAKEUP", targetGender: "FEMALE", durationMinutes: 120,
    description: "Full glam with a trial session included.", isActive: true, imageUrl: makeupImg },
  { id: 8, serviceName: "Kids Cut", category: "HAIR", targetGender: "UNISEX", durationMinutes: 30,
    description: "Gentle cut for the little ones.", isActive: true, imageUrl: kidsImg },
  { id: 9, serviceName: "Blow-Dry & Style", category: "HAIR", targetGender: "FEMALE", durationMinutes: 45,
    description: "Bouncy, camera-ready blowout for any occasion.", isActive: true, imageUrl: blowoutImg },
];

export const STAFF: Staff[] = [
  { id: 101, fullName: "Ava Laurent", email: "ava@maisonblade.co", phone: "555-0101",
    gender: "FEMALE", specialization: "Cutting & Colour", experienceYears: 12, serviceIds: [1, 3, 4, 9] },
  { id: 102, fullName: "Marcus Reid", email: "marcus@maisonblade.co", phone: "555-0102",
    gender: "MALE", specialization: "Barbering", experienceYears: 8, serviceIds: [1, 2, 8] },
  { id: 103, fullName: "Priya Shah", email: "priya@maisonblade.co", phone: "555-0103",
    gender: "FEMALE", specialization: "Colour Correction", experienceYears: 10, serviceIds: [1, 3, 4] },
  { id: 104, fullName: "Noa Kimura", email: "noa@maisonblade.co", phone: "555-0104",
    gender: "FEMALE", specialization: "Spa · Nails · Makeup", experienceYears: 6, serviceIds: [5, 6, 7] },
];

export const CATEGORIES: { value: ServiceCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "HAIR", label: "Hair" },
  { value: "BEARD", label: "Beard" },
  { value: "COLOR", label: "Colour" },
  { value: "SPA", label: "Spa" },
  { value: "NAILS", label: "Nails" },
  { value: "MAKEUP", label: "Makeup" },
];

const BASE_SLOTS = [
  "09:00", "09:45", "10:30", "11:15", "12:00",
  "13:00", "13:45", "14:30", "15:15", "16:00", "16:45", "17:30",
];

// Mock replacement for GET /api/staff/{id}/slots?date=...
// Deterministic per (staff, date) so the UI is stable across renders.
export function generateSlotsFor(staffId: number, date: string): TimeSlot[] {
  const seed = [...(staffId + date)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return BASE_SLOTS.map((start, i) => {
    const [h, m] = start.split(":").map(Number);
    const endMin = h * 60 + m + 45;
    const endTime = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;
    const blocked = (seed + i * 7) % 5 === 0;
    return {
      id: staffId * 10000 + i,
      staffId,
      date,
      startTime: start,
      endTime,
      status: blocked ? "BOOKED" : "AVAILABLE",
    } satisfies TimeSlot;
  });
}
