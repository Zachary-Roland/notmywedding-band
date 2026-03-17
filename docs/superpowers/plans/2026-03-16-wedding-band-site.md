# Wedding Band Site Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a link-in-bio / band website for "wedding" with admin-editable links, shows, YouTube integration, and a handmade zine aesthetic.

**Architecture:** React SPA ported from zacharyroland.dev patterns. Firebase for auth + Firestore data. Tailwind CSS 4 with custom warm/paper theme. YouTube Data API v3 for video sync. Horizontal top nav (no sidebar).

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, Firebase 12, React Router 7, @dnd-kit, YouTube Data API v3

**Spec:** `docs/superpowers/specs/2026-03-16-wedding-band-site-design.md`

**Reference codebase:** `/Users/zroland/Documents/Code/Zachary/zacharyroland.dev/` -- port patterns directly from here.

---

## File Structure

```
Wedding/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── postcss.config.js
├── .env.example
├── .gitignore
├── firestore.rules
├── firestore.indexes.json
├── public/
│   └── images/           (band photos copied from images/)
│       ├── headerphoto.jpg
│       ├── anna_wheatfield.jpg
│       ├── anna_live_oleavers.jpg
│       ├── live_show_oleavers.jpg
│       ├── live_show_little_boho
│       ├── bphoto.jpg
│       ├── single_art.jpg
│       ├── annaholdingbandtote.jpg
│       └── annawearingbandtshirt.jpg
├── src/
│   ├── main.tsx              -- React DOM entry, router + auth provider
│   ├── App.tsx               -- Root layout: Navbar + main + Footer
│   ├── routes.tsx            -- Route definitions with lazy loading
│   ├── index.css             -- Tailwind imports + custom zine theme + animations
│   ├── lib/
│   │   ├── firebase.ts       -- Firebase init from env vars
│   │   ├── navigation.ts     -- Nav items constant
│   │   └── youtube.ts        -- YouTube Data API helper
│   ├── context/
│   │   └── AuthContext.tsx    -- Auth context provider
│   ├── hooks/
│   │   ├── useAuth.ts        -- Firebase auth state
│   │   ├── useLinks.ts       -- Firestore links listener
│   │   ├── useShows.ts       -- Firestore shows listener
│   │   ├── useSettings.ts    -- Firestore settings listener
│   │   └── useVideos.ts      -- Firestore videos listener
│   ├── components/
│   │   ├── Navbar.tsx         -- Horizontal top nav with logo + links
│   │   ├── MobileNav.tsx      -- Mobile hamburger nav
│   │   ├── Footer.tsx         -- Social icons + "wedding" logo
│   │   ├── ProtectedRoute.tsx -- Auth guard
│   │   ├── YouTubeEmbed.tsx   -- YouTube iframe embed
│   │   ├── LinkButton.tsx     -- Torn notebook page link
│   │   ├── ShowCard.tsx       -- Show listing card
│   │   └── SocialIcons.tsx    -- Instagram + YouTube icons
│   └── pages/
│       ├── Home.tsx           -- Hero + links + next show + video
│       ├── About.tsx          -- Bio + photo collage
│       ├── Shows.tsx          -- All upcoming shows
│       ├── Media.tsx          -- Videos + photo gallery
│       ├── AdminLogin.tsx     -- Login form
│       ├── Admin.tsx          -- Admin layout with tabs
│       ├── AdminLinks.tsx     -- Link CRUD + drag reorder + YouTube settings
│       ├── AdminShows.tsx     -- Show CRUD
│       └── AdminMedia.tsx     -- YouTube sync + video management
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `postcss.config.js`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `src/main.tsx` (placeholder)
- Create: `src/index.css` (placeholder)
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: Initialize package.json**

```json
{
  "name": "wedding",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "firebase": "^12.10.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.1",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "postcss": "^8.5.8",
    "tailwindcss": "^4.2.1",
    "typescript": "~5.7.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>wedding</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Dancing+Script:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Create vite.config.ts**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 4: Create tsconfig.json and tsconfig.node.json**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "emitDeclarationOnly": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Create postcss.config.js**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 6: Create .env.example and .gitignore**

`.env.example`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_YOUTUBE_API_KEY=
VITE_YOUTUBE_CHANNEL_ID=
```

`.gitignore`:
```
node_modules
dist
.env
.env.local
*.local
.superpowers/
```

- [ ] **Step 7: Create src/vite-env.d.ts**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 8: Create placeholder src/main.tsx and src/index.css**

`src/main.tsx`:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div>wedding</div>
  </StrictMode>
);
```

`src/index.css`:
```css
@import "tailwindcss";
```

- [ ] **Step 9: Copy images to public/images/**

```bash
mkdir -p public/images
cp images/headerphoto.jpg images/anna_wheatfield.jpg images/anna_live_oleavers.jpg images/live_show_oleavers.jpg images/live_show_little_boho images/bphoto.jpg images/single_art.jpg images/annaholdingbandtote.jpg images/annawearingbandtshirt.jpg public/images/
```

- [ ] **Step 10: Install dependencies and verify dev server starts**

```bash
npm install && npm run dev
```

Expected: Vite dev server starts, page shows "wedding" text.

- [ ] **Step 11: Commit**

```bash
git init
git add package.json index.html vite.config.ts tsconfig.json tsconfig.node.json postcss.config.js .env.example .gitignore src/main.tsx src/index.css src/vite-env.d.ts public/images/
git commit -m "feat: scaffold Wedding project with Vite + React + Tailwind"
```

---

## Task 2: Tailwind Theme + Zine Aesthetic CSS

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Write the full index.css with zine theme**

```css
@import "tailwindcss";

@theme {
  --color-cream: #f5f0e8;
  --color-cream-light: #faf8f4;
  --color-ink: #2c2416;
  --color-ink-muted: #2c241680;
  --color-ink-faint: #2c241633;
  --color-ink-dim: #2c241620;
  --color-accent-rose: #c4867a;
  --color-accent-sage: #8a9a7b;
  --color-accent-ochre: #c9a84c;
  --color-paper: #fffef9;
  --font-display: "Dancing Script", cursive;
  --font-heading: "Cormorant Garamond", serif;
  --font-body: "Lora", serif;
}

@layer base {
  body {
    @apply bg-cream text-ink font-body antialiased;
    min-height: 100vh;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-heading);
  }

  /* Subtle paper texture overlay */
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  /* Torn edge clip path for link buttons */
  .torn-edge {
    clip-path: polygon(
      0% 2%, 3% 0%, 7% 1%, 11% 0%, 15% 2%, 19% 0%, 23% 1%, 27% 0%,
      31% 2%, 35% 0%, 39% 1%, 43% 0%, 47% 2%, 51% 0%, 55% 1%, 59% 0%,
      63% 2%, 67% 0%, 71% 1%, 75% 0%, 79% 2%, 83% 0%, 87% 1%, 91% 0%,
      95% 2%, 100% 0%,
      100% 98%, 97% 100%, 93% 99%, 89% 100%, 85% 98%, 81% 100%, 77% 99%,
      73% 100%, 69% 98%, 65% 100%, 61% 99%, 57% 100%, 53% 98%, 49% 100%,
      45% 99%, 41% 100%, 37% 98%, 33% 100%, 29% 99%, 25% 100%, 21% 98%,
      17% 100%, 13% 99%, 9% 100%, 5% 98%, 0% 100%
    );
  }

  /* Visible focus states */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-ink;
  }

  :focus:not(:focus-visible) {
    outline: none;
  }
}
```

- [ ] **Step 2: Verify the dev server loads with warm cream background**

```bash
npm run dev
```

Expected: Page background is warm cream, text is warm near-black.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add zine-inspired Tailwind theme with paper texture"
```

