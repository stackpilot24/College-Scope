# CollegeScope

India's college discovery platform — search and compare 170+ colleges, track entrance exams, find scholarships, and get AI-powered guidance from **YARA**.

Built with **Next.js 14**, **Prisma**, **Supabase**, **NextAuth**, and **Gemini AI**.
<img width="1919" height="887" alt="image" src="https://github.com/user-attachments/assets/8f490559-b3cc-409c-af0b-d0d1d61821d6" />

<img width="1898" height="801" alt="image" src="https://github.com/user-attachments/assets/edc3937f-4cce-4ab1-ae54-2197ce933b45" />

<img width="1919" height="894" alt="image" src="https://github.com/user-attachments/assets/490072de-a2c8-4228-964b-757f95600e15" />

---

## Features

- **College Discovery** — Search and filter 170+ colleges across all Indian states by location, fees, type, and rating
- **College Detail Pages** — Overview, courses, placements, student reviews, and Q&A forum per college
- **Side-by-Side Comparison** — Compare up to 3 colleges on fees, placements, courses, and ratings
- **Entrance Exam Tracker** — Full details on 17 major Indian exams (JEE, NEET, CAT, GATE, CLAT, and more)
- **Scholarship Finder** — 20+ government and private scholarships with eligibility filters
- **Student Reviews** — Submit and read verified reviews; delete your own
- **College Q&A** — Ask questions per college; other students and alumni can answer
- **YARA AI Assistant** — Gemini-powered floating chat for college, exam, and career guidance
- **Admin Panel** — Manage colleges, moderate reviews, manage users, promote admins
- **Authentication** — Email/password signup + Google OAuth via NextAuth

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Auth | NextAuth v4 — Credentials + Google OAuth |
| AI | Google Gemini 2.5 Flash (streaming) |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/collegescope.git
cd collegescope
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root with the following:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GEMINI_API_KEY="your-gemini-api-key"
```

- **Supabase DB**: [supabase.com](https://supabase.com) → Project → Settings → Database → Connection string (Session mode, port 5432)
- **Google OAuth**: [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
- **Gemini API key**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) (free)

### 3. Set up the database

```bash
npx prisma db push
npx prisma db seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
collegescope/
├── app/
│   ├── page.tsx                  # Landing page (public)
│   ├── layout.tsx                # Root layout with YARA chat
│   ├── colleges/                 # College listing + detail pages
│   ├── exams/                    # Entrance exam tracker
│   ├── scholarships/             # Scholarship finder
│   ├── compare/                  # Side-by-side college comparison
│   ├── dashboard/                # User dashboard (saved colleges)
│   ├── admin/                    # Admin panel (ADMIN role only)
│   └── api/                      # API routes
│       ├── auth/                 # NextAuth + registration
│       ├── colleges/             # College CRUD
│       ├── reviews/              # Review CRUD
│       ├── questions/            # Q&A CRUD
│       ├── saved/                # Save/unsave colleges
│       ├── yara/                 # Gemini AI streaming endpoint
│       └── admin/                # Admin management APIs
├── components/
│   ├── yara/YaraChat.tsx         # YARA floating AI chat
│   ├── admin/                    # Admin panel components
│   ├── detail/                   # College detail tab components
│   ├── layout/                   # Navbar, Footer
│   └── ui/                       # Shared UI components
├── lib/
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma singleton client
│   ├── examData.ts               # Static entrance exam data
│   └── scholarshipData.ts        # Static scholarship data
├── middleware.ts                 # Route protection (auth required)
└── prisma/
    ├── schema.prisma             # Database schema
    └── seed.ts                   # 170+ college seed data
```

---

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel --prod
```

Add all environment variables in the Vercel dashboard under **Settings → Environment Variables**. Set `NEXTAUTH_URL` to your Vercel domain.

---

## Admin Access

1. Sign up for an account at `/auth/signup`
2. Visit `/admin/setup` to claim the first admin role
3. Sign out and sign back in
4. Access the admin panel at `/admin`
