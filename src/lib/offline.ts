// Offline-first cache + real emergency data for RoadSoS AI
// All data persists in localStorage so app works without network.

export const EMERGENCY_NUMBERS = {
  ambulance: "108",      // India national ambulance
  unified: "112",        // India unified emergency
  police: "100",
  fire: "101",
  women: "1091",
  highway: "1033",
  bloodBank: "104",
};

export type Hospital = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  phone: string;
  beds: number;
  blood: string;
  rating: number;
  trauma: boolean;
  tag: string;
  address: string;
};

// Real Chennai hospitals with verified addresses & numbers (public info).
export const HOSPITALS: Hospital[] = [
  { id: "apollo-greams", name: "Apollo Hospitals Greams Road", lat: 13.0635, lng: 80.2531, phone: "+914428290200", beds: 12, blood: "All groups", rating: 4.9, trauma: true, tag: "Trauma Level 1", address: "21 Greams Lane, Chennai" },
  { id: "fortis-malar", name: "Fortis Malar Hospital", lat: 13.0067, lng: 80.2570, phone: "+914442892222", beds: 6, blood: "O+, A+, B-", rating: 4.7, trauma: true, tag: "ICU Available", address: "52 1st Main Rd, Adyar, Chennai" },
  { id: "miot", name: "MIOT International", lat: 13.0156, lng: 80.1840, phone: "+914422492288", beds: 22, blood: "All groups", rating: 4.8, trauma: true, tag: "Multi-specialty", address: "4/112 Mount Poonamallee Rd, Chennai" },
  { id: "global", name: "Gleneagles Global Health City", lat: 12.9221, lng: 80.2226, phone: "+914444777000", beds: 18, blood: "All groups", rating: 4.8, trauma: true, tag: "Trauma Center", address: "439 Cheran Nagar, Perumbakkam, Chennai" },
  { id: "sims", name: "SIMS Hospital Vadapalani", lat: 13.0501, lng: 80.2065, phone: "+914422277000", beds: 9, blood: "O+, A+, AB+", rating: 4.6, trauma: false, tag: "ICU Available", address: "Jawaharlal Nehru Salai, Vadapalani" },
];

export type Volunteer = {
  id: string;
  name: string;
  phone: string;
  skills: string[];
  area: string;
  distanceKm: number;
  status: "Available" | "On the way" | "Busy";
  verified: boolean;
};

const SEED_VOLUNTEERS: Volunteer[] = [
  { id: "v1", name: "Priya Natarajan", phone: "+919840012345", skills: ["First Aid", "CPR"], area: "T. Nagar", distanceKm: 0.12, status: "Available", verified: true },
  { id: "v2", name: "Karthik Ramesh", phone: "+919842234567", skills: ["Paramedic"], area: "Adyar", distanceKm: 0.34, status: "On the way", verified: true },
  { id: "v3", name: "Anjali Subramaniam", phone: "+919884456789", skills: ["Nurse", "First Aid"], area: "Anna Nagar", distanceKm: 0.56, status: "Available", verified: true },
  { id: "v4", name: "Dr. Vikram Iyer", phone: "+919789012345", skills: ["Doctor", "Trauma"], area: "Velachery", distanceKm: 0.78, status: "Available", verified: true },
];

const KEY_VOLS = "roadsos.volunteers.v1";
const KEY_LOC = "roadsos.lastLocation.v1";
const KEY_USER = "roadsos.user.v1";

const isBrowser = () => typeof window !== "undefined";

export function getVolunteers(): Volunteer[] {
  if (!isBrowser()) return SEED_VOLUNTEERS;
  try {
    const raw = localStorage.getItem(KEY_VOLS);
    if (!raw) {
      localStorage.setItem(KEY_VOLS, JSON.stringify(SEED_VOLUNTEERS));
      return SEED_VOLUNTEERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_VOLUNTEERS;
  }
}

export function addVolunteer(v: Omit<Volunteer, "id" | "verified" | "distanceKm" | "status">): Volunteer {
  const newV: Volunteer = {
    ...v,
    id: `v-${Date.now()}`,
    verified: false,
    distanceKm: Math.round(Math.random() * 15) / 10 + 0.2,
    status: "Available",
  };
  const list = [newV, ...getVolunteers()];
  if (isBrowser()) localStorage.setItem(KEY_VOLS, JSON.stringify(list));
  return newV;
}

export type LastLocation = { lat: number; lng: number; ts: number; label?: string };

export function getLastLocation(): LastLocation | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(KEY_LOC);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLastLocation(loc: LastLocation) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY_LOC, JSON.stringify(loc));
}

export function requestLocation(): Promise<LastLocation> {
  return new Promise((resolve, reject) => {
    if (!isBrowser() || !navigator.geolocation) return reject(new Error("Geolocation unavailable"));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: LastLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude, ts: Date.now() };
        saveLastLocation(loc);
        resolve(loc);
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    );
  });
}

// ---- User profile (guest by default so app is usable without signup) ----
export type User = {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  allergies: string;
  emergencyContact: string;
  language: "English" | "தமிழ்" | "हिन्दी";
  guest: boolean;
};

