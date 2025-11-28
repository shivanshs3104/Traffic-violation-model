# System Architecture

## Application Flow

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│              (http://localhost:3000)                    │
└──────────────────────────┬──────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
    ┌────▼────────┐                    ┌────▼────────┐
    │   React     │                    │   Static    │
    │ Components  │                    │   Assets    │
    └────┬────────┘                    └─────────────┘
         │
         │ fetch() with JWT Token
         │
    ┌────▼──────────────────────────────────────┐
    │         FLASK API SERVER                  │
    │       (http://localhost:5000)             │
    │                                           │
    │  ┌──────────────────────────────────────┐ │
    │  │  Authentication Service              │ │
    │  │  - JWT Token Generation              │ │
    │  │  - Login Verification                │ │
    │  └──────────────────────────────────────┘ │
    │                                           │
    │  ┌──────────────────────────────────────┐ │
    │  │  API Routes                          │ │
    │  │  - /api/violations                   │ │
    │  │  - /api/analysis/*                   │ │
    │  │  - /api/export/*                     │ │
    │  └──────────────────────────────────────┘ │
    │                                           │
    │  ┌──────────────────────────────────────┐ │
    │  │  Data Processing Layer               │ │
    │  │  - Violations Report Loading         │ │
    │  │  - Data Analysis                     │ │
    │  │  - CSV/JSON Conversion               │ │
    │  └──────────────────────────────────────┘ │
    └────┬──────────────────────────────────────┘
         │
         │ File I/O
         │
    ┌────▼──────────────────────────────────────┐
    │         DATA SOURCES                      │
    │                                           │
    │  violations_report.json                   │
    │  (3425+ violation records)                │
    └───────────────────────────────────────────┘
```

## Component Architecture

```
App.js (Main Router)
│
├── LoginPage
│   ├── Form Inputs
│   └── JWT Token Handler
│
├── Dashboard
│   ├── Navbar
│   └── Stats Cards
│       ├── Total Violations
│       ├── Violation Types
│       ├── Vehicles
│       └── Persons
│
├── Violations
│   ├── Navbar
│   ├── Violation List
│   │   ├── Violation Card
│   │   │   ├── Header Info
│   │   │   ├── Badges
│   │   │   └── Details (Expandable)
│   │   └── Pagination Controls
│   └── Error Handling
│
├── Analysis
│   ├── Navbar
│   ├── Tab Navigation
│   │   ├── Overview Tab
│   │   │   ├── Statistics Cards
│   │   │   └── Chart
│   │   ├── Timeline Tab
│   │   │   └── Bar Chart
│   │   └── Types Tab
│   │       └── Type Cards
│   └── Charts & Graphs
│
└── Export
    ├── Navbar
    ├── Export Options
    │   ├── CSV Export
    │   └── JSON Export
    └── Info Cards
```

## Data Flow

### 1. Authentication Flow
```
User Input (Username/Password)
    ↓
POST /api/auth/login
    ↓
Backend Verification
    ↓
JWT Token Generation
    ↓
Store Token in Local Storage
    ↓
Redirect to Dashboard
```

### 2. Data Fetch Flow
```
User Action (Navigate/Filter)
    ↓
React Component State Update
    ↓
fetch() with Authorization Header
    ↓
Backend Route Handler
    ↓
Data Processing
    ↓
JSON Response
    ↓
Update Component State
    ↓
Re-render with New Data
```

### 3. Export Flow
```
User Clicks Export
    ↓
Select Format (CSV/JSON)
    ↓
POST /api/export/{format}
    ↓
Backend Processes Data
    ↓
Generate File
    ↓
Send File Response
    ↓
Browser Download
```

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Components: Dashboard, Violations, Analysis      │   │
│  │ Routing: React Router                           │   │
│  │ State: Local State + Local Storage              │   │
│  │ Styling: CSS3 with Responsive Grid              │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬─────────────────────────────────┘
                       │ fetch() API
┌──────────────────────▼─────────────────────────────────┐
│                  BACKEND (Flask)                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Routes: RESTful API Endpoints                    │   │
│  │ Auth: JWT with Flask-JWT-Extended              │   │
│  │ CORS: Flask-CORS for Cross-Origin              │   │
│  │ Data: JSON Processing & Analysis               │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬─────────────────────────────────┘
                       │ File I/O
┌──────────────────────▼─────────────────────────────────┐
│              DATA LAYER (Files)                         │
│  violations_report.json - Main Data Source             │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
Local Development:
┌─────────────────────────────────────────┐
│ Browser: http://localhost:3000          │
│ API: http://localhost:5000              │
│ Dev Server: npm start (Webpack Dev)     │
└─────────────────────────────────────────┘

Production:
┌──────────────────────────────────────────┐
│         Web Server (Nginx/Apache)        │
│ ┌──────────────────────────────────────┐ │
│ │  Frontend (React Build Output)       │ │
│ │  Static Files: HTML, CSS, JS, Images │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │  Backend (Gunicorn/uWSGI)            │ │
│ │  Flask API                           │ │
│ │  Data Access                         │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│        Request from Browser              │
└────────────────────┬────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Check JWT Token       │
         │ (Authorization Header)│
         └───────────┬───────────┘
                     │
            ┌────────┴────────┐
            │                 │
       ┌────▼────┐      ┌────▼────┐
       │ Valid   │      │ Invalid  │
       │ Token   │      │ Token    │
       └────┬────┘      └────┬─────┘
            │                │
            ▼                ▼
     ┌────────────┐    ┌──────────┐
     │ Allow      │    │ Reject   │
     │ Access     │    │ 401      │
     │ to API     │    │ Unauth.  │
     └────┬───────┘    └──────────┘
          │
          ▼
   ┌─────────────────┐
   │ Execute Handler │
   │ Return Data     │
   └─────────────────┘
```

## Error Handling Flow

```
User Action
    ↓
Try/Catch Block
    ↓
    ├─► Network Error
    │   └─► Show Connection Error Message
    │
    ├─► API Error (4xx/5xx)
    │   └─► Show Specific Error Message
    │
    ├─► Validation Error
    │   └─► Show Validation Error
    │
    └─► Success
        └─► Update UI with Data
```

## Performance Optimization

```
Frontend:
├── Code Splitting (React.lazy)
├── Image Optimization
├── CSS Minification
├── Local Storage Caching
└── Efficient Re-renders

Backend:
├── Pagination (10 items per page)
├── Response Compression
├── Data Processing Optimization
└── JSON Serialization
```

## Database-Ready Architecture

```
Current: File-based (JSON)
    ↓
Future: Database Integration
    
    ├─ SQLite (Development)
    ├─ PostgreSQL (Production)
    └─ MongoDB (NoSQL option)
    
    All changes would be in backend/app.py
    Frontend remains the same
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalable component structure
- ✅ Secure authentication
- ✅ Efficient data flow
- ✅ Easy to maintain and extend
- ✅ Ready for database integration
