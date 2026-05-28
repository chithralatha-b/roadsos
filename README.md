#  RoadSOS
AI-Powered Smart Emergency Response & Road Safety System

---

#  Project Overview

RoadSOS is a smart road safety and emergency response application designed to assist users during accidents, emergencies, and unsafe driving situations.

The system combines:
- Emergency SOS alerts
- Live GPS tracking
- AI-powered first aid guidance
- Driver safety monitoring
- Emergency contact alerts
- Volunteer rescue coordination
- Nearby hospital detection
- Road risk alerts
- Family safety monitoring

The project is built as a smart safety ecosystem focused on improving emergency response accessibility and road safety awareness.

---

#  Problem Statement

Road accidents and emergency situations often suffer from:
- Delayed emergency response
- Lack of nearby medical assistance
- Unsafe driving behavior
- Poor communication with family members
- Lack of real-time road safety awareness
- Limited access to first aid guidance

RoadSOS aims to solve these problems using AI assistance, live tracking, emergency communication systems, and smart safety monitoring.

---

#  Features

#  Emergency SOS System
- One-click emergency alert
- Sends emergency notifications
- Shares live location
- Emergency coordination support
- SOS alerts for:
  - Family members
  - Volunteers
  - Ambulance services

---

# Live GPS & Location Tracking
- Real-time user location tracking
- Interactive live maps
- Movement tracking
- Stationary movement detection
- Speed monitoring using map/location data

---

#  Nearby Hospitals
- Find nearest hospitals
- Distance-based hospital listing
- Trauma/ICU filtering
- Quick emergency access

---

#  AI First Aid Assistant
- AI-powered emergency guidance
- Basic first-aid support
- Emergency recommendations
- Quick emergency prompts

---

#  Emergency Services Access
- Quick emergency calling
- Ambulance contact support
- Police emergency support
- Volunteer emergency assistance

---

# Family Safety Mode
- View family member status
- Emergency contact alerts
- Live safety tracking
- Emergency location sharing

---

#  Driver Safety Monitoring

The system includes smart driver safety monitoring features such as:

- Phone usage detection
- Drowsiness status
- Speed tracking
- Safety streak system
- Stationary status tracking
- Driving behavior monitoring

---

#  Safety Score & Streak System

The application maintains a driver safety score based on:
- Safe driving
- Reduced phone usage
- Controlled speed
- Reduced unsafe behavior

Safety streaks are used to encourage responsible driving behavior.

Current values are prototype/demo-based and displayed dynamically for simulation purposes.

---

#  Road Risk Alerts
- Displays road safety alerts
- Risk notifications
- Safety warnings
- Driving awareness system

---

#  Accident Reporting
- Accident report dashboard
- Incident details
- Emergency submission workflow
- Rescue coordination support

---

#  Rescue & Volunteer Coordination
- Volunteer rescue assistance
- Vehicle rescue support
- Rescue tracking workflow
- Emergency coordination system

---

#  Offline Support
- Offline-first emergency support
- Local data storage
- GPS caching
- Emergency persistence

---

#  Prototype Status

Some features in the current version are implemented as:
- UI prototypes
- Simulated workflows
- Demo logic
- Randomized display values

The purpose is to demonstrate:
- System architecture
- Workflow design
- Future scalability
- Real-world implementation ideas

Future versions are planned to integrate:
- Real sensor-based detection
- Realtime analytics
- AI-powered monitoring
- Live emergency services integration

---

#  Technologies Used

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Router

---

## Backend & APIs
- Supabase
- Google Maps API

---

## UI Libraries
- Radix UI
- Lucide React

---

#  Project Structure

```text
ROAD-SOS/
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── BottomNav.tsx
│   │   ├── FloatingChatbot.tsx
│   │   ├── LiveMap.tsx
│   │   ├── MobileShell.tsx
│   │   └── SpeedBanner.tsx
│   │
│   ├── hooks/
│   │   └── use-mobile.tsx
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── auth-attacher.ts
│   │       ├── auth-middleware.ts
│   │       ├── client.server.ts
│   │       ├── client.ts
│   │       └── types.ts
│   │
│   ├── lib/
│   │   ├── ai-gateway.server.ts
│   │   ├── emergency.ts
│   │   ├── error-capture.ts
│   │   ├── error-page.ts
│   │   ├── offline.ts
│   │   └── utils.ts
│   │
│   ├── routes/
│   ├── router.tsx
│   ├── routeTree.gen.ts
│   ├── server.ts
│   ├── start.ts
│   └── styles.css
│
├── supabase/
│   ├── migrations/
│   └── config.toml
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.jsonc
```

---
#  Installation Guide

# 1️ Install Node.js

Download Node.js:

https://nodejs.org

Recommended version:
- Node.js v18+

Verify installation:

```bash
node -v
npm -v
```

---

#  Install Dependencies

Open terminal inside project folder.

Run:

```bash
npm install
```

---

#  Environment Variables

Create `.env` file:

```env
SUPABASE_PUBLISHABLE_KEY=your_key
SUPABASE_URL=your_url

VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY=your_google_maps_key
VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID=your_tracking_id

VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_key
VITE_SUPABASE_URL=your_url
```

---

#  Run Project

```bash
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

---

#  Build Project

```bash
npm run build
```

---

#  Application Workflow

#  Emergency Workflow

```text
User Presses SOS
       ↓
Live GPS Location Retrieved
       ↓
Emergency Request Generated
       ↓
SOS Alerts Sent
       ↓
Family / Volunteers Notified
       ↓
Nearby Help Coordinated
```

---

#  AI Assistant Workflow

```text
User Sends Emergency Query
       ↓
AI Assistant Processes Request
       ↓
Emergency Guidance Generated
       ↓
Response Displayed To User
```

---

#  Driver Safety Workflow

```text
User Driving Activity Monitored
       ↓
Safety Parameters Checked
       ↓
Safety Score Calculated
       ↓
Streak System Updated
       ↓
Safety Recommendations Generated
```

---

#  Hospital Workflow

```text
User Location Retrieved
       ↓
Nearby Hospitals Calculated
       ↓
Distance Sorted
       ↓
Hospitals Displayed On Map
```

---

#  Security Notes

- Do NOT upload `.env` publicly
- Protect API keys
- Restrict Google Maps API usage
- Never expose secret backend keys

---

#  Future Improvements

- Real accident detection using sensors
- AI-based drowsiness detection
- Realtime emergency tracking
- Live ambulance integration
- Voice-triggered SOS
- Realtime safety analytics
- Smart road hazard prediction

---

#  Hackathon Value

RoadSOS focuses on:
- Public safety
- AI integration
- Smart emergency response
- Driver safety awareness
- Offline-first architecture
- Real-world social impact

---

#  Developed For

- Hackathons
- Smart City Projects
- Innovation Challenges
- Student Portfolio Projects

---

#  Final Note

RoadSOS is designed as a smart emergency and road safety ecosystem that combines AI assistance, live tracking, emergency communication, safety monitoring, and rescue coordination to improve public safety accessibility during critical situations.
