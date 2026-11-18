# Bharat Bhojan – Traditional Indian Food Knowledge Information System
**Academic Project #25 | Technology Domain: Database + Web Development**  
*Curated Educational Prototype for BCA 5th-Semester Demonstration*

---

## 📌 Project Overview

**Bharat Bhojan** is a database-driven web information portal dedicated to systematically documenting, organizing, and discovering traditional regional foods across India. 

Rather than serving merely as a static recipe blog, Bharat Bhojan implements a normalized relational database (3NF) to interconnect dishes with their:
- Geographical provenance (States & 6 Indian Geographical Zones)
- Agrarian and native ingredients (with quantities and key ingredient flags)
- Traditional preparation methods (earthen cooking, wood-fired baking, steaming, natural fermentation)
- Seasonal rhythms (Indian *Shad-Ritu* agro-climatic cycles)
- Cultural and historical significance (folklore, royal origins, and sacred prasad)
- Credible sources (government tourism departments, GI journals, and university publications)

The system includes a responsive public exploration portal with real-time debounced search, multi-criteria filtering, and detailed dish views, alongside a session-authenticated administrator portal for full CRUD operations.

---

## 🎯 Problem Statement & Objectives

### The Problem
Traditional Indian culinary knowledge is historically rich and deeply attuned to local ecology, but is fragmented across oral traditions, regional books, family recipes, and unverified blogs. In mainstream media, food is frequently disconnected from its seasonality, geographical origin, and traditional preparation science.

### Project Objectives
1. **Digital Documentation:** Digitally catalog selected traditional Indian dishes with verified regional, botanical, and cultural attributes.
2. **Relational Organization:** Model a 3-tier normalized relational schema linking foods, states, regions, categories, ingredients, seasons, and references.
3. **Interactive Search & Discovery:** Provide instant, debounced multi-field search and combined parameter filtering.
4. **Cultural Context Presentation:** Highlight traditional cooking techniques and cultural heritage while explicitly recognizing that household variations exist.
5. **Beginner-Friendly Architecture:** Deliver production-quality code in pure HTML5, CSS3, Vanilla JavaScript, Node.js, Express, and SQLite without unnecessary framework overhead.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | Semantic markup, zero external dependencies, accessible, transparent for student explanation during viva. |
| **Backend** | Node.js (v22+ / v26 LTS), Express.js | Lightweight asynchronous REST server using classic MVC-inspired separation. |
| **Database** | SQLite via built-in `node:sqlite` | Zero native build headaches (`node-gyp`), 100% portable single-file database, standard SQL query execution. |
| **Security** | `bcryptjs`, `express-session` | Industry-standard salted password hashing and secure HTTP session cookies. |
| **Configuration** | `dotenv` | Centralized environment variable management. |
| **Schema Reference** | SQLite & MySQL 8.0+ | Compatible schemas provided for academic discussion and flexible hosting. |

---

## 📂 Project Directory Structure

