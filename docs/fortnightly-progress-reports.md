# Bharat Bhojan – Fortnightly Project Progress Reports

**Project Number:** 25  
**Official Project Title:** Traditional Indian Food-Knowledge Information System  
**System Name:** Bharat Bhojan – Traditional Indian Food Knowledge Information System  
**Technology Domain:** Database + Web Development  
**Academic Degree:** Bachelor of Computer Applications (BCA) – 5th Semester  
**Total Development Period:** 45 Days (Three 15-Day Fortnightly Phases)  

---

# FORTNIGHTLY PROGRESS REPORT — PHASE 1
### (FIRST 15 DAYS: PLANNING, REQUIREMENTS, DATABASE MODELING & PROTOTYPE SETUP)

### 1. Student Details

* **Student Name:** [STUDENT NAME]
* **Roll No.:** [ROLL NUMBER]
* **Project Title:** Traditional Indian Food-Knowledge Information System
* **Reporting Period:**  
  * **From:** [DATE]  
  * **To:** [DATE]  

---

### 2. Work Progress

#### Work Completed:
1. Studied the assigned academic topic (#25: Traditional Indian Food-Knowledge Information System) and analyzed the project guidelines provided by the department.
2. Conducted research on the Indian Knowledge Systems (IKS) component, specifically identifying how traditional food habits connect with India’s six seasons (*Shad-Ritu*), native preservation methods (natural fermentation, earthen oven baking, ash filtration), and regional crop patterns.
3. Defined the problem statement, primary objectives, and functional boundaries of the system, deciding to build an educational information system rather than a generic recipe blog.
4. Finalized the project technology stack: HTML5, CSS3, and Vanilla JavaScript on the frontend, Node.js and Express.js on the backend, and SQLite for the relational database.
5. Designed the Entity-Relationship (ER) model and structured the database schema in Third Normal Form (3NF) across 11 tables to handle complex many-to-many relationships (foods to ingredients, seasons, and bibliographic references).
6. Drafted the initial ANSI SQL schema file (`database/schema.sql`) with primary keys, foreign key constraints, `ON DELETE CASCADE` rules, and performance indexes on search slugs.
7. Created the project directory structure (`config/`, `database/`, `routes/`, `controllers/`, `public/`, `admin/`, `docs/`) and initialized `package.json` with minimal dependencies (`express`, `dotenv`, `express-session`, `bcryptjs`).
8. Configured the SQLite database connection wrapper (`config/database.js`) using Node.js built-in `node:sqlite` engine (`DatabaseSync`).
9. Built the initial static Express web server (`server.js`) capable of serving static files and connecting to the database.
10. Developed the foundational layout of the public landing page (`public/index.html`) with header navigation, brand logo, hero section, and core CSS variables in `public/css/style.css` using a warm Indian aesthetic (terracotta, turmeric, and cream).

#### Tools / Technologies Used:
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (DOM basics)
* **Backend Runtime & Framework:** Node.js, Express.js
* **Database & Query Language:** SQLite, SQL (DDL scripts)
* **Development Environment:** Visual Studio Code / Antigravity IDE, Command Line / PowerShell
* **Version & Package Management:** npm (Node Package Manager)
* **Testing & Inspection Tools:** Browser Developer Tools (Elements, Console)

#### What I Learned:
1. How to analyze academic project requirements and break down a cultural preservation topic into modular web and database components.
2. The practical application of database normalization (1NF, 2NF, and 3NF) and why separating entities into master tables eliminates data redundancy.
3. How to model Many-to-Many relationships using associative junction tables with composite primary keys (`food_ingredients`, `food_seasons`, `food_references`).
4. How to initialize a clean Node.js backend with Express without relying on heavy third-party scaffolding.
5. How to use Node’s native `DatabaseSync` (`node:sqlite`) module to execute synchronous SQL queries and transactions directly on a local file database.
6. The basics of design systems using CSS custom properties (`:root` variables) for consistent theming.

#### Problems Faced (if any):
1. **Handling Multi-Value Attributes:** Traditional foods have multiple ingredients and fit into multiple seasons. Initially, I considered storing them as comma-separated text inside the food table, but this violated First Normal Form (1NF) and made searching impossible. I resolved this by creating independent master tables and associative junction tables.
2. **SQL Reserved Word Conflict:** When naming the bibliographic citations table `references`, SQLite threw syntax errors because `REFERENCES` is an ANSI SQL keyword used in foreign key declarations. I solved this by naming the table `references_tbl`.
3. **Structuring Macro-Geographical Zones:** Classifying diverse Indian states required a standardized grouping. I solved this by creating a parent `regions` table (6 zones) and linking a child `states` table (25 states) via a foreign key with `ON DELETE RESTRICT`.

---

### 3. Plan for Next Period (Phase 2 Tasks)

1. Populate the database by writing a comprehensive seed script (`database/seed.js`) with authentic traditional dishes, ingredients, seasons, and credible references.
2. Develop procedural SVG vector illustrations for local offline display.
3. Build the backend REST API endpoints for food listing, search, filtering, and individual dish details.
4. Implement parameterized SQL queries to prevent SQL injection vulnerabilities.
5. Develop the interactive **Explore Foods** page with real-time 300ms debounced search and multi-criteria filters (State, Region, Season, Category, Diet).
6. Build the comprehensive **Food Details** page (`food.html`) showing native Devanagari script, cultural significance, preparation steps, ingredients with quantities, citations, and related regional dishes.
7. Create dedicated explorer views for **Regional Diversity** (`regions.html`) and **Seasonal Foods** (`seasonal.html`).
8. Connect all frontend views to backend APIs using asynchronous JavaScript and the `fetch()` API.

---

### 4. Signatures

_____________________________  
**Student Signature**  

_____________________________  
**Faculty Guide Signature**  

---
\pagebreak
---

# FORTNIGHTLY PROGRESS REPORT — PHASE 2
### (SECOND 15 DAYS: CORE DEVELOPMENT, REST APIs, SEARCH, FILTERS & PUBLIC VIEWS)

### 1. Student Details

* **Student Name:** [STUDENT NAME]
* **Roll No.:** [ROLL NUMBER]
* **Project Title:** Traditional Indian Food-Knowledge Information System
* **Reporting Period:**  
  * **From:** [DATE]  
  * **To:** [DATE]  

---

### 2. Work Progress

#### Work Completed:
1. Developed the database seeding script (`database/seed.js`) that populates 37 geographically diverse Indian dishes across 21 states, 6 regions, 9 categories, 6 seasons, 165 ingredients, and 12 verified bibliographic citations.
2. Created a procedural SVG asset generation script (`database/generate-assets.js`) producing 38 lightweight vector illustrations stored locally in `public/assets/images/`, allowing the application to function completely offline without external CDNs.
3. Built the public REST API routes and controllers:
   * `routes/foods.js` & `controllers/foodsController.js`: `/api/foods` (multi-parameter filtering), `/api/foods/search` (keyword search), `/api/foods/featured` (curated homepage items), and `/api/foods/:slug` (comprehensive dish details).
   * `routes/metadata.js` & `controllers/metadataController.js`: `/api/states`, `/api/regions`, `/api/categories`, `/api/seasons`, `/api/references`, and `/api/stats`.
4. Implemented secure parameterized SQL statements using prepared statements with `?` placeholders across all controllers, eliminating SQL injection risks.
5. Engineered the **Explore Foods** portal (`public/explore.html` & `public/js/explore.js`) featuring real-time client-side debounced search (300ms timer) and multi-filter dropdowns combining state, region, season, category, and vegetarian/non-vegetarian diet.
6. Developed the **Food Details** page (`public/food.html` & `public/js/food.js`), which parses the dish slug via `URLSearchParams` and renders cultural context, traditional preparation techniques, seasonal associations, ingredients with "Key" badges, citations, and related regional foods.
7. Built the **Regional Diversity** explorer (`public/regions.html` & `public/js/regions.js`) with an interactive 6-zone switcher displaying regional food culture narratives, state tags, and zone-specific dishes.
8. Built the **Seasonal Rhythms** explorer (`public/seasonal.html` & `public/js/seasonal.js`) documenting traditional Indian *Ritu-Charya* seasonal dietary wisdom with season-linked dish cards.
9. Implemented robust UI states across all frontend pages: loading spinners, an empty search results card ("No Matching Traditional Foods" with a filter reset button), and automatic broken-image fallbacks (`onerror="handleImageError(this)"`).
10. Enhanced responsive CSS in `public/css/responsive.css` with media queries for tablets (768px) and mobile devices (360px–400px), including a working mobile hamburger navigation drawer.

#### Tools / Technologies Used:
* **Frontend:** HTML5, CSS3 (CSS Grid, Flexbox, Media Queries), Vanilla JavaScript (ES6+, `async/await`, Fetch API, DOM manipulation)
* **Backend Runtime & Framework:** Node.js, Express.js (Router, JSON parser, Static middleware)
* **Database & Query Language:** SQLite, SQL (Prepared Statements, Parameterized Queries, Multi-table `JOIN` operations)
* **Development & Debugging:** Visual Studio Code, Antigravity, Browser Developer Tools (Network tab, Console)

#### What I Learned:
1. How to organize an Express application into modular routes and controllers following the Model-View-Controller (MVC) architecture.
2. How to use asynchronous JavaScript (`async/await`) and the browser `fetch()` API to retrieve JSON data from backend endpoints and render it dynamically into the DOM.
3. How to implement client-side **debouncing** with `setTimeout()` and `clearTimeout()` to prevent excessive HTTP requests while a user is actively typing in a search input.
4. How to dynamically construct parameterized SQL queries with variable `WHERE` conditions without using dangerous string concatenation.
5. How to read URL query parameters using the JavaScript `URLSearchParams` API for slug-based dynamic page rendering.
6. How to create defensive frontend code with `escapeHtml()` to protect user interfaces against Cross-Site Scripting (XSS).

#### Problems Faced (if any):
1. **Rapid Search Request Flooding:** Initially, every single keystroke in the search bar fired a new HTTP GET request, causing race conditions and unnecessary database workload. I resolved this by implementing a 300ms debounce timer in `explore.js`.
2. **Express Route Ordering Conflict:** In `routes/foods.js`, requests to `/api/foods/featured` were initially being captured by the dynamic `/api/foods/:slug` route handler, treating the word "featured" as a dish slug. I solved this by declaring the specific `/featured` and `/search` routes before the dynamic `/:slug` route.
3. **Complex Relational Data Aggregation:** Fetching a single food record required joining information from 5 different tables (states, regions, categories, ingredients, seasons, and references). I resolved this in `foodsController.js` by executing coordinated prepared queries that bundle the main record with child arrays of ingredients, seasons, and citations.

---

### 3. Plan for Next Period (Phase 3 Tasks)

1. Develop the administrator authentication system using `express-session` and salted password hashing with `bcryptjs`.
2. Create route protection middleware (`middleware/auth.js`) to secure administrative API routes and web pages.
3. Build the administrative dashboard (`admin/dashboard.html`) displaying live summary metrics and a searchable food management data table.
4. Implement the Add / Edit Food form (`admin/food-form.html`) with dynamic ingredient rows and checkbox bindings.
5. Implement full transactional CRUD operations (Create, Read, Update, Delete) with atomic SQL transactions and foreign key cascading.
6. Author an automated end-to-end integration test suite (`test-system.js`) covering all routes, APIs, search, filtering, and CRUD operations.
7. Conduct a comprehensive cultural and factual audit of all 37 food records, removing unsupported health claims.
8. Prepare final academic documentation: project proposal, report outline, database documentation, testing report, viva revision guides, and a submission-ready project ZIP archive.

---

### 4. Signatures

_____________________________  
**Student Signature**  

_____________________________  
**Faculty Guide Signature**  

---
\pagebreak
---

# FORTNIGHTLY PROGRESS REPORT — PHASE 3
### (FINAL 15 DAYS: ADMIN PORTAL, SECURITY, TESTING, AUDIT, DOCUMENTATION & SUBMISSION)

### 1. Student Details

* **Student Name:** [STUDENT NAME]
* **Roll No.:** [ROLL NUMBER]
* **Project Title:** Traditional Indian Food-Knowledge Information System
* **Reporting Period:**  
  * **From:** [DATE]  
  * **To:** [DATE]  

---

### 2. Work Progress

#### Work Completed:
1. Developed the administrator authentication system using `express-session` with secure HTTP cookies (`httpOnly: true`) and `bcryptjs` password hashing (10 salt rounds), ensuring passwords are never stored in plain text.
2. Built custom route protection middleware (`middleware/auth.js`) that intercepts unauthorized requests to administrative routes, returning HTTP 401 Unauthorized JSON for API calls and redirecting browser visits to `/admin/login.html`.
3. Created a command-line administrator management utility (`database/create-admin.js`) allowing creation or password resetting of admin accounts via the terminal.
4. Built the administrative portal interface:
   * `admin/login.html`: Clean, accessible sign-in form with server response alerts.
   * `admin/dashboard.html`: Live summary metrics (total foods, states, regions, categories, references) and an interactive management data table.
   * `admin/food-form.html` & `admin/admin.js`: Dynamic Add/Edit food form supporting multi-input ingredient rows, category dropdowns, seasonal checkboxes, and reference selections.
5. Implemented complete transactional CRUD operations (Create, Read, Update, Delete) in `controllers/adminController.js`, using atomic SQL transactions (`BEGIN IMMEDIATE ... COMMIT`) to ensure multi-table insertions succeed or roll back together.
6. Verified database cascade deletions: deleting a food record automatically removes its linked records in `food_ingredients`, `food_seasons`, and `food_references` via SQLite `ON DELETE CASCADE`.
7. Developed an automated end-to-end integration test suite (`test-system.js`) executing 43 automated assertions across 23 testing scenarios with a 100% pass rate.
8. Conducted a thorough data quality audit of all 37 food records, eliminating pseudo-scientific or medical claims (e.g. sanitizing descriptions for *Kangshoi* and *Mishti Doi*) and adding 2 verified Bihar dishes (*Mithila Makhana Kheer* and *Bihari Malpua*) to bring Bihar representation to 8 dishes.
9. Audited all 12 bibliographic citations and restructured `public/references.html` into 4 verified academic groups: *Government & Institutional Sources*, *Authoritative Books*, *Academic Journals*, and *Cultural Archives*.
10. Added centralized error handling: a custom responsive 404 page (`public/404.html`) and structured JSON 404 responses for invalid API endpoints.
11. Created complete academic project documentation in `docs/`: project proposal, report outline, database design guide, API documentation, testing report, viva revision notes (60 questions), viva survival guide, teacher demo checklist, 1-page cheat sheet, and MySQL schema (`docs/mysql-schema.sql`).
12. Packaged the final submission-ready project archive (`Bharat-Bhojan-BCA-Project.zip`), excluding `node_modules`, `.env`, and temporary files.

#### Tools / Technologies Used:
* **Frontend:** HTML5, CSS3 (Responsive Design down to 360px), Vanilla JavaScript (AJAX Form Handling, DOM manipulation)
* **Backend Runtime & Framework:** Node.js, Express.js
* **Security & Authentication:** `express-session` (Cookie-based Sessions), `bcryptjs` (Cryptographic Hashing)
* **Database & Query Language:** SQLite, ANSI SQL, MySQL 8.0+ Schema (DDL)
* **Testing & Quality Assurance:** Custom Automated Test Harness (`test-system.js`), Manual Test Matrix (`docs/testing.md`)
* **Archival & Documentation:** Markdown, `tar.exe` / Zip compression, Visual Studio Code

#### What I Learned:
1. How to implement session-based authentication in Express and understand the security distinction between session cookies (`httpOnly: true`) and client-side storage.
2. The necessity of cryptographic salting and hashing with bcrypt rather than storing plain text or using outdated algorithms like MD5.
3. How to use database transactions (`BEGIN IMMEDIATE ... COMMIT` and `ROLLBACK`) to preserve data integrity when inserting across parent and junction tables.
4. How to author an automated integration test script in Node.js to programmatically verify HTTP status codes, JSON payloads, authentication guards, and CRUD lifecycles.
5. The importance of data hygiene and cultural accuracy in academic information systems, including the deliberate exclusion of unsupported medical claims.
6. How to prepare professional, structured academic documentation for viva voce examination and faculty demonstration.

#### Problems Faced (if any):
1. **API vs Page Route Guard Behavior:** Initially, unauthenticated requests to protected API endpoints (`/api/admin/dashboard`) were redirected via HTTP 302 to the HTML login page. This confused frontend JavaScript API calls. I resolved this in `middleware/auth.js` by checking `req.originalUrl.startsWith('/api/')` and returning an HTTP 401 Unauthorized JSON error for API requests while redirecting page navigations.
2. **Database Seeding Idempotency:** When re-running `seed.js` during testing, the script threw `UNIQUE constraint failed: foods.slug` errors because old records and autoincrement counters were not cleared. I resolved this by adding table truncation and `DELETE FROM sqlite_sequence;` in `seed.js` so seeding is safe to run repeatedly.
3. **Dynamic Primary Key Tracking in Tests:** In `test-system.js`, hardcoding foreign key IDs caused failures when SQLite autoincrement sequences changed. I resolved this by dynamically fetching active state and category IDs via metadata endpoints before executing test CRUD operations.

---

### 3. Plan for Next Period (Post-Development & Final Submission Tasks)

1. Conduct the final live project demonstration before the faculty project guide using the 14-step presentation sequence (`docs/teacher-demo-checklist.md`).
2. Print and bind the final BCA 5th-Semester Project Report following the 9-chapter structure in `docs/report-outline.md`.
3. Prepare the final presentation slides (PowerPoint / PDF) summarizing the project objectives, architecture, database schema, and test results.
4. Rehearse viva voce questions using `docs/one-page-cheat-sheet.md` and `docs/viva-notes.md`.
5. Submit the final project dossier, including the clean source code archive (`Bharat-Bhojan-BCA-Project.zip`), printed report, and completed fortnightly progress forms to the department.

---

### 4. Signatures

_____________________________  
**Student Signature**  

_____________________________  
**Faculty Guide Signature**  

---
\pagebreak
---

# 45-Day Project Development Timeline

The table below illustrates the realistic, day-by-day progression of the **Bharat Bhojan** project across all three 15-day fortnightly phases:

| Days | Stage | Major Work Completed | Expected Output / Deliverable |
| :---: | :--- | :--- | :--- |
| **Day 1–5** | *Requirements & IKS Research* | Studied topic #25 guidelines; researched Indian Knowledge Systems (Shad-Ritu, traditional fermentation, regional grains); defined problem statement, objectives, and scope boundaries. | Project requirements document and technology stack decision (HTML/CSS/JS + Node/Express + SQLite). |
| **Day 6–10** | *Database Modeling & Schema Design* | Designed relational ER model in 3NF; identified 11 tables; structured junction tables for foods, ingredients, seasons, and references; drafted `database/schema.sql`. | Canonical ANSI SQL DDL script with foreign keys, cascading rules, and B-Tree indexes. |
| **Day 11–15** | *Project Scaffolding & Initial Prototype* | Set up Node.js/Express server (`server.js`); connected SQLite via `config/database.js`; built basic landing page layout (`public/index.html`) with brand header, hero banner, and foundational CSS variables (`public/css/style.css`). | Working local server serving initial static layout and verifying SQLite database connection. |
| **Day 16–20** | *Database Seeding & Asset Generation* | Developed `database/seed.js` with 37 authentic dishes, 25 states, 6 regions, 9 categories, 6 seasons, and 12 references; wrote `database/generate-assets.js` producing 38 local SVG illustrations. | Fully seeded local database (`bharat_bhojan.db`) and local vector images for 100% offline usage. |
| **Day 21–25** | *REST API Development* | Built Express routes and controllers (`foodsController.js`, `metadataController.js`); implemented parameterized SQL queries for multi-criteria filtering, search, and slug detail lookups. | Functional REST API endpoints (`/api/foods`, `/api/foods/search`, `/api/foods/:slug`, `/api/stats`, `/api/states`). |
| **Day 26–30** | *Public Interactive Pages & Client JS* | Developed Explore Foods page with 300ms debounced search and multi-filters (`explore.js`); built Food Details page (`food.js`), Regions explorer (`regions.js`), and Seasonal explorer (`seasonal.js`); styled mobile layout (`responsive.css`). | Fully interactive public web portal with live search, dynamic filtering, detail rendering, and mobile drawer. |
| **Day 31–35** | *Admin Security & Authentication* | Integrated `express-session` and `bcryptjs`; created `middleware/auth.js` route protection; built admin login page (`admin/login.html`) and CLI credential manager (`database/create-admin.js`). | Secure session-based authentication system with salted password hashing and protected routes. |
| **Day 36–40** | *Admin CRUD & Quality Assurance* | Developed admin dashboard (`dashboard.html`) with live metrics and management table; built Add/Edit food form (`food-form.html`) with dynamic ingredient rows; implemented transactional CRUD; authored automated test suite (`test-system.js`). | Working administrative management portal and automated test suite with 43 passing assertions. |
| **Day 41–45** | *Audit, Documentation & Final Handover* | Audited food records to eliminate medical claims; enriched Bihar dishes to 8; restructured references into 4 groups; created complete academic documentation suite in `docs/`; generated clean submission ZIP. | Final submission-ready project archive (`Bharat-Bhojan-BCA-Project.zip`) and comprehensive project dossier. |
