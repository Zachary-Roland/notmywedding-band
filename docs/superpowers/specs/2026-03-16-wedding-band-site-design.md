# Wedding Band Site -- Design Spec

## Overview

A single-page application for the band "wedding" (all lowercase) that serves as a link-in-bio site on mobile and a multi-page band website on desktop. Built on the same proven architecture as zacharyroland.dev -- React + Vite + Tailwind + Firebase -- with a handmade/zine aesthetic that reflects the band's artistic, poetic identity.

Anna Schulte is the lead singer, also a poet and writer. The visual language should feel organic, warm, and literary -- like a handmade zine or a collage of ephemera pinned to a wall.

## Tech Stack

- **React 19** with TypeScript
- **Vite** as build tool
- **Tailwind CSS 4** for styling
- **Firebase**: Firestore (data), Firebase Auth (admin login)
- **React Router 7** for client-side routing
- **@dnd-kit** for drag-to-reorder links in admin
- **YouTube Data API v3** for fetching latest videos from the band's channel

Architecture is a direct port of zacharyroland.dev's patterns (hooks, context, protected routes, lazy-loaded pages).

## Visual Identity

### Background & Texture
- Warm cream base (`#f5f0e8`) with subtle paper/parchment texture overlay
- Organic, slightly uneven feel -- not clinical or perfectly clean

### Typography
- **Logo "wedding"**: Dancing Script (cursive, all lowercase) -- approximates the hand-lettered merch script
- **Headings**: Cormorant Garamond -- serif with literary/poetic character
- **Body text**: Lora (warm serif, complements Cormorant Garamond without competing)

### Color Palette
- Background: warm cream `#f5f0e8`
- Text/ink: warm near-black `#2c2416` (not pure black -- like real ink on paper)
- Accent: muted earthy tones -- dusty rose, sage green, or warm ochre for subtle highlights
- Interactive elements: gentle warm tone, not aggressive

### Link Buttons (Torn Notebook Pages)
- Each link styled as a torn piece of notebook paper
- Slightly off-white with ragged/torn edge effect (CSS clip-path or SVG mask)
- Each rotated slightly differently (`rotate(-1deg)`, `rotate(0.5deg)`, etc.) -- scattered/pinned look
- Subtle drop shadow like paper sitting on a surface
- Hover: gentle lift effect (shadow deepens, slight scale up)

### Navigation (Desktop)
- Horizontal top nav, minimal
- "wedding" logo in Dancing Script on the left, nav links on the right
- No sidebar
- External links (Substack, Bandcamp) grouped or styled with small icon to indicate they leave the site

## Page Structure

### Routes
```
/                 -> Home (link-in-bio on mobile, expanded on desktop)
/about            -> Band bio + photos
/shows            -> Upcoming shows list
/media            -> Videos + photo gallery
/admin/login      -> Admin login
/admin/links      -> Manage links + YouTube settings
/admin/shows      -> Manage show listings
/admin/media      -> Sync YouTube videos, manage media
```

### Homepage

**Mobile (link-in-bio mode):**
- "wedding" logo centered at top
- Hero image (headerphoto.jpg) -- full-width with organic/torn edge treatment
- YouTube embed section (toggleable by admin)
- Stack of torn-notebook-page link buttons, each slightly askew
- Single next upcoming show preview
- Social icons at bottom (Instagram, YouTube)

**Desktop:**
- Same content with more breathing room
- Hero image larger
- Content in centered column (max-width ~700-800px)
- Links and show section not stretched edge-to-edge

### About Page
- Band bio (hardcoded initially):

> Wedding is the project of singer-songwriter Anna Schulte, who grew up in Omaha and spent her suburban childhood steeped in poetry and literature. She found her way to songwriting as a teenager, when she began singing her own poems over a few simple chords. In 2013 she formed the indie rock band Pretty Healthy, and in 2016 went onto play solo under the name Anna Sun at cozy and beloved venues like the Milk Run. In 2022, she released her debut EP Dream Car with the help of Omaha-based engineer and multi-instrumentalist Nate Van Fleet, followed by the single Bright As a Star in 2023.
>
> Aldora Britain Records writes, "These releases, with their jazzy textures and poetic sad song vibes, are a tantalizing taste of what is to come from this up-and-coming dreamy folk troubadour. Each offering blends genre boundaries and borders together with a gloriously appealing disrespect for the pre-established norms of this flawed industry."

- Band photos arranged in a loose collage-style layout (not a rigid grid)
- Emphasis on Anna's writing/poetry identity

### Shows Page
- List of upcoming shows from Firestore
- Each show card: date, venue, city, billing, optional ticket link
- Past shows collapsed or grayed out
- Styled to fit zine aesthetic (like pinned flyers)