```text
bharat-bhojan/
│
├── package.json               # Project manifest, scripts, and minimal dependencies
├── server.js                  # Express application entry point and route mounting
├── .env.example               # Environment variables template
├── .env                       # Local environment configuration
├── .gitignore                 # Git ignore rules for node_modules, .env, and *.db
├── README.md                  # Comprehensive project documentation
│
├── config/
│   └── database.js            # SQLite connection singleton and query helper methods
│
├── database/
│   ├── schema.sql             # Canonical SQLite table creation script with indexes
│   ├── seed.js                # Database seed script (37 authentic dishes + 12 references + metadata)
│   ├── create-admin.js        # Command-line utility to create or reset admin accounts
│   ├── generate-assets.js     # Generates 38 local offline SVG vector illustrations
│   └── bharat_bhojan.db       # Active SQLite database file
│
├── routes/
│   ├── foods.js               # Public endpoints (/api/foods, /api/foods/:slug, /search, /featured)
│   ├── metadata.js            # Metadata endpoints (/api/states, /api/regions, /api/seasons, etc.)
│   └── admin.js               # Protected administrative endpoints (/api/admin/...)
│
├── controllers/
│   ├── foodsController.js     # Query builder, filtering, search, and detail aggregations
│   ├── metadataController.js  # Dropdown metadata and platform statistics
│   └── adminController.js     # Admin auth, dashboard metrics, and transactional CRUD
│
├── middleware/
│   ├── auth.js                # Session-based admin route protection middleware
│   └── errorHandler.js        # Central error handler and custom 404 handlers
│
├── public/                    # Public web application assets
│   ├── index.html             # Landing page with hero, search, stats, and featured dishes
│   ├── explore.html           # Multi-filter explorer with real-time search & sorting
│   ├── food.html              # Comprehensive food details view
│   ├── regions.html           # Geographical zones explorer (East, North, South, West, etc.)
│   ├── seasonal.html          # Indian seasonal rhythms (Ritu-Charya) food explorer
│   ├── about.html             # Project background, IKS foundation, and limitations
│   ├── references.html        # Academic bibliography and source archives (4 grouped sections)
│   ├── 404.html               # Custom 404 Not Found page
│   │
│   ├── css/
│   │   ├── style.css          # Design system, CSS variables, typography, and components
│   │   └── responsive.css     # Responsive breakpoints (360px mobile, tablet, desktop)
│   │
│   ├── js/
│   │   ├── main.js            # Navigation toggle, image error fallback, and stats loader
│   │   ├── explore.js         # Debounced search, multi-filter combinations, and card rendering
│   │   ├── food.js            # Detail page population and related dishes renderer
│   │   ├── regions.js         # Interactive region tabs and dish loader
│   │   └── seasonal.js        # Seasonal tab switcher and dish loader
│   │
│   └── assets/
│       └── images/            # 38 high-fidelity local SVG dish illustrations
│
├── admin/                     # Administrative web portal
│   ├── login.html             # Admin login form
│   ├── dashboard.html         # Summary metrics & food records management table
│   ├── food-form.html         # Dynamic Add / Edit food form with ingredient rows
│   ├── admin.css              # Administrative portal styling
│   └── admin.js               # Client-side admin verification and CRUD handling
│
├── docs/                      # Comprehensive Academic & Technical Documentation Suite
│   ├── viva-survival.md       # Top 20 rapid viva Q&As, elevator pitches (30s, 1m, 2m)
│   ├── simple-architecture.md # System architecture & step-by-step trace of "Litti Chokha" search
│   ├── database-viva.md       # Exhaustive 11-table schema, 3NF normalization & query guide
│   ├── code-study-guide.md    # Top 15 codebase files, important functions & code walkthroughs
│   ├── 7-day-project-learning-plan.md # Day-by-day mastery roadmap for a BCA student
│   ├── data-quality-report.md # Verified statistical report on dataset integrity & citations
│   ├── final-audit.md         # Professional audit log of enhancements, fixes & limitations
│   ├── viva-notes.md          # 60 categorized student-friendly viva questions and answers
│   ├── project-proposal.md    # Formal BCA project proposal
│   ├── database-design.md     # Normalized schema documentation with Mermaid ER diagram
│   ├── api-documentation.md   # REST API endpoint reference and query specifications
│   ├── testing.md             # Comprehensive manual test cases matrix
│   ├── how-it-works.md        # Step-by-step data flow guide for viva learning
│   ├── demo-script.md         # 5–7 minute presentation demonstration script
│   ├── report-outline.md      # 9-chapter BCA project report outline
│   ├── future-scope.md        # Sensible future roadmap
│   ├── schema.sql             # SQLite schema reference copy
│   └── mysql-schema.sql       # MySQL 8.0+ compatible database schema
│
├── test-system.js             # Automated end-to-end integration test suite (43 assertions)
```

---

## 💾 Database Design Overview

The database uses a 3NF normalized schema with 11 tables and performance-optimized indexes:

1. **`regions`**: 6 Indian geographical zones (East, North, South, West, Central, North-East).
2. **`states`**: Indian states foreign-keyed to their respective geographical region.
3. **`categories`**: Food types (Main Dish, Bread & Flatbread, Rice Preparation, Snack & Savory, Sweet & Confectionery, Beverage, Fermented Food, Festival Food, Preserved Food).
4. **`seasons`**: Indian agro-climatic seasons (Summer, Monsoon, Autumn, Winter, Spring, Year-round).
5. **`foods`**: Core entity with names, native script, slug, description, cultural context, preparation method, seasonality notes, festival notes, serving customs, dietary classification (`Vegetarian` / `Non-Vegetarian`), image path, and timestamps.
6. **`ingredients`**: Normalized unique pantry and agrarian items.
7. **`food_ingredients`**: Junction table (Many-to-Many) linking foods to ingredients with quantities and primary/key flags.
8. **`food_seasons`**: Junction table (Many-to-Many) associating foods with multiple seasons.
9. **`references_tbl`**: Scholarly books, government tourism archives, and GI journals.
10. **`food_references`**: Junction table (Many-to-Many) connecting foods to bibliographic sources.
11. **`admins`**: Administrator accounts with bcrypt password hashes.

*(Detailed ER Diagram and relationship descriptions are available in [`docs/database-design.md`](file:///C:/Users/hp/.gemini/antigravity/scratch/bharat-bhojan/docs/database-design.md)).*

---

## 🚀 Quickstart Installation Guide

### Prerequisites
- **Node.js** (v22.5.0 or later, including v26 LTS).  
  *Verify by running: `node -v`*
- Modern web browser (Chrome, Edge, Firefox, Safari).

### Step-by-Step Setup

1. **Navigate to the Project Directory:**
   ```bash
   cd bharat-bhojan
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   *(Installs 4 minimal packages: `express`, `dotenv`, `express-session`, `bcryptjs`).*

3. **Initialize & Seed the Database:**
   ```bash
   npm run seed
   ```
   *(Executes `database/schema.sql`, seeds 37 authentic regional dishes, master metadata, and default administrator credentials).*

4. **Start the Application Server:**
   ```bash
   npm start
   ```

5. **Open in Your Browser:**
   - **Public Website:** [http://localhost:3000](http://localhost:3000)
   - **Admin Portal:** [http://localhost:3000/admin/login.html](http://localhost:3000/admin/login.html)

---

## 🔑 Administrator Setup & Password Management

| Field | Default Value | Notes |
| :--- | :--- | :--- |
| **Username** | `admin` | Defined in `.env` |
| **Password** | `admin123` | Hashed using bcrypt (10 rounds) in the database |

> **Security Note:** Credentials are never displayed on the public website or admin login screen.

### How to Change the Admin Password
To update the admin password or create an additional administrator account via the command line:
```bash
# Syntax: node database/create-admin.js <username> <new_password>
node database/create-admin.js admin MyNewSecurePassword123
```
This utility automatically hashes the new password with bcrypt and updates the `admins` table.

---

## 📚 Viva Preparation & Academic Documentation

All project documentation is located in the `docs/` folder:

| Document | Purpose |
| :--- | :--- |
| [one-page-cheat-sheet.md](docs/one-page-cheat-sheet.md) | **1-Page summary** for rapid revision on viva morning. |
| [viva-survival.md](docs/viva-survival.md) | **Top 20 rapid-fire questions**, 30s/1m/2m elevator pitches, and tips for tricky questions. |
| [teacher-demo-checklist.md](docs/teacher-demo-checklist.md) | **14-step presentation sequence** for demonstrating the project to teachers. |
| [submission-checklist.md](docs/submission-checklist.md) | **Final submission checklist** for burning CDs or submitting project files. |
| [database-viva.md](docs/database-viva.md) | **Deep dive into all 11 tables**, 3NF normalization, composite keys, and indexing. |
| [simple-architecture.md](docs/simple-architecture.md) | **System architecture** and 10-step trace of searching for "Litti Chokha". |
| [code-study-guide.md](docs/code-study-guide.md) | **Walkthrough of top 15 files**, key functions, and line-by-line explanations. |
| [7-day-project-learning-plan.md](docs/7-day-project-learning-plan.md) | **Day-by-day self-study roadmap** for a BCA student. |
| [data-quality-report.md](docs/data-quality-report.md) | **Database-calculated metrics** and source verification audit. |
| [final-audit.md](docs/final-audit.md) | **System audit log**, 9.8/10 health score, and solved weaknesses. |
| [viva-notes.md](docs/viva-notes.md) | **60 categorized viva questions and answers** across all domains. |
| [project-proposal.md](docs/project-proposal.md) | Formal academic project proposal. |
| [report-outline.md](docs/report-outline.md) | 9-chapter complete project report outline. |
| [mysql-schema.sql](docs/mysql-schema.sql) | MySQL 8.0+ compatible database schema. |

---

## 📡 REST API Summary

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/foods` | Query foods with filters (`state`, `region`, `season`, `category`, `veg_type`, `sort`) | Public |
| `GET` | `/api/foods/featured` | Fetch featured traditional dishes for homepage | Public |
| `GET` | `/api/foods/search?q=` | Keyword search across name, state, ingredients, cultural notes | Public |
| `GET` | `/api/foods/:slug` | Fetch complete dish details with joined ingredients, seasons, and refs | Public |
| `GET` | `/api/states` | Fetch list of states with represented food counts | Public |
| `GET` | `/api/regions` | Fetch 6 geographical zones with state lists and food counts | Public |
| `GET` | `/api/categories` | Fetch food categories | Public |
| `GET` | `/api/seasons` | Fetch seasons with linked dish counts | Public |
| `GET` | `/api/references` | Fetch bibliographic library of academic sources | Public |
| `GET` | `/api/stats` | Fetch aggregate counts for landing page counters | Public |
| `POST` | `/api/admin/login` | Session login with bcrypt verification | Public |
| `POST` | `/api/admin/logout` | Destroy active administrator session | Protected |
| `GET` | `/api/admin/dashboard` | Fetch dashboard metrics and complete management table | Protected |
| `GET` | `/api/admin/foods/:id` | Fetch single food record for pre-populating edit form | Protected |
| `POST` | `/api/admin/foods` | Create new food record with ingredients and seasons | Protected |
| `PUT` | `/api/admin/foods/:id` | Update existing food record and synchronize junction tables | Protected |
| `DELETE`| `/api/admin/foods/:id` | Delete food record (cascades junction tables) | Protected |

*(Complete API specifications, parameter lists, and sample JSON payloads are documented in [`docs/api-documentation.md`](file:///C:/Users/hp/.gemini/antigravity/scratch/bharat-bhojan/docs/api-documentation.md)).*

---

## 🖼️ User Interface & Design Philosophy

- **Warm Earthy Palette:** Inspired by traditional Indian terracotta pottery (`#A8422B`), turmeric spice (`#D48817`), and parchment cream (`#FAF7F2`).
- **No Neon or Clichés:** Clean, modern, accessible typography with high contrast ratios.
- **Mobile-First Responsive Grid:** Thoroughly styled and tested across 360px mobile viewports, tablets, laptops, and desktop monitors.
- **Graceful Asset Fallbacks:** Every image element contains an automatic inline SVG fallback (`onerror="handleImageError(this)"`) preventing broken images if an asset is unavailable.

---

## ⚖️ Academic Disclaimer

This project is developed as a **curated educational prototype** for the BCA 5th-Semester curriculum. 
- It does **not** assert an absolute "single authentic recipe" for any dish, explicitly recognizing that community, village, and household variations exist.
- It does **not** make medical, therapeutic, or clinical health claims; culinary descriptions focus strictly on cultural history, traditional preparation techniques, and agricultural seasonality.

---

## 🔮 Future Scope

1. **Multilingual Interface:** Adding Hindi (हिन्दी) and regional language localization.
2. **Interactive Geographic Map:** An interactive SVG map of India allowing visual exploration by clicking states.
3. **Community Contribution Workflow:** Crowdsourced traditional recipes submitted by students and moderated by admins.
4. **Offline PWA:** Progressive Web App service worker caching for offline access in rural areas.