---

## Task 3: Firebase + Auth Infrastructure

**Files:**
- Create: `src/lib/firebase.ts`
- Create: `src/hooks/useAuth.ts`
- Create: `src/context/AuthContext.tsx`
- Create: `src/components/ProtectedRoute.tsx`
- Create: `firestore.rules`
- Create: `firestore.indexes.json`

- [ ] **Step 1: Create src/lib/firebase.ts**

```ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
};

export const firebaseConfigured = Boolean(firebaseConfig.apiKey);

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = firebaseConfigured ? getAuth(app) : null;
```

- [ ] **Step 2: Create src/hooks/useAuth.ts**

Port directly from zacharyroland.dev -- identical code:

```ts
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email: string, password: string) => {
    if (!auth) return Promise.reject(new Error("Firebase not configured"));
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  };

  return { user, loading, login, logout };
}
```

- [ ] **Step 3: Create src/context/AuthContext.tsx**

```tsx
import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
```

- [ ] **Step 4: Create src/components/ProtectedRoute.tsx**

```tsx
import { Navigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-ink-muted font-heading text-lg">loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
```

- [ ] **Step 5: Create firestore.rules and firestore.indexes.json**

`firestore.rules`:
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /links/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /shows/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /videos/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

`firestore.indexes.json`:
```json
{
  "indexes": [],
  "fieldOverrides": []
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/firebase.ts src/hooks/useAuth.ts src/context/AuthContext.tsx src/components/ProtectedRoute.tsx firestore.rules firestore.indexes.json
git commit -m "feat: add Firebase auth infrastructure"
```

---

