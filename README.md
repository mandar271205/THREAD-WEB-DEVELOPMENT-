# ThreadCounty

ThreadCounty is an AI-powered textile fabric analysis SaaS platform built for the ThreadCounty Web Development Hackathon 2026.

## Features
- **Fabric Analysis:** AI-powered thread density and weave classification.
- **Mock Deterministic Engine:** Fully functional deterministic mock layer for the AI.
- **Reporting:** Automatic generation and download of PDF analysis reports.
- **Dashboard:** Track all uploads, history, and analytics.

## Tech Stack
- **Frontend:** Next.js 15, React, Tailwind CSS, ShadCN UI, Framer Motion
- **Backend:** FastAPI (Python), ReportLab
- **Database & Auth:** Supabase (PostgreSQL, Auth, Storage)

## Setup Instructions

### Prerequisites
- Node.js & npm
- Python 3.9+ & pip
- Supabase account with configured project

### 1. Database Setup
Run the `supabase_migration.sql` script in your Supabase SQL editor to create the necessary tables (`reports`, `uploads`, `subscriptions`, etc.).

Ensure you create a storage bucket named `files` and make it public if necessary, or configure policies accordingly.

### 2. Configure Environment Variables
**Frontend (`nextjs/.env.local`):**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_PRODUCTNAME=ThreadCounty
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend (`threadcounty-api/.env`):**
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
SUPABASE_JWT_SECRET=your_jwt_secret
```

### 3. Run Locally (Windows)
Double-click `start_all.bat` or run:
```bash
./start_all.bat
```

This will:
1. Install Python dependencies and start the FastAPI backend on port 8000.
2. Start the Next.js frontend development server on port 3000.

Visit [http://localhost:3000](http://localhost:3000) to see the app!
