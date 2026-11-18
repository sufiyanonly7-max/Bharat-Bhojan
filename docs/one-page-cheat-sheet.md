# Bharat Bhojan – 1-Page Viva Cheat Sheet

*Read this on the morning of your viva examination for instant recall!*

---

## 1. Project At a Glance
* **Project Title:** Bharat Bhojan – Traditional Indian Food Knowledge Information System (Project #25).
* **Problem:** Traditional Indian culinary knowledge, seasonal eating (*Ritu-Charya*), and indigenous food science are scattered across oral traditions and unindexed blogs without structured categorization.
* **Objective:** Design and build an educational, database-driven information system documenting 37 traditional regional dishes, ingredients, seasonality, preparation methods, and cultural stories across 25 states and 6 Indian zones.
* **Frontend:** Semantic HTML5, CSS3 (CSS Variables, Flexbox, Grid, Responsive down to 360px), and Vanilla JavaScript (Fetch API, DOM manipulation, no React/Tailwind).
* **Backend:** Node.js runtime and Express.js REST API using MVC architecture.
* **Database:** SQLite relational database via built-in `node:sqlite` (`DatabaseSync`), 100% local in `bharat_bhojan.db` (MySQL schema script in `docs/mysql-schema.sql`).

---

## 2. Core Database Tables (11 Tables in 3NF)
1. **Master Tables (1:M):** `regions` (6 zones), `states` (25 states), `categories` (9 categories), `seasons` (6 Ritus + Year-round), `ingredients` (165 unique pantry items), `references_tbl` (12 verified citations).
2. **Central Table:** `foods` (37 dishes, unique URL `slug`, cultural notes, preparation, dietary flag).
3. **Junction Tables (M:N with Composite PKs & `ON DELETE CASCADE`):** `food_ingredients`, `food_seasons`, `food_references`.
4. **Security Table:** `admins` (username, salted bcrypt password hash).

---

## 3. Important Data Flows
* **Search Flow:** User types in `#searchInput` → 300ms **debounce timer** pauses → `fetch('/api/foods/search?q=...')` → Express router → `foodsController.js` → Parameterized SQL with `LIKE ?` → SQLite queries indexed table + joined ingredients → JSON returned → `escapeHtml()` sanitizes strings → JavaScript renders `<article class="food-card">` into `#foodsGrid`.
* **Admin Flow:** Admin submits login → `bcrypt.compareSync()` verifies hash → Server issues session cookie (`connect.sid`, `httpOnly: true`) → `requireAdminAuth` middleware guards `/api/admin/*` routes → CRUD operations wrapped in SQL **transactions** (`BEGIN IMMEDIATE ... COMMIT`).

---

## 4. Key Security Measures
1. **No Plaintext Passwords:** Salted hashing with `bcryptjs` (10 rounds).
2. **SQL Injection Prevention:** 100% parameterized prepared statements (`?` placeholders).
3. **XSS Prevention:** Client-side sanitization using `escapeHtml()`.
4. **Cookie Protection:** `httpOnly: true` prevents JavaScript cookie theft.

---

## 5. 3 Must-Know Database Concepts
1. **Referential Integrity:** Rules enforced by Foreign Keys ensuring child rows point to valid parent rows (`ON DELETE CASCADE` cleans junction records; `ON DELETE RESTRICT` protects master tables).
2. **Third Normal Form (3NF):** A schema free from duplicate groups (1NF), partial key dependencies (2NF), and transitive dependencies (3NF).
3. **Transaction (ACID):** A bundle of SQL statements executing atomically; if one statement fails, `ROLLBACK` undoes all partial changes.

---

## 6. Honest Limitations & Future Scope
* **3 Limitations:**
  1. Curated educational prototype (37 dishes, not an exhaustive 1,000-dish encyclopedia).
  2. In-memory session store (suitable for local single-process demo; would use Redis in production).
  3. No medical or therapeutic health claims (focuses strictly on cultural history and culinary science).
* **3 Future Scope Points:**
  1. Multilingual localization (Hindi and regional Indian scripts).
  2. Interactive clickable SVG map of India.
  3. Community recipe submission portal with administrative review workflow.

---

## 7. Top 10 One-Line Viva Answers

1. **Why SQLite?** It is a zero-configuration, single-file relational database with native Node.js support and standard ANSI SQL queries.
2. **Why Vanilla JS?** To prove mastery of core web fundamentals (DOM, Fetch API, event loops) without framework abstractions.
3. **What is debouncing?** Delaying an event action (300ms) until the user stops typing, preventing excessive server API requests.
4. **What is a slug?** A URL-safe, lowercase, hyphenated string (e.g. `litti-chokha`) that replaces numeric IDs for human-friendly URLs.
5. **What is a composite primary key?** A primary key made of two or more columns (e.g. `(food_id, ingredient_id)`) to prevent duplicate relationships.
6. **What does `ON DELETE CASCADE` do?** Automatically deletes linked child records in junction tables when a parent food record is deleted.
7. **How do you prevent SQL Injection?** By using parameterized queries with `?` placeholders so user input is treated strictly as data.
8. **How does admin authentication work?** Session-based authentication using express-session and bcrypt salted password verification.
9. **What does MVC mean in your project?** Model is the SQLite database, View is the HTML/CSS/JS frontend, and Controller is the Express route handlers.
10. **What is IKS in Bharat Bhojan?** Indian Knowledge Systems—focusing on *Ritu-Charya* (seasonal eating), natural fermentation, and indigenous climate-resilient grains.