## Task 4: Data Hooks (Links, Shows, Settings, Videos)

**Files:**
- Create: `src/hooks/useLinks.ts`
- Create: `src/hooks/useShows.ts`
- Create: `src/hooks/useSettings.ts`
- Create: `src/hooks/useVideos.ts`

- [ ] **Step 1: Create src/hooks/useLinks.ts**

Port directly from zacharyroland.dev:

```ts
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, firebaseConfigured } from "../lib/firebase";

export interface Link {
  id: string;
  label: string;
  url: string;
  order: number;
  createdAt: Timestamp;
}

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "links"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Link[];
        setLinks(data);
        setLoading(false);
      },
      (err) => {
        console.error("Links listener failed:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { links, loading };
}
```

- [ ] **Step 2: Create src/hooks/useShows.ts**

```ts
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, firebaseConfigured } from "../lib/firebase";

export interface Show {
  id: string;
  date: Timestamp;
  billing: string;
  venue: string;
  city: string;
  ticketUrl?: string;
  createdAt: Timestamp;
}

export function useShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "shows"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Show[];
        setShows(data);
        setLoading(false);
      },
      (err) => {
        console.error("Shows listener failed:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingShows = shows.filter(
    (show) => show.date.toDate() >= today
  );

  return { shows, upcomingShows, loading };
}
```

- [ ] **Step 3: Create src/hooks/useSettings.ts**

```ts
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, firebaseConfigured } from "../lib/firebase";

export interface HomeSettings {
  youtubeUrl: string;
  youtubeEnabled: boolean;
}

const defaultSettings: HomeSettings = {
  youtubeUrl: "",
  youtubeEnabled: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<HomeSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, "settings", "home"),
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings(snapshot.data() as HomeSettings);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Settings listener failed:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { settings, loading };
}
```

- [ ] **Step 4: Create src/hooks/useVideos.ts**

```ts
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, firebaseConfigured } from "../lib/firebase";

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: Timestamp;
  createdAt: Timestamp;
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "videos"), orderBy("publishedAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Video[];
        setVideos(data);
        setLoading(false);
      },
      (err) => {
        console.error("Videos listener failed:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { videos, loading };
}
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useLinks.ts src/hooks/useShows.ts src/hooks/useSettings.ts src/hooks/useVideos.ts
git commit -m "feat: add Firestore data hooks for links, shows, settings, videos"
```

---

## Task 5: Navigation + Layout Components

**Files:**
- Create: `src/lib/navigation.ts`
- Create: `src/components/Navbar.tsx`
- Create: `src/components/MobileNav.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/SocialIcons.tsx`

- [ ] **Step 1: Create src/lib/navigation.ts**

```ts
export const navItems = [
  { label: "home", path: "/" },
  { label: "about", path: "/about" },
  { label: "shows", path: "/shows" },
  { label: "media", path: "/media" },
];

export const externalLinks = [
  { label: "substack", url: "https://goodluckprayerbook.substack.com/" },
  { label: "bandcamp", url: "https://notmywedding.bandcamp.com/" },
];

export const socialLinks = {
  instagram: "https://www.instagram.com/_notmywedding",
  youtube: "https://www.youtube.com/@notmywedding",
};
```

- [ ] **Step 2: Create src/components/SocialIcons.tsx**

```tsx
import { socialLinks } from "../lib/navigation";

export default function SocialIcons() {
  return (
    <div className="flex items-center gap-4">
      <a
        href={socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="text-ink-muted hover:text-ink transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
      <a
        href={socialLinks.youtube}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube"
        className="text-ink-muted hover:text-ink transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </a>
    </div>
  );
}
```

- [ ] **Step 3: Create src/components/Navbar.tsx**

