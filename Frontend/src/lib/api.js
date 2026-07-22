import { useQuery } from "@tanstack/react-query";
import haircutImg from "@/assets/services/haircut.jpg";
import beardImg from "@/assets/services/beard.jpg";
import colorImg from "@/assets/services/color.jpg";
import spaImg from "@/assets/services/spa.jpg";
import nailsImg from "@/assets/services/nails.jpg";
import makeupImg from "@/assets/services/makeup.jpg";
import kidsImg from "@/assets/services/kids.jpg";
import blowoutImg from "@/assets/services/blowout.jpg";

const API_BASE = "http://localhost:8080/api";

const SERVICE_IMAGES = {
  "Signature Haircut": haircutImg,
  "Classic Beard Trim": beardImg,
  "Full Colour": colorImg,
  "Balayage": colorImg,
  "Scalp & Hair Spa": spaImg,
  "Gel Manicure": nailsImg,
  "Bridal Makeup": makeupImg,
  "Kids Cut": kidsImg,
  "Blow-Dry & Style": blowoutImg,
};

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/services`);
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      // Map local images to the fetched services based on serviceName
      return data.map((s) => ({
        ...s,
        imageUrl: SERVICE_IMAGES[s.serviceName] || haircutImg, // fallback image
      }));
    },
  });
}

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/staff`);
      if (!res.ok) throw new Error("Failed to fetch staff");
      const data = await res.json();
      return data.map((st) => ({
        ...st,
        serviceIds: st.serviceIds || (st.services ? st.services.map((s) => s.id) : []),
      }));
    },
  });
}

export function useStaffSlots(staffId, date) {
  return useQuery({
    queryKey: ["staff-slots", staffId, date],
    queryFn: async () => {
      if (!staffId || !date) return [];
      const res = await fetch(`${API_BASE}/staff/${staffId}/slots?date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch slots");
      return res.json();
    },
    enabled: !!staffId && !!date,
  });
}