### Media Page
- YouTube video embeds pulled from Firestore `videos` collection
- Admin can sync videos from the band's YouTube channel via a "Fetch Latest Videos" button (uses YouTube Data API v3)
- Photo gallery from band photos

### Admin Panel (`/admin`)
- Clean/utilitarian styling -- does not need the zine aesthetic
- Firebase Auth login (email/password)
- Tabs: Links, Shows, Media
- Links tab: CRUD + drag-to-reorder + YouTube embed settings (homepage featured video)
- Shows tab: CRUD for show listings
- Media tab: "Fetch Latest Videos" button (pulls from YouTube Data API), manage which videos display on Media page

## Data Architecture

### Firestore Collections

**`links`**
```
{ id, label, url, order, createdAt }
```
Admin can add, edit, delete, and drag-to-reorder.

**`shows`**
```
{ id, date (Timestamp), billing, venue, city, ticketUrl? (optional), createdAt }
```
Admin CRUD. Homepage displays only the single next upcoming show. Shows page displays all upcoming. Admin view shows all with past shows grayed out.

**`videos`**
```
{ id, youtubeId, title, thumbnailUrl, publishedAt, createdAt }
```
Synced from YouTube Data API via admin button. Displayed on Media page.

**`settings/home`**
```
{ youtubeUrl, youtubeEnabled }
```
Toggleable YouTube embed on homepage. The `youtubeUrl` can be set manually by admin (to feature a specific video) or picked from the synced videos.

### External Links (constants, not in Firestore)
- Substack: `https://goodluckprayerbook.substack.com/`
- Bandcamp: `https://notmywedding.bandcamp.com/`

### Social Links (constants)
- Instagram: `https://www.instagram.com/_notmywedding`
- YouTube: `https://www.youtube.com/@notmywedding`

## Component Architecture

### Layout & Navigation
- **`Layout`** -- page wrapper with Navbar + Footer
- **`Navbar`** -- horizontal top nav: "wedding" logo left, page links + external links right
- **`MobileNav`** -- mobile navigation (hamburger or simplified)
- **`Footer`** -- social icons (Instagram, YouTube), small "wedding" in Dancing Script

### Homepage Components
- **`HeroImage`** -- headerphoto.jpg with organic/torn edge treatment
- **`YouTubeEmbed`** -- iframe embed, toggleable via admin settings
- **`LinkButton`** -- torn notebook page style with slight random rotation per instance
- **`UpcomingShowPreview`** -- single next show, styled as a pinned flyer

### Content Pages
- **`ShowCard`** -- show listing with date, venue, city, billing, optional ticket link

### Admin (utilitarian)
- **`ProtectedRoute`** -- checks auth, redirects to login
- **`AdminLogin`** -- email/password form
- **`AdminLinks`** -- link CRUD + drag-to-reorder (@dnd-kit) + YouTube homepage embed settings
- **`AdminShows`** -- show CRUD
- **`AdminMedia`** -- "Fetch Latest Videos" button (YouTube Data API), manage video list

### Hooks
- **`useAuth`** -- Firebase auth state via `onAuthStateChanged`
- **`useLinks`** -- real-time Firestore listener, returns links sorted by `order`
- **`useShows`** -- real-time listener, splits into `shows` (all) and `upcomingShows` (future only)
- **`useSettings`** -- listens to `settings/home` document
- **`useVideos`** -- real-time Firestore listener for `videos` collection, sorted by `publishedAt`

### Context
- **`AuthContext`** -- provides `user` state app-wide via `useAuthContext()` hook

## Images Available
- `headerphoto.jpg` -- hero image
- `anna_wheatfield.jpg` -- Anna in wheatfield at sunset
- `anna_live_oleavers.jpg` -- live performance
- `live_show_oleavers.jpg` -- live show
- `live_show_little_boho` (no extension) -- live show
- `bphoto.jpg` -- band photo
- `collage.webp` -- aesthetic reference (collage of ephemera)
- `writingsample.png` -- handwriting sample
- `single_art.jpg` -- single artwork (folk-art birds/rainbow)
- `annaholdingbandtote.jpg` -- merch photo (tote with "wedding" cursive)
- `annawearingbandtshirt.jpg` -- merch photo (t-shirt with "wedding" cursive)

## Key Decisions
- Architecture ported from zacharyroland.dev (same Firebase/hooks/admin patterns)
- No sidebar nav -- horizontal top nav on desktop
- Hardcoded bio initially (can be made admin-editable later)
- No Contact page for now (can be added later)
- Web font for "wedding" logo (Dancing Script); SVG logo can replace later
- About page bio is static; admin-editable is a future enhancement