```tsx
import { NavLink, Link } from "react-router";
import { navItems, externalLinks } from "../lib/navigation";
import { useAuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuthContext();

  return (
    <nav className="hidden md:flex items-center justify-between px-8 py-4 border-b border-ink-faint">
      <Link to="/" className="font-display text-3xl text-ink hover:text-ink-muted transition-colors">
        wedding
      </Link>
      <div className="flex items-center gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `font-heading text-lg ${isActive ? "text-ink font-semibold" : "text-ink-muted hover:text-ink"} transition-colors`
            }
          >
            {item.label}
          </NavLink>
        ))}
        {externalLinks.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-lg text-ink-muted hover:text-ink transition-colors"
          >
            {link.label}
            <span className="text-xs ml-0.5">&nearr;</span>
          </a>
        ))}
        {user && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `font-heading text-lg ${isActive ? "text-ink font-semibold" : "text-ink-muted hover:text-ink"} transition-colors`
            }
          >
            admin
          </NavLink>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Create src/components/MobileNav.tsx**

```tsx
import { useState } from "react";
import { NavLink, Link } from "react-router";
import { navItems, externalLinks } from "../lib/navigation";
import { useAuthContext } from "../context/AuthContext";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthContext();

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-faint">
        <Link to="/" className="font-display text-2xl text-ink" onClick={() => setOpen(false)}>
          wedding
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="text-ink p-2"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      {open && (
        <div className="bg-cream border-b border-ink-faint px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block font-heading text-xl ${isActive ? "text-ink font-semibold" : "text-ink-muted"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {externalLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block font-heading text-xl text-ink-muted"
            >
              {link.label} <span className="text-xs">&nearr;</span>
            </a>
          ))}
          {user && (
            <NavLink
              to="/admin"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block font-heading text-xl ${isActive ? "text-ink font-semibold" : "text-ink-muted"}`
              }
            >
              admin
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create src/components/Footer.tsx**

```tsx
import SocialIcons from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-ink-faint mt-auto">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
        <SocialIcons />
        <p className="font-display text-xl text-ink-muted">wedding</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/navigation.ts src/components/SocialIcons.tsx src/components/Navbar.tsx src/components/MobileNav.tsx src/components/Footer.tsx
git commit -m "feat: add navigation, footer, and social icon components"
```

---

## Task 6: App Layout + Routing

**Files:**
- Create: `src/App.tsx`
- Create: `src/routes.tsx`
- Modify: `src/main.tsx`
- Create: `src/pages/Home.tsx` (placeholder)
- Create: `src/pages/About.tsx` (placeholder)
- Create: `src/pages/Shows.tsx` (placeholder)
- Create: `src/pages/Media.tsx` (placeholder)
- Create: `src/pages/AdminLogin.tsx` (placeholder)
- Create: `src/pages/Admin.tsx` (placeholder)
- Create: `src/pages/AdminLinks.tsx` (placeholder)
- Create: `src/pages/AdminShows.tsx` (placeholder)
- Create: `src/pages/AdminMedia.tsx` (placeholder)

- [ ] **Step 1: Create src/App.tsx**

```tsx
import { Component, Suspense, type ReactNode } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const isChunkError = error.message.includes("dynamically imported module");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-ink px-4">
        <div className="w-full max-w-md space-y-4 text-center">
          {isChunkError ? (
            <p className="font-heading text-lg">site updated — please reload</p>
          ) : (
            <p className="font-heading text-lg">something went wrong</p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="border border-ink px-4 py-1 text-sm hover:bg-ink hover:text-cream transition-colors font-body"
          >
            reload
          </button>
        </div>
      </div>
    );
  }
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollRestoration />
      <Navbar />
      <MobileNav />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense
            fallback={<div className="fixed inset-0 z-[9998] bg-cream" />}
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Create src/routes.tsx**

```tsx
import { lazy } from "react";
import { Navigate, useRouteError, type RouteObject } from "react-router";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";

function RootError() {
  const error = useRouteError() as Error;
  const isChunkError = error?.message?.includes("dynamically imported module");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-ink px-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <p className="font-heading text-lg">
          {isChunkError ? "site updated — please reload" : "something went wrong"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="border border-ink px-4 py-1 text-sm hover:bg-ink hover:text-cream transition-colors font-body"
        >
          reload
        </button>
      </div>
    </div>
  );
}

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Shows = lazy(() => import("./pages/Shows"));
const MediaPage = lazy(() => import("./pages/Media"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLinks = lazy(() => import("./pages/AdminLinks"));
const AdminShows = lazy(() => import("./pages/AdminShows"));
const AdminMedia = lazy(() => import("./pages/AdminMedia"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "shows", element: <Shows /> },
      { path: "media", element: <MediaPage /> },
      { path: "admin/login", element: <AdminLogin /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="links" replace /> },
          { path: "links", element: <AdminLinks /> },
          { path: "shows", element: <AdminShows /> },
          { path: "media", element: <AdminMedia /> },
        ],
      },
    ],
  },
];
```

- [ ] **Step 3: Update src/main.tsx**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { routes } from "./routes";
import "./index.css";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
```

- [ ] **Step 4: Create placeholder pages**

Each page should be a minimal placeholder that exports a default function with the page name so routing works. Create all 9 page files:

`src/pages/Home.tsx`:
```tsx
export default function Home() {
  return <div className="p-8 font-heading text-2xl">home</div>;
}
```

Create the same pattern for `About.tsx`, `Shows.tsx`, `Media.tsx`, `AdminLogin.tsx`, `Admin.tsx` (with `<Outlet />`), `AdminLinks.tsx`, `AdminShows.tsx`, `AdminMedia.tsx`.

`src/pages/Admin.tsx` must include the `<Outlet />`:
```tsx
import { Outlet } from "react-router";
export default function Admin() {
  return <div className="p-8"><Outlet /></div>;
}
```

- [ ] **Step 5: Verify all routes work**

```bash
npm run dev
```

Navigate to `/`, `/about`, `/shows`, `/media` -- each should show its placeholder text with the Navbar and Footer.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/routes.tsx src/main.tsx src/pages/
git commit -m "feat: add routing, app layout, and placeholder pages"
```

---

## Task 7: Shared Components (LinkButton, ShowCard, YouTubeEmbed)

**Files:**
- Create: `src/components/LinkButton.tsx`
- Create: `src/components/ShowCard.tsx`
- Create: `src/components/YouTubeEmbed.tsx`

- [ ] **Step 1: Create src/components/LinkButton.tsx (torn notebook page style)**

```tsx
interface LinkButtonProps {
  label: string;
  url: string;
  rotation?: number;
}

export default function LinkButton({ label, url, rotation = 0 }: LinkButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="torn-edge block w-full max-w-md bg-paper px-6 py-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-center font-heading text-lg text-ink"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {label}
    </a>
  );
}
```

- [ ] **Step 2: Create src/components/ShowCard.tsx**

```tsx
import type { Show } from "../hooks/useShows";

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  const date = show.date.toDate();
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="border border-ink-faint rounded px-4 py-3 flex items-center justify-between gap-4 bg-paper">
      <div>
        <p className="text-sm font-semibold font-heading text-ink">{formatted}</p>
        {show.billing && (
          <p className="text-sm text-ink">{show.billing}</p>
        )}
        <p className="text-sm text-ink-muted">
          {show.venue} — {show.city}
        </p>
      </div>
      {show.ticketUrl && (
        <a
          href={show.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs border border-ink px-3 py-1 rounded text-ink hover:bg-ink hover:text-cream transition-colors whitespace-nowrap font-body"
        >
          tickets
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create src/components/YouTubeEmbed.tsx**

```tsx
interface YouTubeEmbedProps {
  url: string;
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1] ?? null;
  }
  return null;
}

