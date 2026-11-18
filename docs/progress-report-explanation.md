# Bharat Bhojan – Faculty Explanation Notes for Progress Reports

A student defense and explanation guide matching the three fortnightly progress reports. If your faculty guide or external examiner asks about any specific phase, this guide tells you **which files prove the work**, **what to demonstrate**, **what questions they may ask**, and **exact student-level answers to give**.

---

## PHASE 1 EXPLANATION GUIDE (First 15 Days: Foundation & Architecture)

### 1. Code & Files That Prove Phase 1 Work Exists
* **Database Modeling:** `database/schema.sql` (Contains the 11 normalized tables, foreign keys, and indexes).
* **Project Configuration:** `package.json` (Shows minimal 4 dependencies initialized).
* **Database Connection Wrapper:** `config/database.js` (Shows the native `DatabaseSync` SQLite connection).
* **Initial Server Setup:** `server.js` (Express application initialization, middleware, and static asset serving).
* **Baseline Frontend Layout:** `public/index.html` (Semantic HTML5 header, hero, and footer structure).
* **Design System & Styling:** `public/css/style.css` (CSS custom properties `--primary`, `--accent-terracotta`, `--bg-cream`).
* **Requirements & Proposal:** `docs/project-proposal.md` and `docs/database-design.md`.

---

### 2. What You Should Show Your Teacher If Asked
1. Open `database/schema.sql` in VS Code and explain:
   * *"Sir/Madam, during Phase 1, my primary focus was database architecture. Here is our relational schema with 11 tables normalized to Third Normal Form (3NF)."*
   * Point to `regions`, `states`, `foods`, and the junction tables `food_ingredients` and `food_seasons`.
2. Open `server.js` and `config/database.js`:
   * *"Here is our backend foundation using Node.js and Express. In `database.js`, we use Node's built-in `node:sqlite` module to talk to our local `bharat_bhojan.db` file."*
3. Open the browser to `http://localhost:3000`:
   * Show the home page banner, navbar, and explain how CSS variables in `style.css` create the warm Indian terracotta and turmeric theme.

---

### 3. Questions Your Faculty Guide May Ask & Your Answers

#### Q1: "Why did you choose SQLite instead of MySQL or MongoDB for your project?"
* **Your Answer:** *"Sir/Madam, SQLite is a serverless, single-file relational database (`bharat_bhojan.db`) that requires zero complex background server configuration, making it fast and 100% reliable to run and demonstrate locally. Node.js now has native SQLite support (`node:sqlite`), which eliminates external build dependencies. However, because our schema is ANSI SQL compliant, I also created `docs/mysql-schema.sql` so the exact same tables can run on MySQL 8.0."*

#### Q2: "How did you normalize the database? Give an example of 3NF in your project."
* **Your Answer:** *"The database satisfies 3NF because:
1. **1NF:** Every cell contains atomic values. We do not store comma-separated lists of ingredients or seasons in the foods table.
2. **2NF:** In our junction tables like `food_ingredients`, non-key columns (like `quantity_or_note`) depend on the full composite primary key `(food_id, ingredient_id)`.
3. **3NF:** We eliminated transitive dependencies. Instead of storing `state_name` and `region_name` inside the `foods` table, we separated them into `states` and `regions` lookup tables, linking them through foreign keys."*

#### Q3: "Why do you have junction tables like `food_ingredients` and `food_seasons`?"
* **Your Answer:** *"Because the relationship between foods and ingredients is Many-to-Many. One dish has multiple ingredients, and one ingredient (like mustard oil or ginger) is used across multiple dishes. A junction table resolves this into two One-to-Many relationships using a composite primary key to prevent duplicate links."*

---
\pagebreak
---

## PHASE 2 EXPLANATION GUIDE (Second 15 Days: Core Development & Public APIs)

