<div align="center">
  <img src="https://via.placeholder.com/150/4F46E5/FFFFFF?text=TC" alt="ThreadCounty Logo" width="120" height="120" style="border-radius: 25px; box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);">
  
  <br/>
  <br/>

  # 🧵 ThreadCounty AI

  **Next-Generation AI-Powered Textile & Fabric Analysis Platform**

  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel" alt="Vercel" /></a>
    <a href="https://render.com/"><img src="https://img.shields.io/badge/Render-Hosted-46E3B7?style=for-the-badge&logo=render" alt="Render" /></a>
  </p>

  <p align="center">
    <em>Transforming how the textile industry analyzes thread density and weave patterns through advanced machine learning and computer vision.</em>
  </p>
</div>

<br />

## 🚀 Live Platform
**ThreadCounty is fully deployed and live!**
- **Frontend (Vercel):** *[Insert your Vercel URL here, e.g., https://threadcounty.vercel.app]*
- **Backend API (Render):** *[Insert your Render URL here, e.g., https://threadcounty-api.onrender.com]*

---

## 🌟 Overview
ThreadCounty is a cutting-edge SaaS platform designed exclusively for the textile industry. By uploading a high-resolution macro photo of a fabric, our proprietary computer vision models calculate critical metrics like **thread densities (EPI/PPI)** and classify complex **weave patterns** in seconds.

The architecture is built for speed, scale, and security—featuring a seamless **Next.js** edge-delivered frontend, a lightning-fast **Python/FastAPI** ML backend, and enterprise-grade data management via **Supabase**.

---

## ✨ Premium Features

- **🤖 AI-Powered Fabric Analysis:** Upload macro images to instantly receive deep insights into fabric structure, eliminating manual counting errors.
- **📄 Automated PDF Reports:** Generates standardized, highly detailed PDF analysis reports using Python's `reportlab` for easy sharing with clients or QA teams.
- **🔐 Secure & Frictionless Auth:** Seamless user onboarding with Supabase Email & Password authentication.
- **📊 Admin Telemetry & Control:** A dedicated portal (`/app/admin`) equipped with interactive *Recharts* to monitor platform usage, system health, and manage user accounts.
- **🌙 Immersive Dark UI:** A stunning, glassmorphic dark-mode interface built with Tailwind CSS and Framer Motion, offering a frictionless user experience.

---

## 🛠️ Technology Stack

Our stack is carefully curated for maximum performance and developer experience.

| Layer | Technologies |
| :--- | :--- |
| **Frontend Architecture** | Next.js 15 (App Router), React 19 |
| **Styling & Animation** | Tailwind CSS, Framer Motion, Lucide Icons |
| **Data Visualization** | Recharts |
| **Backend & ML Engine** | Python 3.9+, FastAPI, ReportLab, Uvicorn |
| **Database & Auth** | Supabase (PostgreSQL, Auth API, Storage Buckets) |
| **Cloud Infrastructure** | Vercel (Frontend), Render (Backend API) |

---

## 💻 Local Development

Want to run ThreadCounty on your local machine? It's incredibly easy.

### 1. Prerequisites
- **Node.js** (v18+) & **Python** (v3.9+)
- A **Supabase** account (Free tier)

### 2. Database Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Run the queries in `supabase_migration.sql` in the SQL Editor to initialize tables.
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

### 4. Boot Up
Windows users can simply double-click the `start_all.bat` file in the root directory, or run:
```bash
./start_all.bat
```
This script handles dependency installation and boots both the Next.js and FastAPI servers simultaneously.

---

## 🌍 Architecture & Deployment

The live version of ThreadCounty utilizes a decoupled architecture:
1. **The Next.js Frontend** is deployed via **Vercel**, taking advantage of Edge caching and global CDN distribution.
2. **The FastAPI Backend** is containerized/hosted on **Render**, providing a persistent, high-performance environment for the Python Machine Learning logic.
3. **The Supabase DB** acts as the central source of truth for both services.

*To link them, the Vercel environment variable `NEXT_PUBLIC_API_URL` securely points to the Render backend service.*

---

<div align="center">
  <p><b>Innovating Textile QA.</b></p>
  <i>Developed for the ThreadCounty Hackathon 2026</i>
</div>