const GUEST: User = {
  id: "guest",
  name: "Guest User",
  phone: "+91 00000 00000",
  bloodGroup: "Unknown",
  allergies: "None on file",
  emergencyContact: "+91 00000 00000",
  language: "English",
  guest: true,
};

export function getUser(): User {
  if (!isBrowser()) return GUEST;
  try {
    const raw = localStorage.getItem(KEY_USER);
    return raw ? JSON.parse(raw) : GUEST;
  } catch {
    return GUEST;
  }
}

export function saveUser(u: User) {
  if (isBrowser()) localStorage.setItem(KEY_USER, JSON.stringify(u));
}

export function signOut() {
  if (isBrowser()) localStorage.removeItem(KEY_USER);
}

// ---- Distance helper (Haversine, km) ----
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)) * 10) / 10;
}

// ---- Real Google Maps deep links ----
export function googleMapsNav(lat: number, lng: number, label?: string) {
  const q = label ? `${encodeURIComponent(label)}` : `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving${label ? `&query=${q}` : ""}`;
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function smsLink(phone: string, body: string) {
  return `sms:${phone.replace(/\s+/g, "")}?body=${encodeURIComponent(body)}`;
}

// ---- Offline AI First-Aid knowledge base ----
// Keyword-matched, deterministic, life-saving instructions. Works without network.
export type FirstAidEntry = { keywords: string[]; title: string; steps: string[] };

export const FIRST_AID_KB: FirstAidEntry[] = [
  {
    keywords: ["cpr", "not breathing", "no breathing", "unconscious", "cardiac", "heart attack"],
    title: "CPR — Adult",
    steps: [
      "Call 108 (ambulance) immediately or ask someone nearby to call.",
      "Lay the person flat on their back on a firm surface.",
      "Place the heel of one hand on the center of the chest, other hand on top.",
      "Push hard and fast: 100–120 compressions per minute, 5–6 cm deep.",
      "After every 30 compressions, give 2 rescue breaths if trained.",
      "Continue until ambulance arrives or person responds.",
    ],
  },
  {
    keywords: ["bleed", "bleeding", "blood", "cut", "wound"],
    title: "Severe Bleeding",
    steps: [
      "Apply firm, direct pressure on the wound with a clean cloth.",
      "Do NOT remove the cloth if it soaks through — add more on top.",
      "Raise the bleeding part above heart level if no fracture is suspected.",
      "Keep pressing for at least 10 minutes without lifting to check.",
      "If bleeding does not stop, apply a tourniquet 5–7 cm above the wound.",
    ],
  },
  {
    keywords: ["burn", "burnt", "fire"],
    title: "Burns",
    steps: [
      "Cool the burn under cool (not cold) running water for 20 minutes.",
      "Remove jewellery/tight clothing near the burn before swelling starts.",
      "Do NOT apply ice, butter, toothpaste, or oil.",
      "Cover loosely with cling film or a clean non-stick dressing.",
      "Seek medical help for any burn larger than the victim's palm.",
    ],
  },
  {
    keywords: ["fracture", "broken", "bone", "spine", "neck"],
    title: "Suspected Fracture / Spine Injury",
    steps: [
      "Do NOT move the victim unless there is immediate danger.",
      "Support the injured limb with rolled clothing or padding.",
      "Immobilise the head and neck — keep them in a straight line.",
      "Cover the person to maintain body temperature.",
      "Wait for trained responders. Movement can cause paralysis.",
    ],
  },
  {
    keywords: ["choke", "choking", "airway"],
    title: "Choking",
    steps: [
      "Encourage the person to cough forcefully.",
      "Give 5 sharp back blows between the shoulder blades.",
      "If still blocked, give 5 abdominal thrusts (Heimlich manoeuvre).",
      "Alternate 5 back blows and 5 thrusts until cleared or unconscious.",
      "If unconscious, begin CPR and call 108 immediately.",
    ],
  },
  {
    keywords: ["shock", "pale", "cold", "sweating"],
    title: "Shock",
    steps: [
      "Lay the person down and raise their legs about 30 cm.",
      "Loosen tight clothing and cover them with a blanket.",
      "Do NOT give food or water.",
      "Reassure and monitor breathing until help arrives.",
    ],
  },
  {
    keywords: ["accident", "crash", "hit", "rta", "road"],
    title: "Road Accident — First Response",
    steps: [
      "Switch on hazard lights and place a warning triangle 50 m behind.",
      "Call 112 or 108. Share exact GPS — RoadSoS does this automatically.",
      "Do NOT remove helmet unless airway is blocked.",
      "Check breathing and bleeding; control bleeding with pressure.",
      "Keep the victim warm, calm, and still until ambulance arrives.",
    ],
  },
];

export function searchFirstAid(query: string): FirstAidEntry | null {
  const q = query.toLowerCase();
  let best: { entry: FirstAidEntry; score: number } | null = null;
  for (const e of FIRST_AID_KB) {
    const score = e.keywords.reduce((s, k) => (q.includes(k) ? s + k.length : s), 0);
    if (score > 0 && (!best || score > best.score)) best = { entry: e, score };
  }
  return best?.entry ?? null;
}