export default function YouTubeEmbed({ url }: YouTubeEmbedProps) {
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  return (
    <div className="w-full max-w-md aspect-video">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded border border-ink-faint"
      />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/LinkButton.tsx src/components/ShowCard.tsx src/components/YouTubeEmbed.tsx
git commit -m "feat: add LinkButton, ShowCard, and YouTubeEmbed components"
```

---

## Task 8: Homepage

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Implement the full Home page**

```tsx
import { useLinks } from "../hooks/useLinks";
import { useShows } from "../hooks/useShows";
import { useSettings } from "../hooks/useSettings";
import LinkButton from "../components/LinkButton";
import ShowCard from "../components/ShowCard";
import YouTubeEmbed from "../components/YouTubeEmbed";

const rotations = [-1.5, 0.8, -0.5, 1.2, -0.8, 1.5, -1, 0.5];

export default function Home() {
  const { links, loading: linksLoading } = useLinks();
  const { upcomingShows, loading: showsLoading } = useShows();
  const { settings, loading: settingsLoading } = useSettings();

  const isLoading = linksLoading || showsLoading || settingsLoading;
  const nextShow = upcomingShows[0];

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-cream">
        <span className="text-ink-muted font-display text-2xl">wedding</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 md:py-12 px-4 gap-6 max-w-3xl mx-auto">
      {/* Hero Image */}
      <div className="w-full max-w-2xl">
        <img
          src="/images/headerphoto.jpg"
          alt="Wedding"
          className="w-full rounded shadow-md"
        />
      </div>

      {/* Logo (mobile only -- desktop has it in Navbar) */}
      <h1 className="md:hidden font-display text-4xl text-ink">wedding</h1>

      {/* YouTube Embed */}
      {settings.youtubeEnabled && settings.youtubeUrl && (
        <YouTubeEmbed url={settings.youtubeUrl} />
      )}

      {/* Links */}
      <div className="w-full flex flex-col items-center gap-4 py-4">
        {links.map((link, i) => (
          <LinkButton
            key={link.id}
            label={link.label}
            url={link.url}
            rotation={rotations[i % rotations.length] ?? 0}
          />
        ))}
      </div>

      {/* Next Show */}
      {nextShow && (
        <div className="w-full max-w-md">
          <p className="text-sm text-ink-muted mb-2 font-heading">next show</p>
          <ShowCard show={nextShow} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify homepage renders with hero image and loading state**

```bash
npm run dev
```

Expected: Hero image loads, "wedding" logo shows on mobile, links/shows sections empty (no Firebase data yet), warm cream background with paper texture.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: implement homepage with hero, links, show preview, and YouTube embed"
```

---

## Task 9: About Page

**Files:**
- Modify: `src/pages/About.tsx`

- [ ] **Step 1: Implement About page**

```tsx
export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-8 md:py-12 px-4">
      <h1 className="font-display text-4xl md:text-5xl text-ink mb-8">about</h1>

      <div className="space-y-6 font-body text-ink leading-relaxed">
        <p>
          Wedding is the project of singer-songwriter Anna Schulte, who grew up
          in Omaha and spent her suburban childhood steeped in poetry and
          literature. She found her way to songwriting as a teenager, when she
          began singing her own poems over a few simple chords. In 2013 she
          formed the indie rock band Pretty Healthy, and in 2016 went onto play
          solo under the name Anna Sun at cozy and beloved venues like the Milk
          Run. In 2022, she released her debut EP Dream Car with the help of
          Omaha-based engineer and multi-instrumentalist Nate Van Fleet, followed
          by the single Bright As a Star in 2023.
        </p>
        <blockquote className="border-l-2 border-accent-sage pl-4 italic text-ink-muted">
          <p>
            Aldora Britain Records writes, &ldquo;These releases, with their
            jazzy textures and poetic sad song vibes, are a tantalizing taste of
            what is to come from this up-and-coming dreamy folk troubadour. Each
            offering blends genre boundaries and borders together with a
            gloriously appealing disrespect for the pre-established norms of this
            flawed industry.&rdquo;
          </p>
        </blockquote>
      </div>

      {/* Photo collage */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { src: "/images/anna_wheatfield.jpg", alt: "Anna in wheatfield" },
          { src: "/images/anna_live_oleavers.jpg", alt: "Anna live at O'Leavers" },
          { src: "/images/live_show_oleavers.jpg", alt: "Live show" },
          { src: "/images/bphoto.jpg", alt: "Wedding band" },
          { src: "/images/single_art.jpg", alt: "Single artwork" },
          { src: "/images/annawearingbandtshirt.jpg", alt: "Band merch" },
        ].map((photo, i) => (
          <div
            key={photo.src}
            className="overflow-hidden rounded shadow-sm"
            style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify at /about**

Expected: Bio text renders with blockquote, photos in a loose collage grid with slight rotations.

- [ ] **Step 3: Commit**

```bash
git add src/pages/About.tsx
git commit -m "feat: implement About page with bio and photo collage"
```

---

## Task 10: Shows Page

**Files:**
- Modify: `src/pages/Shows.tsx`

- [ ] **Step 1: Implement Shows page**

```tsx
import { useShows } from "../hooks/useShows";
import ShowCard from "../components/ShowCard";

export default function Shows() {
  const { upcomingShows, loading } = useShows();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-ink-muted font-heading text-lg">loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 md:py-12 px-4">
      <h1 className="font-display text-4xl md:text-5xl text-ink mb-8">shows</h1>

      {upcomingShows.length === 0 ? (
        <p className="text-ink-muted font-body">No upcoming shows.</p>
      ) : (
        <div className="space-y-3">
          {upcomingShows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Shows.tsx
git commit -m "feat: implement Shows page with upcoming show cards"
```

---

## Task 11: Media Page

**Files:**
- Modify: `src/pages/Media.tsx`

- [ ] **Step 1: Implement Media page**

```tsx
import { useVideos } from "../hooks/useVideos";

export default function Media() {
  const { videos, loading } = useVideos();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-ink-muted font-heading text-lg">loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 md:py-12 px-4">
      <h1 className="font-display text-4xl md:text-5xl text-ink mb-8">media</h1>

      {/* Videos */}
      {videos.length > 0 && (
        <div className="space-y-6 mb-12">
          {videos.map((video) => (
            <div key={video.id} className="space-y-2">
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded border border-ink-faint"
                />
              </div>
              <p className="font-heading text-sm text-ink-muted">{video.title}</p>
            </div>
          ))}
        </div>
      )}

      {/* Photo Gallery */}
      <h2 className="font-heading text-2xl text-ink mb-4">photos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { src: "/images/anna_live_oleavers.jpg", alt: "Live at O'Leavers" },
          { src: "/images/live_show_oleavers.jpg", alt: "Live show" },
          { src: "/images/anna_wheatfield.jpg", alt: "Anna in wheatfield" },
          { src: "/images/annaholdingbandtote.jpg", alt: "Band tote" },
          { src: "/images/annawearingbandtshirt.jpg", alt: "Band tshirt" },
          { src: "/images/bphoto.jpg", alt: "Band photo" },
        ].map((photo) => (
          <div key={photo.src} className="overflow-hidden rounded shadow-sm">
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Media.tsx
git commit -m "feat: implement Media page with videos and photo gallery"
```

---

## Task 12: Admin Login Page

**Files:**
- Modify: `src/pages/AdminLogin.tsx`

- [ ] **Step 1: Implement AdminLogin**

```tsx
import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";

export default function AdminLogin() {
  const { login, user } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold font-heading">admin login</h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div>
          <label htmlFor="email" className="block text-sm text-ink-muted mb-1">email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border border-ink-faint rounded px-3 py-2 text-ink focus:outline-none focus:border-ink"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-ink-muted mb-1">password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-transparent border border-ink-faint rounded px-3 py-2 text-ink focus:outline-none focus:border-ink"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-ink text-ink py-2 rounded hover:bg-ink hover:text-cream transition-colors disabled:opacity-50"
        >
          {submitting ? "logging in..." : "login"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/AdminLogin.tsx
git commit -m "feat: implement admin login page"
```

---

## Task 13: Admin Dashboard Layout

**Files:**
- Modify: `src/pages/Admin.tsx`

- [ ] **Step 1: Implement Admin layout with tabs**

```tsx
import { Outlet, NavLink } from "react-router";
import { useAuthContext } from "../context/AuthContext";

export default function Admin() {
  const { logout } = useAuthContext();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold font-heading">admin dashboard</h1>
        <button
          onClick={() => logout()}
          className="text-xs text-ink-muted hover:text-ink transition-colors"
        >
          logout
        </button>
      </div>
      <nav className="flex gap-4 mb-8 border-b border-ink-faint pb-4">
        {[
          { to: "/admin/links", label: "links" },
          { to: "/admin/shows", label: "shows" },
          { to: "/admin/media", label: "media" },
        ].map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              isActive ? "text-ink font-bold" : "text-ink-muted hover:text-ink"
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Admin.tsx
git commit -m "feat: implement admin dashboard layout with tabs"
```

---

## Task 14: Admin Links Page (CRUD + Drag Reorder + YouTube Settings)

**Files:**
- Modify: `src/pages/AdminLinks.tsx`

- [ ] **Step 1: Implement AdminLinks**

Port directly from zacharyroland.dev's AdminLinks.tsx, replacing terminal theme classes with the cream/ink theme. The logic is identical -- form for add/edit, DndContext for drag reorder, YouTube settings section. Use:
- `border-ink-faint` instead of `border-terminal-green-faint`
- `text-ink` instead of `text-terminal-green`
- `text-ink-muted` instead of `text-terminal-green-muted`
- `hover:bg-ink hover:text-cream` instead of `hover:bg-terminal-green-dim`
- `bg-transparent` stays the same

The full implementation follows the exact same pattern as the reference file at `/Users/zroland/Documents/Code/Zachary/zacharyroland.dev/src/pages/AdminLinks.tsx`, with only class name substitutions for the theme.

- [ ] **Step 2: Verify at /admin/links**

Expected: Link form, sortable link list, YouTube settings section. All styled with cream/ink theme.

- [ ] **Step 3: Commit**

```bash
git add src/pages/AdminLinks.tsx
git commit -m "feat: implement admin links page with drag reorder and YouTube settings"
```

---

## Task 15: Admin Shows Page

**Files:**
- Modify: `src/pages/AdminShows.tsx`

- [ ] **Step 1: Implement AdminShows**

Port directly from zacharyroland.dev's AdminShows.tsx with the same theme class substitutions as Task 14. The logic is identical -- form for add/edit shows with date, billing, venue, city, ticketUrl fields, plus show list with edit/delete buttons and past show graying.

- [ ] **Step 2: Commit**

```bash
git add src/pages/AdminShows.tsx
git commit -m "feat: implement admin shows page"
```

---

## Task 16: YouTube Data API Helper + Admin Media Page

**Files:**
- Create: `src/lib/youtube.ts`
- Modify: `src/pages/AdminMedia.tsx`

- [ ] **Step 1: Create src/lib/youtube.ts**

```ts
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY ?? "";
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID ?? "";

interface YouTubeVideo {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export async function fetchLatestVideos(maxResults = 10): Promise<YouTubeVideo[]> {
  if (!API_KEY || !CHANNEL_ID) {
    throw new Error("YouTube API key or channel ID not configured");
  }

  // Step 1: Get the channel's uploads playlist ID
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
  );
  if (!channelRes.ok) throw new Error("Failed to fetch channel info");
  const channelData = await channelRes.json();
  const uploadsPlaylistId =
    channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) throw new Error("Could not find uploads playlist");

  // Step 2: Get videos from the uploads playlist
  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${API_KEY}`
  );
  if (!playlistRes.ok) throw new Error("Failed to fetch playlist items");
  const playlistData = await playlistRes.json();

  return (playlistData.items ?? []).map(
    (item: { snippet: { resourceId: { videoId: string }; title: string; thumbnails: { high: { url: string } }; publishedAt: string } }) => ({
      youtubeId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
    })
  );
}
```

- [ ] **Step 2: Implement AdminMedia page**

```tsx
import { useState } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useVideos, type Video } from "../hooks/useVideos";
import { fetchLatestVideos } from "../lib/youtube";

export default function AdminMedia() {
  const { videos } = useVideos();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [syncMessage, setSyncMessage] = useState("");

  async function handleSync() {
    setError("");
    setSyncMessage("");
    setSyncing(true);
    try {
      const fetched = await fetchLatestVideos();
      let added = 0;
      for (const video of fetched) {
        // Use youtubeId as doc ID to avoid duplicates
        await setDoc(doc(db, "videos", video.youtubeId), {
          youtubeId: video.youtubeId,
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          publishedAt: Timestamp.fromDate(new Date(video.publishedAt)),
          createdAt: serverTimestamp(),
        }, { merge: true });
        added++;
      }
      setSyncMessage(`Synced ${added} videos from YouTube.`);
    } catch (err) {
      setError(`Failed to sync: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setSyncing(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this video?")) return;
    setError("");
    try {
      await deleteDoc(doc(db, "videos", id));
    } catch (err) {
      setError(`Failed to delete: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div role="alert" className="border border-red-600 rounded px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Sync Button */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-ink-muted">youtube sync</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="border border-ink text-ink px-4 py-1.5 rounded text-sm hover:bg-ink hover:text-cream transition-colors disabled:opacity-50"
          >
            {syncing ? "syncing..." : "fetch latest videos"}
          </button>
          {syncMessage && (
            <span className="text-xs text-accent-sage">{syncMessage}</span>
          )}
        </div>
      </div>

      {/* Videos List */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-ink-muted">
          videos ({videos.length})
        </h2>
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center gap-3 border border-ink-faint rounded px-3 py-2"
          >
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-20 h-auto rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink truncate">{video.title}</p>
              <p className="text-xs text-ink-muted">
                {video.publishedAt.toDate().toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(video.id)}
              className="text-xs text-red-600 hover:text-red-500"
            >
              remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/youtube.ts src/pages/AdminMedia.tsx
git commit -m "feat: implement YouTube Data API sync and admin media page"
```

---

## Task 17: TypeScript Build Check + Final Verification

- [ ] **Step 1: Run TypeScript compiler**

```bash
npx tsc -b
```

Expected: No errors. Fix any type issues that come up.

- [ ] **Step 2: Run Vite build**

```bash
npm run build
```

Expected: Build succeeds, output in `dist/`.

- [ ] **Step 3: Test all routes manually**

```bash
npm run preview
```

Visit: `/`, `/about`, `/shows`, `/media`, `/admin/login`. Verify:
- Cream background, paper texture
- Dancing Script logo in navbar and footer
- Cormorant Garamond headings
- Torn-edge link buttons on homepage
- Hero image loads
- Mobile nav hamburger works
- About page shows bio + photo collage
- External links (Substack, Bandcamp) open in new tabs

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build issues and finalize initial implementation"
```

---

## Task 18: Firebase Setup + .env Configuration

This task requires the user's Firebase project credentials.

- [ ] **Step 1: Create .env file from .env.example**

Ask user for their Firebase project config values and YouTube API key. Create `.env`:

```
VITE_FIREBASE_API_KEY=<from Firebase console>
VITE_FIREBASE_AUTH_DOMAIN=<from Firebase console>
VITE_FIREBASE_PROJECT_ID=<from Firebase console>
VITE_FIREBASE_STORAGE_BUCKET=<from Firebase console>
VITE_FIREBASE_MESSAGING_SENDER_ID=<from Firebase console>
VITE_FIREBASE_APP_ID=<from Firebase console>
VITE_YOUTUBE_API_KEY=<from Google Cloud Console>
VITE_YOUTUBE_CHANNEL_ID=<Wedding's YouTube channel ID>
```

- [ ] **Step 2: Deploy Firestore rules**

```bash
firebase deploy --only firestore:rules
```

- [ ] **Step 3: Create admin user in Firebase Auth**

Use Firebase Console > Authentication > Add user with email/password.

- [ ] **Step 4: Verify end-to-end with live Firebase**

```bash
npm run dev
```

- Log in at `/admin/login`
- Add a test link, verify it appears on homepage
- Add a test show, verify it appears on homepage and `/shows`
- Toggle YouTube embed, verify it appears/disappears on homepage
- Sync videos from YouTube, verify they appear on `/media`
