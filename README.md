# Krishi Watch

Lovable Prompt — KrishiRakshak: Village-Level Crop Disease Outbreak Radar

Build a full working web app called "KrishiRakshak — Outbreak Radar", an AI-powered crop disease early-warning system for Indian farmers. This is a hackathon demo project — prioritize a polished, animated, "wow factor" UI with realistic mock data over real backend ML (simulate the AI, don't actually train a model).

Core Concept

Individual farmers scan crop leaves via photo upload. The system "detects" the disease (simulated AI with realistic delay + confidence score), logs it with geolocation, and aggregates all nearby scans into a LIVE heatmap showing disease outbreak zones across a district — so a farmer 5km away gets warned BEFORE the disease reaches their field, not after.

Tech Stack

React + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion for animations. Use Leaflet.js (react-leaflet) with OpenStreetMap tiles for the map (no API key needed). Use Recharts for graphs. Use Supabase for storing scan records (so data persists and the "live" aggregation feels real).

Pages / Flows

1. Landing Page — Hero section with animated gradient background, tagline "Detect Early. Warn Neighbors. Save Harvests." Stats counter animation (e.g. "12,400 farmers protected", "340 outbreaks contained early"). CTA buttons: "Scan My Crop" (farmer view) and "District Command Center" (admin/officer view).

2. Farmer View — Scan Flow

Step 1: Upload/capture leaf photo (drag-drop + camera icon), select crop type (dropdown: Rice, Wheat, Cotton, Tomato, Sugarcane, etc.), auto-capture geolocation (use browser geolocation, fallback to a mock Karnataka village coordinate).

Step 2: Animated "AI Analyzing..." loading state (2-3 sec, scanning-line animation over the leaf image) then reveal results: Disease name, confidence %, severity (Low/Medium/High/Critical) with a color-coded badge, and a short plain-language explanation.

Step 3: Actionable advisory card — organic + chemical treatment options, estimated cost, estimated yield-loss-if-untreated in ₹, nearest input dealer (mock data), and a "Notify nearby farmers" toggle (on by default) that submits this scan into the shared outbreak map.

Step 4: "We'll check back in 5 days" — treatment verification reminder card.

Include a language toggle (English / Hindi / Kannada) — at minimum translate key UI labels.

3. District Command Center (Admin/Officer Dashboard)

Full-screen interactive Leaflet map of a sample district (center it on Karnataka, e.g. Mandya district coords 12.5242° N, 76.8958° E) with animated pulsing markers for each disease scan, color-coded by severity, clustered by proximity.

A live-updating "outbreak heatmap" overlay (use react-leaflet heatmap layer or colored circle radius scaling with local scan density) showing red/orange zones where disease density is spiking.

Side panel: real-time feed of incoming scans ("Farmer in Srirangapatna reported Rice Blast — 2 min ago") with slide-in animation for new entries.

Top stats bar: Active Outbreaks, Farmers Alerted Today, Diseases Trending This Week (small bar chart), Estimated Crop Value at Risk (₹).

Click any hotspot cluster → popup showing disease name, number of affected farms, spread trend (mini sparkline chart), and a "Broadcast Alert to Zone" button (simulated SMS/WhatsApp push with a success toast).

A "Predicted Spread" toggle that shows an animated expanding radius/gradient around active hotspots simulating next-72-hour spread risk based on wind/humidity (mock this with a simple radius animation, label it clearly as a predictive model output).

4. Alerts/Notifications demo panel — Show a mock phone mockup with a WhatsApp-style/SMS-style alert bubble: "⚠️ Rice Blast detected 3km from your farm. Inspect your crop and consider preventive spray. Tap for guidance." with a subtle slide/fade-in animation, to visually sell the "warns neighbors" concept during a live demo.

Design Requirements

Clean agri-tech aesthetic: deep green (#1B5E20 / #2E7D32) + warm amber accents (#F9A825), white/off-white backgrounds, rounded-2xl cards, soft shadows.

Use Framer Motion for: page transitions, number counters, map marker pulse/glow animations, card reveal on scroll, and the scanning-line animation during "AI analysis."

Fully responsive, mobile-first for the Farmer View (this is what a farmer would use on a phone), desktop-optimized layout for the Command Center.

Populate with realistic seeded mock data for ~40-60 scan records spread across 5-6 villages so the map and dashboard look genuinely "live" and busy, not empty.

Data Model (Supabase table: scans)

id, crop_type, disease_name, confidence, severity, latitude, longitude, village_name, farmer_name (mock), status (active/treated), created_at

Seed this table with realistic varied data on load so the demo works instantly without manual data entry.

Priority Order (build in this sequence if constrained on scope)

District Command Center map with animated markers + heatmap (this is the core "wow" feature — get this working first and polished)

Farmer scan flow with simulated AI detection

Landing page

Alerts demo panel

Language toggle

Do not spend effort on real ML/CV integration — all disease detection should be simulated using the seeded dataset (pick a plausible disease based on selected crop type + randomized confidence) so the demo runs reliably live without needing internet-dependent AI APIs.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3025b308-5802-4c94-aef0-e2048369c2e1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
