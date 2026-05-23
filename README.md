# 🎓 CollegeScope — College Discovery Platform

A production-grade frontend MVP for college discovery and decision-making, built with Next.js 14, TypeScript, and TailwindCSS.

---

## 📌 Project Overview

**Track:** B — College Discovery Platform  
**Role:** Frontend Engineer  
**Stack:** Next.js 14 (App Router) · TypeScript · TailwindCSS · shadcn/ui  
**Features to Build (3 of 6):**
1. College Listing + Search
2. College Detail Page
3. Compare Colleges (side-by-side)

---

## 🗂️ Folder Structure

```
collegeschope/
├── app/
│   ├── layout.tsx                  # Root layout with Navbar + Footer
│   ├── page.tsx                    # Homepage (hero + search bar + featured colleges)
│   ├── colleges/
│   │   ├── page.tsx                # College listing + search + filters
│   │   └── [id]/
│   │       └── page.tsx            # College detail page
│   ├── compare/
│   │   └── page.tsx                # College comparison page
│   └── globals.css                 # Global styles + TailwindCSS base
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   └── Footer.tsx              # Footer
│   │
│   ├── home/
│   │   ├── HeroSection.tsx         # Hero with search bar
│   │   └── FeaturedColleges.tsx    # Top college cards grid
│   │
│   ├── colleges/
│   │   ├── CollegeCard.tsx         # Individual college card (listing)
│   │   ├── CollegeGrid.tsx         # Grid/list of CollegeCards
│   │   ├── SearchBar.tsx           # Search input with debounce
│   │   ├── FilterPanel.tsx         # Sidebar filters (location, fees, rating)
│   │   └── Pagination.tsx          # Pagination controls
│   │
│   ├── detail/
│   │   ├── CollegeHeader.tsx       # College name, logo, location, rating
│   │   ├── OverviewTab.tsx         # About, accreditation, established year
│   │   ├── CoursesTab.tsx          # List of courses with fees
│   │   ├── PlacementsTab.tsx       # Placement stats (avg/highest package)
│   │   └── ReviewsTab.tsx          # Student reviews
│   │
│   ├── compare/
│   │   ├── CompareBar.tsx          # Sticky bottom bar showing selected colleges
│   │   ├── CompareTable.tsx        # Side-by-side comparison table
│   │   └── CollegeSelector.tsx     # Dropdown to add college for comparison
│   │
│   └── ui/
│       ├── Badge.tsx               # Reusable badge (e.g., "Top Rated", "Private")
│       ├── RatingStars.tsx         # Star rating display
│       ├── LoadingSkeletons.tsx    # Skeleton loaders for all pages
│       └── ErrorState.tsx          # Empty/error state component
│
├── lib/
│   ├── mockData.ts                 # All mock college data (array of 20+ colleges)
│   ├── utils.ts                    # Helper functions (formatFees, slugify, etc.)
│   └── types.ts                    # All TypeScript interfaces and types
│
├── hooks/
│   ├── useSearch.ts                # Search + debounce logic
│   ├── useFilters.ts               # Filter state management
│   └── useCompare.ts               # Compare selection state (max 3 colleges)
│
├── context/
│   └── CompareContext.tsx          # Global context for compare selections
│
├── public/
│   └── images/                     # College logos/images (or use placeholder URLs)
│
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## 🧩 TypeScript Types (`lib/types.ts`)

Define these interfaces before building any component:

```typescript
export interface College {
  id: string;
  name: string;
  slug: string;
  location: {
    city: string;
    state: string;
  };
  type: 'Government' | 'Private' | 'Deemed';
  established: number;
  rating: number;              // out of 5
  reviewCount: number;
  fees: {
    min: number;               // annual, in INR
    max: number;
  };
  courses: Course[];
  placements: Placement;
  overview: string;
  accreditation: string[];     // e.g. ["NAAC A++", "NBA"]
  image: string;               // URL or path
  logo: string;
  tags: string[];              // e.g. ["IIT", "NIT", "Top 10"]
}

