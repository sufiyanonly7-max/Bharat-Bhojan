# Future Scope & Architectural Roadmap
**Bharat Bhojan – Traditional Indian Food Knowledge Information System**  
*Academic Project #25 | Future Enhancements & Scaling Possibilities*

---

## 1. Overview

While **Bharat Bhojan** is currently a complete, fully functional, and self-contained academic prototype for BCA 5th-Semester demonstration, its modular architecture allows for logical, real-world scaling in future academic phases or master's-level projects.

This document outlines the planned future roadmap without introducing unnecessary complexity into the current baseline version.

---

## 2. Planned Functional Enhancements

### 2.1 Multilingual Localization (Hindi & Regional Languages)
- **Current State:** The system stores names in English and native scripts (Devanagari, Bengali, Tamil, etc.), but navigation and narratives are in English.
- **Future Enhancement:** Implement dynamic client-side and server-side internationalization (i18n). Users will be able to toggle the entire portal interface into Hindi (हिन्दी) or state-specific languages (e.g., Bhojpuri, Maithili, Odia, Bangla, Punjabi, Marathi, Tamil, Malayalam).

### 2.2 Interactive Graphical Map of India
- **Current State:** Regional exploration occurs through zone tabs and state dropdowns.
- **Future Enhancement:** Incorporate an interactive vector SVG map of India on the homepage. Hovering over a state will highlight its regional specialties, and clicking a state will directly filter the food catalog to that state's dishes.

### 2.3 Community Contribution & Moderation Workflow
- **Current State:** Only authenticated administrators can add, edit, or delete food records.
- **Future Enhancement:** Introduce a public "Submit a Family Heritage Recipe" submission pipeline. Visitors and culinary students can submit dishes with family stories and photographs. These submissions will enter a pending queue on the admin dashboard, where administrators can verify references, edit details, and approve them before they go live on the public website.

### 2.4 Rich Photo & Artisan Craft Archive
- **Current State:** Lightweight, offline vector SVG illustrations represent each dish reliably.
- **Future Enhancement:** Build an integrated media manager supporting high-resolution culinary photography, archival sketches of traditional cooking vessels (e.g., brass *handi*, stone *silbatta*, curved *appachatti*), and short audio clips of native pronunciations.

### 2.5 Progressive Web App (PWA) & Offline Mobile Support
- **Current State:** Responsive web application running smoothly on mobile browsers.
- **Future Enhancement:** Add a Web App Manifest and Service Worker caching (`workbox` or native Cache API). This will allow rural users and students in low-connectivity areas to install the app on their Android/iOS devices and browse the food catalog completely offline.

### 2.6 Advanced Dietary & Ingredient Cross-Querying
- **Current State:** Search queries match keywords across names, states, categories, and ingredients.
- **Future Enhancement:** Build an advanced multi-select ingredient filter (e.g. "Find dishes that contain Sattu AND Mustard Oil, but NO Wheat") to assist researchers studying specific indigenous grains.

### 2.7 Expansion of the Heritage Food Dataset
- **Current State:** A curated dataset of 35 diverse traditional Indian dishes with deep cultural notes.
- **Future Enhancement:** Expand the repository to over 200+ micro-regional dishes, documenting tribal culinary traditions of Central India, lesser-known Himalayan pahadi recipes, and island preparations from Andaman and Lakshadweep.

---

## 3. Technical Scaling Considerations

If transitioning from a local SQLite prototype to a state-wide or university-hosted platform:
1. **Database Migration:** The existing database can be migrated to MySQL 8.0 or PostgreSQL using the compatible schema provided in `docs/mysql-schema.sql`.
2. **Media Storage:** Static image uploads can be routed to local object storage or cloud buckets (e.g., MinIO or AWS S3).
3. **Role-Based Access Control (RBAC):** Expanding the single admin model into multi-tiered roles: *Researchers / Editors* (can submit and draft entries) and *Chief Curators / Superadmins* (can approve and publish).