### 1. Code & Files That Prove Phase 2 Work Exists
* **Database Seeding:** `database/seed.js` (Populates 37 dishes across 21 states, 6 regions, 9 categories, 6 seasons, and 12 references).
* **Local Offline Assets:** `database/generate-assets.js` and `public/assets/images/*.svg` (38 local SVG illustrations).
* **Public REST API Routers:** `routes/foods.js` and `routes/metadata.js`.
* **Business Logic & Query Handlers:** `controllers/foodsController.js` and `controllers/metadataController.js`.
* **Explore Foods Interface:** `public/explore.html` and `public/js/explore.js` (Search, multi-filter toolbar, card grid).
* **Dish Details Interface:** `public/food.html` and `public/js/food.js` (Slug-based dynamic detail rendering).
* **Regional & Seasonal Explorers:** `public/regions.html`, `public/js/regions.js`, `public/seasonal.html`, `public/js/seasonal.js`.
* **Responsive Styling:** `public/css/responsive.css` (Mobile media queries and mobile drawer navigation).

---

### 2. What You Should Show Your Teacher If Asked
1. Open `http://localhost:3000/explore.html`:
   * Type `"sattu"` or `"Litti"` in the search bar. Show how the cards filter in real time.
   * Explain: *"Sir/Madam, I implemented client-side debouncing with a 300ms delay to prevent sending an API request on every keystroke."*
2. Demonstrate Multi-Criteria Filtering:
   * Select **State:** *Bihar* and **Season:** *Winter*. Show that the grid displays 4 matching winter dishes.
3. Open a Food Detail Page (`/food.html?slug=litti-chokha`):
   * Point out the native Devanagari script, the cultural history block, the academic variation disclaimer, the key ingredients sidebar, and related regional dishes.
4. Open `controllers/foodsController.js` in VS Code:
   * Show lines where SQL prepared statements use `?` placeholders: *"Sir/Madam, we strictly use parameterized queries to prevent SQL injection."*

---

### 3. Questions Your Faculty Guide May Ask & Your Answers

#### Q1: "What is debouncing and why did you implement it in JavaScript?"
* **Your Answer:** *"Debouncing is a technique that delays calling a function until a certain amount of time (300 milliseconds in our code) has passed since the user last pressed a key. Without debouncing, typing 'Litti' would send 5 separate HTTP GET requests to the server (`L`, `Li`, `Lit`, `Litt`, `Litti`). Debouncing sends only one request when the user pauses, reducing server load and avoiding race conditions."*

#### Q2: "How does your backend prevent SQL Injection when filtering or searching?"
* **Your Answer:** *"In `foodsController.js`, we never concatenate user search inputs directly into SQL strings. Instead, we use parameterized prepared statements with `?` placeholders (`WHERE f.name LIKE ?`). The SQLite engine treats user inputs purely as literal data values, making it impossible for malicious SQL commands to execute."*

#### Q3: "How does `food.html` know which specific dish to load from the database?"
* **Your Answer:** *"Each dish has a unique, URL-safe string called a `slug` (e.g. `litti-chokha`). When a user clicks a dish card, the browser opens `/food.html?slug=litti-chokha`. Client-side JavaScript in `food.js` uses `new URLSearchParams(window.location.search).get('slug')` to read the slug and calls our REST API `/api/foods/:slug` to fetch the record."*

#### Q4: "Why did you use Vanilla JavaScript instead of React or Angular?"
* **Your Answer:** *"The goal of a BCA 5th-semester project is to prove mastery of core computer science and web development fundamentals. Frameworks like React add complex build tools and virtual DOM abstractions. Writing pure Vanilla JavaScript demonstrates that I understand DOM manipulation, the `fetch()` API, `async/await`, and asynchronous event handling directly."*

---
\pagebreak
---

## PHASE 3 EXPLANATION GUIDE (Final 15 Days: Admin, Security, Testing & Submission)