export interface Course {
  id: string;
  name: string;
  duration: string;            // e.g. "4 Years"
  fees: number;                // annual, in INR
  seats: number;
}

export interface Placement {
  averagePackage: number;      // in LPA
  highestPackage: number;      // in LPA
  placementRate: number;       // percentage
  topRecruiters: string[];
}

export interface Review {
  id: string;
  collegeId: string;
  author: string;
  rating: number;
  comment: string;
  year: number;
  course: string;
}

export interface FilterState {
  search: string;
  location: string;
  type: string;
  minRating: number;
  maxFees: number;
  sortBy: 'rating' | 'fees_low' | 'fees_high' | 'name';
}
```

---

## 📦 Mock Data (`lib/mockData.ts`)

Create an array of **at least 20 colleges** with realistic Indian college data. Include a mix of:
- IITs, NITs, private universities, deemed universities
- Different states: Maharashtra, Delhi, Karnataka, Tamil Nadu, UP
- Fee range: ₹50,000/yr to ₹5,00,000/yr
- Ratings: 3.2 to 4.9
- Different course offerings

Example single entry:
```typescript
{
  id: "1",
  name: "Indian Institute of Technology Bombay",
  slug: "iit-bombay",
  location: { city: "Mumbai", state: "Maharashtra" },
  type: "Government",
  established: 1958,
  rating: 4.8,
  reviewCount: 1240,
  fees: { min: 100000, max: 250000 },
  courses: [
    { id: "c1", name: "B.Tech Computer Science", duration: "4 Years", fees: 220000, seats: 120 },
    { id: "c2", name: "M.Tech AI & ML", duration: "2 Years", fees: 180000, seats: 60 },
  ],
  placements: {
    averagePackage: 24,
    highestPackage: 2.5,   // in Crores
    placementRate: 98,
    topRecruiters: ["Google", "Microsoft", "Goldman Sachs", "DE Shaw"]
  },
  overview: "IIT Bombay is one of India's premier engineering institutions...",
  accreditation: ["NAAC A++", "NBA", "NIRF Rank 3"],
  image: "https://source.unsplash.com/800x400/?university,campus",
  logo: "/images/iitb-logo.png",
  tags: ["IIT", "Top 10", "Government", "NIRF"]
}
```

---

## 🖥️ Page-by-Page Implementation Guide

---

### 1. Homepage (`app/page.tsx`)

**What it should contain:**
- Full-width hero section with headline + subheadline
- Large search bar (input + button) — on submit, navigate to `/colleges?search=query`
- Stats row: "20,000+ Colleges" · "50+ Exams" · "10L+ Students"
- Featured Colleges section (top 6 by rating) using `CollegeCard`
- Call-to-action to compare colleges

**Design notes:**
- Dark navy blue + white color scheme (professional, trustworthy)
- Use a background gradient or subtle pattern on the hero
- The search bar should be the visual focal point

---

### 2. College Listing Page (`app/colleges/page.tsx`)

**What it should contain:**
- `SearchBar` at top (controlled, synced with URL params)
- `FilterPanel` on left sidebar (collapsible on mobile)
- `CollegeGrid` on the right (main content area)
- `Pagination` at bottom
- Result count: "Showing 12 of 47 colleges"
- Sort dropdown: Best Match / Rating / Fees (Low→High) / Fees (High→Low)

**Filter options to implement:**
| Filter | Type | Options |
|--------|------|---------|
| Location | Multi-select | States list |
| College Type | Checkbox | Government, Private, Deemed |
| Min Rating | Slider | 0–5 |
| Max Annual Fees | Slider | ₹0 – ₹10L |

**Behavior:**
- Filters update URL query params (`?state=Maharashtra&type=Government`)
- Search is debounced (300ms) using `useSearch` hook
- Filtered results come from `mockData.ts` filtered client-side
- Show `LoadingSkeletons` while filtering (simulate 300ms delay)
- Show `ErrorState` if no results match

**CollegeCard should show:**
- College image (thumbnail)
- Name + Location badge
- Rating stars + review count
- Fees range (e.g., "₹1L – ₹2.5L / year")
- Top 2 courses
- "View Details" button → navigates to `/colleges/[id]`
- "Add to Compare" button → adds to CompareContext (disabled if 3 already selected)

---

### 3. College Detail Page (`app/colleges/[id]/page.tsx`)

**What it should contain:**
- `CollegeHeader`: Banner image, logo, name, location, type badge, rating, accreditation tags
- Sticky tab navigation: Overview · Courses · Placements · Reviews
- Tab content rendered based on active tab (use URL hash or state)
- Sidebar (desktop): Quick facts card (established, type, total courses), "Add to Compare" button

**Tab content:**

**Overview Tab:**
- About paragraph
- Key highlights in a grid (established year, campus size, accreditations)
- Accreditation badges

**Courses Tab:**
- Table with columns: Course Name | Duration | Annual Fees | Seats
- Sortable by fees

**Placements Tab:**
- Stat cards: Avg Package | Highest Package | Placement Rate
- Top Recruiters: logo grid or pill badges
- Simple bar chart (can use a CSS-only approach or Recharts)

**Reviews Tab:**
- List of 5–8 static review cards
- Each shows: Author name, course, year, star rating, comment
- Overall rating breakdown (if time permits)

---

### 4. Compare Page (`app/compare/page.tsx`)

**What it should contain:**
- If fewer than 2 colleges selected: show prompt to go add colleges
- `CollegeSelector` dropdowns (up to 3) to pick colleges
- `CompareTable` with rows for each attribute

**CompareTable rows:**
| Attribute | Display |
|-----------|---------|
| College Image + Name | Header row |
| Location | City, State |
| Type | Badge |
| Established | Year |
| Rating | Stars |
| Annual Fees | Range |
| Avg Placement Package | LPA |
| Highest Package | LPA |
| Placement Rate | % with bar |
| Accreditations | Tag pills |
| Top Courses | List |
| Top Recruiters | Pills |

**Design notes:**
- Highlight the "best" value in each row with a green background (e.g., highest rating, lowest fees, best placement)
- Sticky first column with attribute names on mobile scroll
- "Remove" button on each college column header

---

### 5. Compare Bar (Global — `CompareContext.tsx`)

A **sticky bar at the bottom** that appears when 1+ colleges are selected for comparison.

**Shows:**
- Mini cards of selected colleges (name + remove button)
- "Compare Now" button → navigates to `/compare`
- "Clear All" button
- "Select up to 3 colleges" counter

**Context provides:**
```typescript
{
  selectedColleges: College[];
  addCollege: (college: College) => void;
  removeCollege: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  isFull: boolean;  // true when 3 colleges selected
}
```

---

## 🪝 Custom Hooks

### `hooks/useSearch.ts`
- Takes search string input
- Debounces by 300ms using `useEffect` + `setTimeout`
- Returns `debouncedValue`

### `hooks/useFilters.ts`
- Manages `FilterState` object
- Reads initial state from URL search params (`useSearchParams`)
- Updates URL when filters change (`useRouter.push`)
- Returns: `filters`, `setFilter`, `resetFilters`, `filteredColleges`

### `hooks/useCompare.ts`
- Wrapper around `CompareContext`
- Returns context values with error if used outside provider

---

## 🎨 Design System

**Colors (add to `tailwind.config.ts`):**
```typescript
colors: {
  brand: {
    primary: '#1B3A6B',    // Deep navy blue
    secondary: '#2563EB',  // Bright blue
    accent: '#F59E0B',     // Amber for highlights/CTAs
    light: '#EFF6FF',      // Light blue background
  },
  neutral: {
    50: '#F8FAFC',
    900: '#0F172A',
  }
}
```

**Typography:**
- Headings: `font-bold` with tight tracking
- Body: `text-gray-600` for descriptions
- Badges: `text-xs font-semibold uppercase`

**Reusable className patterns:**
```
Card:       "bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
Button:     "bg-brand-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
Badge:      "px-2 py-1 rounded-full text-xs font-semibold"
Input:      "w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-secondary outline-none"
```

---

## 🚀 Setup & Installation

```bash
# 1. Create Next.js project
npx create-next-app@latest collegescope --typescript --tailwind --eslint --app --src-dir=false

