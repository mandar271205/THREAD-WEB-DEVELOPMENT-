<div align="center">
  <img src="https://via.placeholder.com/180/4F46E5/FFFFFF?text=TC" alt="ThreadCounty Logo" width="140" height="140" style="border-radius: 30px; box-shadow: 0 12px 32px rgba(79, 70, 229, 0.5);">
  
  <br/>
  <br/>

  # 🧵 ThreadCounty AI

  **Next-Generation AI-Powered Textile & Fabric Analysis Platform**

  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo" alt="Expo" /></a>
    <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react" alt="React Native" /></a>
    <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel" alt="Vercel" /></a>
    <a href="https://render.com/"><img src="https://img.shields.io/badge/Render-Hosted-46E3B7?style=for-the-badge&logo=render" alt="Render" /></a>
    <a href="https://nvidia.com/"><img src="https://img.shields.io/badge/NVIDIA_NIM-Llama_3.2_90B-76B900?style=for-the-badge&logo=nvidia" alt="NVIDIA NIM" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Google_Gemini-1.5-4285F4?style=for-the-badge&logo=google" alt="Google Gemini" /></a>
  </p>

  <p align="center">
    <em>Transforming how the textile industry analyzes thread density and weave patterns through advanced machine learning and computer vision.</em>
  </p>

  <p align="center">
    <a href="https://threadcounty-nu.vercel.app/"><strong>🌐 Live Web App</strong></a> •
    <a href="#-architecture-overview"><strong>🏗️ Architecture</strong></a> •
    <a href="#-features"><strong>✨ Features</strong></a> •
    <a href="#-getting-started"><strong>🚀 Quick Start</strong></a> •
    <a href="#-mobile-app"><strong>📱 Mobile App</strong></a> •
    <a href="#-api-documentation"><strong>📚 API Docs</strong></a>
  </p>
</div>

---

## 🌟 Live Platform

ThreadCounty is **fully deployed and live** across multiple platforms:

| Platform | URL | Status |
|----------|-----|--------|
| **Frontend (Web)** | <https://threadcounty-nu.vercel.app/> | ✅ Live |
| **Backend API** | <https://threadcounty-api.onrender.com> | ✅ Live |
| **API Health Check** | <https://threadcounty-api.onrender.com/health> | ✅ Active |

> **Note:** The backend is hosted on Render (Singapore region) with auto-deploy from `main` branch. The frontend is deployed on Vercel with edge caching and global CDN distribution.

---

## 🎯 Features

### 🤖 AI-Powered Fabric Analysis
- **Multi-Model Ensemble Pipeline**: Runs NVIDIA NIM (Llama 3.2 90B Vision), Google Gemini 1.5, and OpenCV in parallel
- **Intelligent Selection**: Automatically picks the highest-confidence result across all three models
- **Fallback System**: Graceful degradation to deterministic mock analysis when all AI models are unavailable
- **Real-time Progress**: Live progress updates during upload and analysis (0-100%)

### 📊 Comprehensive Analysis Output
- **Thread Density**: Warp (EPI) and Weft (PPI) counts per cm
- **Weave Classification**: Plain, Twill, Satin, Rib, Jacquard, or Unknown
- **Quality Grading**: Grade A/B/C based on fabric uniformity
- **Confidence Scoring**: 0-100% confidence with visual radial indicator
- **AI Suggestions**: Actionable quality improvement recommendations

### 📄 Automated PDF Reports
- **Professional Reports**: Generated via Python ReportLab with branded styling
- **One-Click Download**: Instant PDF generation with analysis details
- **Shareable Links**: Copy report URLs to clipboard for collaboration

### 🔐 Secure Authentication & User Management
- **Supabase Auth**: Email/password with JWT tokens
- **Row-Level Security**: Database-level access control
- **Protected Routes**: Server-side and client-side route guards
- **Session Persistence**: Automatic token refresh

