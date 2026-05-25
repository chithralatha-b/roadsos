import { supabase } from "@/integrations/supabase/client";
import { getUser, saveLastLocation, type LastLocation } from "./offline";

export type EmergencyRequest = {
  id: string;
  name: string | null;
  phone: string | null;
  lat: number;
  lng: number;
  address: string | null;
  severity: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

export async function createEmergency(opts: { lat: number; lng: number; address?: string; severity?: string; notes?: string }) {
  const user = getUser();
  saveLastLocation({ lat: opts.lat, lng: opts.lng, ts: Date.now() });
  const { data, error } = await supabase
    .from("emergency_requests")
    .insert({
      name: user.guest ? "Guest" : user.name,
      phone: user.guest ? null : user.phone,
      lat: opts.lat,
      lng: opts.lng,
      address: opts.address ?? null,
      severity: opts.severity ?? "critical",
      notes: opts.notes ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as EmergencyRequest;
}

export async function listActiveEmergencies(): Promise<EmergencyRequest[]> {
  const { data, error } = await supabase
    .from("emergency_requests")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return [];
  return (data ?? []) as EmergencyRequest[];
}

export async function resolveEmergency(id: string) {
  await supabase.from("emergency_requests").update({ status: "resolved" }).eq("id", id);
}

// --- DB volunteers ---
export type DbVolunteer = {
  id: string;
  name: string;
  phone: string;
  area: string | null;
  skills: string[];
  lat: number | null;
  lng: number | null;
  available: boolean;
  verified: boolean;
};

export async function listDbVolunteers(): Promise<DbVolunteer[]> {
  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return [];
  return (data ?? []) as DbVolunteer[];
}

export async function registerDbVolunteer(v: { name: string; phone: string; area?: string; skills: string[]; lat?: number; lng?: number }) {
  const { data, error } = await supabase.from("volunteers").insert(v).select().single();
  if (error) throw error;
  return data as DbVolunteer;
}

export function getCurrentPosition(): Promise<LastLocation> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return reject(new Error("Geolocation unavailable"));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, ts: Date.now() }),
      reject,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30_000 },
    );
  });
}