cd collegescope

# 2. Install dependencies
npm install @radix-ui/react-tabs @radix-ui/react-slider @radix-ui/react-checkbox
npm install lucide-react
npm install recharts
npm install clsx tailwind-merge

# 3. Install shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button badge card input tabs slider

# 4. Run development server
npm run dev
```

---

## 📋 Build Order (Recommended)

Follow this order to avoid dependency issues:

```
1. lib/types.ts              → Define all interfaces first
2. lib/mockData.ts           → Create 20+ college entries
3. lib/utils.ts              → formatFees(), formatLPA(), slugify()
4. context/CompareContext.tsx → Global compare state
5. components/ui/*           → Badge, RatingStars, LoadingSkeletons, ErrorState
6. components/layout/*       → Navbar, Footer
7. app/layout.tsx            → Wrap with CompareContext provider
8. components/colleges/*     → CollegeCard, SearchBar, FilterPanel
9. app/colleges/page.tsx     → Listing page
10. components/detail/*      → All tab components
11. app/colleges/[id]/page.tsx → Detail page
12. components/compare/*     → CompareBar, CompareTable
13. app/compare/page.tsx     → Compare page
14. app/page.tsx             → Homepage (last, uses CollegeCard)
```

---

## ⚡ Performance & UX Requirements

- [ ] All pages have loading skeleton states
- [ ] Search is debounced (no lag while typing)
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] Filters persist in URL (shareable links)
- [ ] Compare bar appears/disappears smoothly (CSS transition)
- [ ] No layout shift on page load
- [ ] Images use `next/image` with proper `width`/`height`
- [ ] No `any` types in TypeScript — everything strictly typed
- [ ] Error boundaries for graceful failure

---

## 🔌 Backend Integration (Future)

When connecting a backend, replace mock data calls with API calls. All data-fetching logic should be in a `lib/api.ts` file:

```typescript
// lib/api.ts — replace mockData calls with these when backend is ready

export const getColleges = async (filters: FilterState): Promise<College[]> => {
  const res = await fetch(`/api/colleges?${new URLSearchParams(filters as any)}`);
  return res.json();
};

export const getCollegeById = async (id: string): Promise<College> => {
  const res = await fetch(`/api/colleges/${id}`);
  return res.json();
};
```

Components should import from `lib/api.ts` (not `lib/mockData.ts` directly) so switching is a one-file change.

---

## 📤 Submission Checklist

- [ ] Live URL (deploy on Vercel: `vercel --prod`)
- [ ] GitHub repo (public, clean commit history)
- [ ] Loom video (5–10 min) covering:
  - Architecture walkthrough
  - Component structure decisions
  - State management approach (hooks + context)
  - How filters + search work
  - Compare feature demo
  - Edge cases: empty states, mobile view, 0 results

---

## 🗒️ Notes for Claude Code

- Build components in the exact order listed in "Build Order" above
- Use `mockData.ts` as the single source of truth for all data — no hardcoded data in components
- Every component must have TypeScript props interface defined at the top of the file
- Use `clsx` for conditional classNames
- `CompareContext` must wrap the entire app in `layout.tsx`
- The `CompareBar` component should be included in `layout.tsx` so it shows on all pages
- Prefer client components (`"use client"`) only where interactivity is needed; keep listing/detail pages as server components where possible