### 📱 Cross-Platform Experience
- **Web App**: Next.js 15 with App Router, Server Components, and Framer Motion animations
- **Mobile App**: React Native / Expo with iOS, Android, and Web support
- **Unified Backend**: Single FastAPI + Supabase backend powers both platforms

### 📈 Admin Dashboard & Telemetry
- **User Analytics**: Total users, uploads, reports across platform
- **Real-time Charts**: Recharts visualizations for platform usage
- **User Management**: Admin panel for viewing all registered users

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            THREADCOUNTY ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐    │
│  │   WEB APP    │     │  MOBILE APP  │     │      ADMIN PANEL         │    │
│  │  (Next.js 15)│     │  (Expo/RN)   │     │    (Next.js /app/admin)  │    │
│  └──────┬───────┘     └──────┬───────┘     └───────────┬──────────────┘    │
│         │                    │                      │                     │
│         └────────────────────┼──────────────────────┘                     │
│                              ▼                                           │
│                    ┌───────────────────┐                                 │
│                    │   VERCEL EDGE     │                                 │
│                    │   (Global CDN)    │                                 │
│                    └─────────┬─────────┘                                 │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    FASTAPI BACKEND (Render)                      │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │    │
│  │  │ /analyze│ │ /reports│ │/dashboard│ │ /admin  │ │/contact │   │    │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │    │
│  │       │           │           │           │           │         │    │
│  │       └───────────┼───────────┴───────────┼───────────┘         │    │
│  │                   ▼                       ▼                     │    │
│  │  ┌─────────────────────────────────────────────────────────┐   │    │
│  │  │              AI ANALYSIS PIPELINE                        │   │    │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │   │    │
│  │  │  │ NVIDIA  │  │ GOOGLE  │  │ OPENCV  │  (Parallel)     │   │    │
│  │  │  │   NIM   │  │ GEMINI  │  │ CLASSIC │                 │   │    │
│  │  │  │ Llama   │  │  1.5    │  │  CV     │                 │   │    │
│  │  │  │ 3.2 90B │  │ Vision  │  │         │                 │   │    │
│  │  │  └────┬────┘  └────┬────┘  └────┬────┘                 │   │    │
│  │  │       │            │            │                       │   │    │
│  │  │       └────────────┼────────────┘                       │   │    │
│  │  │                    ▼                                   │   │    │
│  │  │          ┌─────────────────┐                            │   │    │
│  │  │          │ CONFIDENCE      │                            │   │    │
│  │  │          │ SELECTION       │                            │   │    │
│  │  │          │ (Best Result)   │                            │   │    │
│  │  │          └────────┬────────┘                            │   │    │
│  │  └───────────────────┼────────────────────────────────────┘   │    │
│  └──────────────────────┼─────────────────────────────────────────┘    │
│                         │                                               │
│                         ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     SUPABASE (PostgreSQL)                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │   │
│  │  │ profiles │ │ uploads  │ │ reports  │ │storage   │           │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Upload**: User drags & drops fabric image → Supabase Storage (bucket: `files`)
2. **Record**: Upload metadata saved to `uploads` table (status: `processing`)
3. **Analyze**: Frontend calls `/analyze` endpoint with image URL
4. **Pipeline**: Backend runs 3 AI models in parallel → selects highest confidence
5. **Store**: Results saved to `reports` table with analysis data
6. **Notify**: Frontend receives report ID → redirects to report page
7. **Export**: User downloads PDF or shares report link

---

## 🛠️ Technology Stack

### Frontend (Web) — `nextjs/`
| Category | Technologies |
|----------|--------------|
| **Framework** | Next.js 15 (App Router), React 19 |
| **Styling** | Tailwind CSS v3, Framer Motion, Lucide Icons |
| **UI Components** | Radix UI primitives, shadcn/ui patterns |
| **Data Viz** | Recharts |
| **Auth** | @supabase/ssr, @supabase/supabase-js |
| **State** | React Context, React Hook Form |
| **Deployment** | Vercel (Edge Network) |