### 1. Code & Files That Prove Phase 3 Work Exists
* **Authentication Middleware:** `middleware/auth.js` (`requireAdminAuth` route guard).
* **Password Hashing & Sessions:** `server.js` (`express-session` config) and `controllers/adminController.js` (`bcrypt.compareSync`).
* **Admin Portal Pages & Logic:** `admin/login.html`, `admin/dashboard.html`, `admin/food-form.html`, `admin/admin.js`, and `admin/admin.css`.
* **Admin Account CLI:** `database/create-admin.js`.
* **Automated Test Suite:** `test-system.js` (43 automated assertions covering all routes and CRUD operations).
* **Centralized Error Handling:** `middleware/errorHandler.js` and `public/404.html`.
* **Academic Documentation Suite:** All documents inside `docs/` (`viva-survival.md`, `one-page-cheat-sheet.md`, `teacher-demo-checklist.md`, `database-viva.md`, `data-quality-report.md`, `testing.md`).
* **Submission Archive:** `Bharat-Bhojan-BCA-Project.zip`.

---

### 2. What You Should Show Your Teacher If Asked
1. Open `http://localhost:3000/admin/login.html`:
   * Enter incorrect credentials to show the error alert (`HTTP 401`).
   * Enter `admin` / `admin123` and log in successfully to the dashboard.
2. Demonstrate Live CRUD on the Admin Dashboard:
   * Point out the summary cards (Total Foods, States, Regions, Categories, References).
   * Click **"+ Add Traditional Food"**, fill out a test dish with ingredients and seasons, and submit.
   * Show that the new dish immediately appears in the management table and on the public explore page.
   * Edit the record to change the description, save, and show the change.
   * Click **"Delete"**, confirm the browser modal prompt, and show that the record is removed.
3. Open Terminal and run the automated test suite:
   ```bash
   node test-system.js
   ```
   * Show the output: `Verification Summary: 43 Passed, 0 Failed`.
4. Open the `docs/` folder in VS Code and show the complete academic report dossier.

---

### 3. Questions Your Faculty Guide May Ask & Your Answers

#### Q1: "How do you protect passwords in the database? Why not use MD5?"
* **Your Answer:** *"We use `bcryptjs` with 10 salt rounds. MD5 and SHA1 are general-purpose hash functions that are extremely fast, making them vulnerable to brute-force and rainbow-table attacks. Bcrypt is a slow, computationally intensive cryptographic hashing algorithm that automatically generates a unique random salt for every password, ensuring identical passwords produce completely different hash strings."*

#### Q2: "How does session authentication work between the browser and Express?"
* **Your Answer:** *"When the admin logs in successfully, the server creates a session in memory and sends back a unique session ID stored inside an HTTP cookie named `connect.sid`. We set `httpOnly: true` on the cookie so client-side JavaScript cannot access or steal it via XSS. On subsequent requests, the browser sends this cookie, and our `requireAdminAuth` middleware checks `req.session.adminUser` before granting access."*

#### Q3: "What is a database transaction and why did you use it during food creation?"
* **Your Answer:** *"A transaction is a unit of work that ensures ACID properties (Atomicity, Consistency, Isolation, Durability). Adding a food requires inserting into `foods`, and then inserting multiple rows into `food_ingredients`, `food_seasons`, and `food_references`. If we wrap this in `BEGIN IMMEDIATE ... COMMIT`, any error during the child insertions triggers a `ROLLBACK`, guaranteeing that incomplete or corrupted partial data is never saved."*

#### Q4: "What happens when an administrator deletes a food record?"
* **Your Answer:** *"Because our junction tables (`food_ingredients`, `food_seasons`, `food_references`) define foreign keys with `ON DELETE CASCADE`, deleting a food from the `foods` table causes SQLite to automatically delete all associated rows in the junction tables. This prevents orphaned records and preserves referential integrity."*

#### Q5: "How did you test your application?"
* **Your Answer:** *"I performed both manual testing (32 test cases documented in `docs/testing.md`) and authored an automated integration test script in `test-system.js`. The automated script tests 43 assertions across 23 scenarios—verifying HTTP response status codes, JSON response formats, authentication guards, search queries, filter combinations, and full transactional CRUD lifecycles."*
