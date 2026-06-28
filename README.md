<div align="center">
  <img src="https://via.placeholder.com/150/4F46E5/FFFFFF?text=TC" alt="ThreadCounty Logo" width="100" height="100" style="border-radius: 20px;">
  
  # 🧵 ThreadCounty AI

  **Next-Generation Textile Fabric Analysis Platform**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?logo=supabase)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
</div>

<br />

## 🌟 Overview
ThreadCounty is a cutting-edge SaaS platform designed for the textile industry. It utilizes advanced computer vision and machine learning logic to analyze fabric images, determine weave patterns, calculate thread densities (EPI/PPI), and automatically generate professional PDF reports. 

Built with a highly scalable **Next.js** frontend, a fast **Python/FastAPI** backend, and securely backed by **Supabase**.

---

## ✨ Key Features
- **🤖 AI Fabric Analysis:** Upload high-resolution images of fabrics to instantly receive thread density counts and structural weave pattern recognition.
- **🔐 Secure Authentication:** Seamless user onboarding with Supabase Email & Password authentication.
- **📊 Admin Control Panel:** A dedicated portal (`/app/admin`) for administrators to view platform analytics, suspend/activate users, and track system usage via interactive Recharts.
- **📄 Automated PDF Reports:** Generates standardized, highly detailed PDF analysis reports using Python's `reportlab`.
- **🌙 Premium Dark UI:** An immersive, glassmorphic dark-mode interface built with Tailwind CSS and Framer Motion.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| --- | --- |
| **Frontend** | Next.js 15 (App Router), React, Tailwind CSS, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Python 3.9+, FastAPI, ReportLab, Uvicorn |
| **Database & Auth** | Supabase (PostgreSQL, Auth API, Storage Buckets) |

---

## 🚀 Running Locally (Development)

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- A **Supabase** account (Free tier is fine)

### 2. Database Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and run the queries found in `supabase_migration.sql` to initialize your tables.
3. Create a public Storage bucket named `files`.

### 3. Environment Configuration
**Frontend (`nextjs/.env.local`):**
```ini
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend (`threadcounty-api/.env`):**
```ini
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### 4. Start the Application
Windows users can simply double-click the `start_all.bat` file in the root directory, or run:
```bash
./start_all.bat
```
This script automatically installs all Node/Python dependencies, boots up the FastAPI backend on `http://localhost:8000`, and starts the Next.js frontend on `http://localhost:3000`.

---

## 🌍 Deployment Guide

To put ThreadCounty on the live internet, you need to deploy the **Frontend** and the **Backend** separately.

### Step 1: Deploying the Frontend (Vercel)
Vercel is the easiest and fastest way to host the Next.js application.

1. Create a free account on [Vercel](https://vercel.com/) and link your GitHub account.
2. Click **"Add New Project"** and select this repository (`THREAD-WEB-DEVELOPMENT-`).
3. **CRITICAL:** In the Vercel configuration screen, set the **Root Directory** to `nextjs`!
4. Open the **Environment Variables** section and add:
   - `NEXT_PUBLIC_SUPABASE_URL`: *(Your URL)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: *(Your Key)*
   - `NEXT_PUBLIC_API_URL`: *(Leave this as `http://localhost:8000` for now. We will change this after deploying the backend!)*
5. Click **Deploy**. Vercel will give you a live URL (e.g., `https://threadcounty.vercel.app`).

### Step 2: Deploying the Backend (Render or Railway)
FastAPI needs a platform that supports Python Web Services. [Render.com](https://render.com/) is an excellent free option.

1. Create a free account on [Render](https://render.com/).
2. Click **New > Web Service** and connect your GitHub repository.
3. Configure the settings:
   - **Root Directory:** `threadcounty-api`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
4. Add your Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
5. Click **Create Web Service**. Render will give you a live API URL (e.g., `https://threadcounty-api.onrender.com`).

### Step 3: Connect Frontend to the Live Backend
1. Go back to your **Vercel** dashboard.
2. Go to your project's **Settings > Environment Variables**.
3. Update `NEXT_PUBLIC_API_URL` to your new Render URL (e.g., `https://threadcounty-api.onrender.com`).
4. **Redeploy** your Vercel app (Go to Deployments > click the dots > Redeploy) so it builds with the new API link!

---

<div align="center">
  <i>Developed for the ThreadCounty Hackathon 2026</i>
</div>