### Backend (API) — `threadcounty-api/`
| Category | Technologies |
|----------|--------------|
| **Framework** | FastAPI 0.111, Uvicorn |
| **AI/ML** | NVIDIA NIM (Llama 3.2 90B), Google Gemini 1.5, OpenCV |
| **Database** | Supabase (PostgreSQL), python-jose for JWT |
| **PDF** | ReportLab 4.2 |
| **Image Processing** | Pillow, OpenCV, browser-image-compression |
| **Deployment** | Render (Docker, Singapore region) |

### Mobile App — `supabase-expo-template/`
| Category | Technologies |
|----------|--------------|
| **Framework** | Expo 54, React Native 0.81, React 19 |
| **Navigation** | Expo Router 6 (file-based), React Navigation |
| **Auth** | Supabase Auth with MFA/2FA (TOTP) |
| **i18n** | i18next, react-i18next (EN, PL, ZH) |
| **Storage** | Expo Document Picker, AsyncStorage |
| **UI** | Lucide React Native, Native Wind |

### Database Schema (Supabase)

```sql
-- User profiles (extends Supabase auth.users)
profiles: id, email, role, created_at, updated_at

-- Fabric uploads
uploads: id, user_id, image_url, filename, status, created_at

-- Analysis reports
reports: id, upload_id, user_id, weave_type, warp_density, 
         weft_density, confidence_score, quality_grade, notes, created_at

-- Subscriptions (for future monetization)
subscriptions: id, user_id, plan, status, current_period_end
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ & **Python** 3.9+
- **Supabase** account (Free tier)
- **Git** for version control

### 1. Clone Repository
```bash
git clone https://github.com/mandar271205/THREAD-WEB-DEVELOPMENT-.git
cd THREAD-WEB-DEVELOPMENT-/threadcounty
```

### 2. Database Setup (Supabase)
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → Run the migration:
   ```bash
   # Copy contents of supabase_migration.sql and execute in Supabase SQL Editor
   ```
3. Create **Storage Bucket** named `files` (public)
4. Enable **RLS Policies** on all tables

### 3. Environment Configuration

#### Frontend (`nextjs/.env.local`)
```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://threadcounty-api.onrender.com
```

#### Backend (`threadcounty-api/.env`)
```ini
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
NVIDIA_NIM_API_KEY=your-nim-key        # Optional
GEMINI_API_KEY=your-gemini-key         # Optional
ALLOWED_ORIGINS=https://threadcounty-nu.vercel.app,http://localhost:3000
ALLOWED_ORIGIN_REGEX=https://.*\.vercel\.app
```

#### Mobile (`supabase-expo-template/.env`)
```ini
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Local Development

#### Option A: Windows Quick Start
```bash
# Double-click or run:
start_all.bat
```

#### Option B: Manual (All Platforms)
```bash
# Terminal 1: Backend
cd threadcounty-api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd nextjs
npm install
npm run dev

# Terminal 3: Mobile (Optional)
cd supabase-expo-template
yarn install
npx expo start
```

### 5. Access Applications
- **Web App**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Mobile**: Scan QR code with Expo Go app

---

## 📱 Mobile App

The **Supabase Expo Template** (`supabase-expo-template/`) is a production-ready React Native application sharing the same backend.

### Features
- ✅ **Full Authentication**: Email/password, MFA/2FA with QR codes
- ✅ **File Management**: Secure upload/download with 2FA protection
- ✅ **Task Management**: CRUD with filtering, urgent flags, RLS
- ✅ **Internationalization**: English, Polish, Chinese (Simplified)
- ✅ **Cross-Platform**: iOS, Android, Web from single codebase
- ✅ **Deep Linking**: Password reset via custom URL scheme

### Quick Start
```bash
cd supabase-expo-template
yarn install
cp .env.example .env  # Configure Supabase credentials
npx expo start
```

### Build for Production
```bash
# Configure EAS
eas build:configure

# iOS
eas build --platform ios --profile production
eas submit --platform ios

# Android
eas build --platform android --profile production
eas submit --platform android
```

