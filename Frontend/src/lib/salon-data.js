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

// The backend `ServiceCategory` enum is empty in the reference repo, so we
// treat category as a free-form string label managed on the frontend.

/* --------------------------------- Mock data ---------------------------------
 * The backend runs separately (Spring Boot + MySQL). While it's not connected,
 * these mocks keep the UI fully functional. Swap the four functions at the
 * bottom of this file for `fetch(...)` calls to hit the real API.
 * ------------------------------------------------------------------------- */

// Removed mock SERVICES and STAFF. Now fetching from backend via api.js

export const CATEGORIES = [
  { value: "ALL", label: "All" },
  { value: "HAIR", label: "Hair" },
  { value: "BEARD", label: "Beard" },
  { value: "COLOR", label: "Colour" },
  { value: "SPA", label: "Spa" },
  { value: "NAILS", label: "Nails" },
  { value: "MAKEUP", label: "Makeup" },
];

// generateSlotsFor has been removed in favor of backend API calls.
