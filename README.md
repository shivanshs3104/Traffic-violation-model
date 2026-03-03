# AI Driven Traffic Violation Detection System

A clean, responsive admin dashboard for AI+ANPR traffic violations with charts, proof images, filters, and CSV exports.

Demo login:
- Email: admin@traffic.ai
- Password: admin123
- <img width="1919" height="872" alt="Screenshot 2025-11-29 115006" src="https://github.com/user-attachments/assets/23bc6880-a946-49c4-8956-95462b7ca010" />

- <img width="1919" height="872" alt="Screenshot 2025-11-29 122148" src="https://github.com/user-attachments/assets/087f8ab5-fc6e-403c-aa6b-3f882bd49429" />

- <img width="1910" height="871" alt="Screenshot 2025-11-29 123448" src="https://github.com/user-attachments/assets/8757e499-4578-44c7-a0b5-9f419aa14801" />




## Highlights
- Glassmorphism UI (indigo/violet theme) with background image overlay
- Fixed, collapsible sidebar + Violations submenu (All, Overspeeding, Red Light Jump, No Helmet, Wrong Lane)
- Dashboard: stats, monthly violations line chart, payments bar + progress, recent table
- Violations: full table, search/status/type filters, proof modal (image + plate crop), mark paid
- Analysis: area/type charts + heat tiles
- Reports: CSV exports (violations, area summary, type summary) + print snapshot
- Works with local JSON/CSV or a live API (fallback-safe)

## Project Structure (minimal)
```
index.html
dashboard.html
css/style.css
js/login.js
js/dashboard.js
data/violations.json        # predictions
data/results/images/        # proof images (filenames match JSON)
server/ (optional Express mock)
```

## Quick Start
- Recommended (local server)
  - VS Code: Open with Live Server
  - Or Python: python3 -m http.server 5500 → http://localhost:5500
- Then open index.html, login with demo creds

Tip: Fetch and CDN scripts work reliably via http://localhost…, not file://

## Data Source
- Default: js/dashboard.js loads data/violations.json
- Supported shapes:
  - Array: [ {...}, {...} ]
  - Wrapped: { "violations": [...] } or { "data": [...] } or { "results": [...] }
- Minimal example:
```json
[
  { "license_plate": "MH12AB1234", "violation": "Overspeeding", "area":"Airport Flyover",
    "timestamp":"2025-09-02T09:20:00", "fine":1200, "status":"Pending",
    "image":"overspeed_01.jpg", "plate_crop":"overspeed_01_plate.jpg" }
]
```
- Proof images go in data/results/images/

Optional API: switch the source in js/dashboard.js (SOURCE_URL or API_URL) and enable CORS on backend.

## Usage
- Sidebar → navigate; Violations submenu toggles on click (closed by default)
- Search by name/plate/type/area; Status filter; Type filter normalizes variants (e.g., “over speed” → Overspeeding)
- “View” opens proof modal; “Mark Paid” updates stats/charts
- Reports → export CSVs; Print snapshot via browser

## Troubleshooting
- Data not loading: ensure http://localhost:PORT/data/violations.json returns JSON; use forward slashes in paths
- Charts missing: need Chart.js CDN (or include locally)
- “All” shows nothing: hard refresh; we treat All as no filter
- Images broken: confirm filenames in JSON match files in data/results/images/

## Tech Stack
HTML, CSS (glassmorphism), JavaScript, Chart.js, Remix Icon, Google Fonts (Inter, Poppins)
Optional: Node/Express mock server