> **Full Documentation**: See [README_MOBILE.md](README_MOBILE.md) for complete mobile app guide.

---

## 📚 API Documentation

### Base URL
```
Production: https://threadcounty-api.onrender.com
Local:      http://localhost:8000
```

### Authentication
All endpoints (except `/health`) require **Bearer Token** in Authorization header:
```
Authorization: Bearer <supabase_access_token>
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/analyze/` | Upload image URL for AI analysis |
| `GET` | `/reports/` | List user's reports |
| `GET` | `/reports/{id}` | Get single report |
| `GET` | `/reports/{id}/pdf` | Download PDF report |
| `GET` | `/dashboard/stats` | User dashboard statistics |
| `GET` | `/admin/stats` | Admin platform statistics |
| `GET` | `/admin/users` | List all users (admin only) |

### Analyze Request
```json
POST /analyze/
{
  "upload_id": "uuid-from-uploads-table",
  "image_url": "https://supabase-storage-url/fabric.jpg"
}
```

### Analyze Response
```json
{
  "report_id": "uuid",
  "weave_type": "Plain Weave",
  "warp_density": 120,
  "weft_density": 95,
  "confidence_score": 87,
  "quality_grade": "A",
  "status": "completed"
}
```

### Swagger UI
Interactive API docs available at: **<https://threadcounty-api.onrender.com/docs>**

---

## 🤖 AI Analysis Pipeline

ThreadCounty uses a **multi-model ensemble** for robust fabric analysis:

### Models
| Model | Technology | Strengths |
|-------|------------|-----------|
| **NVIDIA NIM** | Llama 3.2 90B Vision | High accuracy, detailed reasoning |
| **Google Gemini** | Gemini 1.5 Pro Vision | Fast, strong visual understanding |
| **OpenCV** | Classical Computer Vision | Deterministic, no API costs |

### Pipeline Logic
```python
# Parallel execution (ThreadPoolExecutor)
nim_result    = analyze_with_nim(image_bytes)
gemini_result = analyze_with_gemini(image_bytes)
opencv_result = analyze_with_opencv(image_bytes)

# Select highest confidence
best = max(results, key=lambda r: r.confidence_score)

# Fallback to mock if all fail
if best.confidence < 0.1:
    best = analyze_mock(image_path)
```

### Confidence Transparency
Every response includes pipeline metadata:
```json
{
  "pipeline": {
    "nim_confidence": 0.87,
    "gemini_confidence": 0.82,
    "opencv_confidence": 0.45,
    "selected": "nvidia_nim_llama32_90b"
  }
}
```

---

## 📁 Project Structure

```
threadcounty/
├── nextjs/                          # Web Application (Next.js 15)
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   │   ├── (public)/           # Public pages (landing, auth)
│   │   │   └── app/                # Protected app routes
│   │   │       ├── analyze/        # Fabric upload & analysis
│   │   │       ├── dashboard/      # User dashboard
│   │   │       ├── reports/        # Report viewing & PDF
│   │   │       ├── admin/          # Admin panel
│   │   │       └── ...
│   │   ├── components/             # React components
│   │   │   ├── ui/                 # Base UI (Button, Card, etc.)
│   │   │   └── layout/             # PageWrapper, etc.
│   │   ├── lib/                    # Utilities
│   │   │   ├── supabase/           # Supabase clients
│   │   │   ├── context/            # React Context providers
│   │   │   └── utils.ts            # Helper functions
│   │   └── middleware.ts           # Auth middleware
│   ├── package.json
│   └── ...
│
├── threadcounty-api/                # Backend API (FastAPI)
│   ├── routers/                    # API route modules
│   │   ├── upload.py               # /analyze endpoint
│   │   ├── reports.py              # /reports endpoints
│   │   ├── dashboard.py            # /dashboard/stats
│   │   ├── admin.py                # /admin endpoints
│   │   └── contact.py              # Contact form
│   ├── services/                   # Business logic
│   │   ├── ai_analyzer.py          # Main pipeline orchestrator
│   │   ├── nim_analyzer.py         # NVIDIA NIM integration
│   │   ├── gemini_analyzer.py      # Google Gemini integration
│   │   ├── opencv_analyzer.py      # OpenCV classical CV
│   │   ├── mock_analyzer.py        # Deterministic fallback
│   │   └── supabase_client.py      # Database client
│   ├── models/                     # Pydantic schemas
│   ├── middleware/                 # Auth middleware
│   ├── main.py                     # FastAPI app entry
│   ├── Dockerfile                  # Render deployment
│   └── requirements.txt
│
├── supabase-expo-template/          # Mobile App (Expo/React Native)
│   ├── app/                        # Expo Router screens
│   │   ├── (auth)/                 # Auth flow screens
│   │   └── (app)/                  # Main app tabs
│   ├── components/                 # React Native components
│   ├── lib/                        # Supabase, i18n, storage
│   ├── locales/                    # Translations (en, pl, zh)
│   └── ...
│
├── supabase/                       # Database migrations & config
│   ├── migrations/                 # SQL migrations
│   └── config.toml                 # Supabase local config
│
├── supabase_migration.sql          # Complete schema for manual setup
├── render.yaml                     # Render.com deployment config
├── start_all.bat                   # Windows dev startup script
└── LICENSE
```

---

## 🔧 Deployment

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set **Root Directory**: `threadcounty/nextjs`
3. Add Environment Variables (from `.env.local`)
4. Deploy → Automatic on push to `main`

### Backend → Render
1. Connect GitHub repo to Render
2. Create **Web Service** → Docker
3. Set **Dockerfile Path**: `threadcounty/threadcounty-api/Dockerfile`
4. Set **Docker Context**: `threadcounty/threadcounty-api`
5. Add Environment Variables (from `.env`)
6. Health Check Path: `/health`
7. Region: Singapore (or nearest)
8. Deploy → Auto-deploy on push to `main`

### Database → Supabase
- Managed PostgreSQL with Auth, Storage, Realtime
- Migrations via SQL Editor or Supabase CLI
- Row Level Security for multi-tenant isolation

---

## 🧪 Testing

```bash
# Frontend
cd nextjs
npm run lint          # ESLint
npm run build         # TypeScript + Build check

# Backend
cd threadcounty-api
python -m pytest      # If tests exist
uvicorn main:app      # Manual testing via Swagger UI

# Mobile
cd supabase-expo-template
yarn lint             # Expo lint
```

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NVIDIA** for NIM API access (Llama 3.2 90B Vision)
- **Google** for Gemini API
- **Supabase** for backend infrastructure
- **Vercel** & **Render** for hosting
- **Expo** team for React Native tooling
- **ThreadCounty Hackathon 2026** organizers

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/mandar271205/THREAD-WEB-DEVELOPMENT-/issues)
- **Live Demo**: <https://threadcounty-nu.vercel.app/>
- **API Health**: <https://threadcounty-api.onrender.com/health>

---

<div align="center">
  <p><b>Innovating Textile Quality Assurance with AI</b></p>
  <p><i>Built with ❤️ for the ThreadCounty Hackathon 2026</i></p>
  
  <br/>
  
  <p>
    <a href="https://github.com/mandar271205/THREAD-WEB-DEVELOPMENT-">
      <img src="https://img.shields.io/github/stars/mandar271205/THREAD-WEB-DEVELOPMENT-?style=social" alt="GitHub Stars" />
    </a>
    <a href="https://github.com/mandar271205/THREAD-WEB-DEVELOPMENT-/fork">
      <img src="https://img.shields.io/github/forks/mandar271205/THREAD-WEB-DEVELOPMENT-?style=social" alt="GitHub Forks" />
    </a>
  </p>
</div># Deploy trigger 06/30/2026 12:44:05
