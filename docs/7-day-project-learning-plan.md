# Bharat Bhojan – 7-Day Project Mastery Learning Plan

A practical, day-by-day self-study plan tailored for a BCA 5th-semester student. By spending 1.5 to 2 hours each day following this roadmap, you will thoroughly understand every aspect of the project and speak with complete authority during your viva.

---

## Roadmap at a Glance

| Day | Focus Area | Core Knowledge Acquired | Primary Files to Study |
| :---: | :--- | :--- | :--- |
| **Day 1** | Project Scope & Setup | Purpose, IKS context, local installation, running tests | `README.md`, `package.json`, `test-system.js` |
| **Day 2** | Database Architecture | Relational design, 11 tables, 3NF, keys, junction tables | `database/schema.sql`, `database/seed.js` |
| **Day 3** | Backend & REST APIs | Node.js, Express, routing, parameterized SQL, controllers | `server.js`, `routes/`, `controllers/foodsController.js` |
| **Day 4** | Frontend & UI Styling | Semantic HTML5, CSS variables, Flexbox, responsive grid | `public/index.html`, `public/css/style.css` |
| **Day 5** | Vanilla JavaScript | DOM manipulation, Fetch API, debouncing, XSS protection | `public/js/explore.js`, `public/js/food.js` |
| **Day 6** | Admin Portal & Security | Authentication, bcrypt, sessions, route guards, CRUD | `middleware/auth.js`, `controllers/adminController.js` |
| **Day 7** | Viva Rehearsal & Testing | Elevator pitches, rapid-fire Q&A, demo walk-through | `docs/viva-survival.md`, `docs/viva-notes.md` |

---

## Day 1: Project Overview & Local Execution

### Objectives
- Understand what problem Bharat Bhojan solves.
- Learn why it is an academic information system, not just a recipe blog.
- Understand the Indian Knowledge Systems (IKS) theme.
- Run the application locally and execute the automated test suite.

### Tasks
1. Read `README.md` completely.
2. Open terminal in the project folder and run:
   ```bash
   node server.js
   ```
3. Open `http://localhost:3000` in your web browser. Click through all pages: Home, Explore Foods, Regions, Seasonal, About, References, and Admin Login.
4. Open a second terminal and run the test suite:
   ```bash
   node test-system.js
   ```
   Verify that all 43 tests pass.

### Viva Self-Check Questions
- *What is Academic Project #25 about?*
- *What does IKS stand for, and how does Bharat Bhojan reflect it?*
- *Why is the project named Bharat Bhojan?*

---

## Day 2: Database Design & Normalization

### Objectives
- Understand why SQLite was chosen.
- Memorize the 11 tables and their roles.
- Understand First, Second, and Third Normal Form (1NF, 2NF, 3NF).
- Understand why junction tables resolve Many-to-Many relationships.

### Tasks
1. Study `docs/database-viva.md`.
2. Inspect `database/schema.sql` line by line.
3. Identify the primary keys and foreign keys in every table.
4. Trace why `food_ingredients` has a composite primary key `(food_id, ingredient_id)`.
5. Open `config/database.js` to see how `DatabaseSync` connects to `bharat_bhojan.db`.

### Hands-on Exercise
Run a small Node one-liner in the terminal to inspect the database:
```bash
node -e "const { getDb } = require('./config/database'); console.table(getDb().prepare('SELECT id, name, slug FROM foods LIMIT 5').all());"
```

### Viva Self-Check Questions
- *Why did you normalize the database into 11 tables?*
- *What is the difference between `ON DELETE CASCADE` and `ON DELETE RESTRICT`?*
- *Why is `references_tbl` named with `_tbl`?* (Answer: `REFERENCES` is an SQL keyword).

---

## Day 3: Backend & REST API Design

### Objectives
- Understand how Node.js and Express handle HTTP requests.
- Learn the Model-View-Controller (MVC) architecture.
- Understand how parameterized SQL queries prevent SQL injection.

### Tasks
1. Open `server.js` and trace how Express initializes and mounts routers.
2. Read `routes/foods.js` to see public URL mappings.
3. Read `controllers/foodsController.js`:
   - Study `getFoods()` to see how dynamic `WHERE` clauses are constructed.
   - Study `getFoodBySlug()` to see how detail records, ingredients, and seasons are joined.
4. Study `middleware/errorHandler.js` to understand centralized error handling.

### Hands-on Exercise
Test an API endpoint directly using your browser:
- Open: `http://localhost:3000/api/foods/litti-chokha`
- Observe the structured JSON response containing the dish attributes, ingredients array, seasons, and citations.

### Viva Self-Check Questions
- *What is MVC and how is it structured in your project?*
- *How do you prevent SQL injection when searching?*
- *Why do we use HTTP GET for search and HTTP POST for admin login?*

---

## Day 4: Frontend Structure & CSS Styling

### Objectives
- Understand semantic HTML5 structure.
- Understand CSS custom properties (variables) for consistent theming.
- Understand responsive design using CSS Flexbox and CSS Grid without frameworks.

### Tasks
1. Open `public/index.html` and inspect semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
2. Open `public/css/style.css` and study the `:root` block to see how color tokens (`--primary`, `--accent-terracotta`, `--bg-cream`) create a warm Indian aesthetic.
3. Study `public/css/responsive.css` to see mobile breakpoints (`@media (max-width: 768px)` and `360px`).
4. In your browser, open Developer Tools (F12) and toggle device simulation (iPhone/Pixel) to verify responsiveness.

### Viva Self-Check Questions
- *Why did you avoid Bootstrap or Tailwind CSS?*
- *What are CSS Custom Properties and why are they useful?*
- *What is the difference between CSS Flexbox and CSS Grid?*

---

## Day 5: Client-Side Vanilla JavaScript

### Objectives
- Master asynchronous JavaScript: `async/await` and the `fetch()` API.
- Understand debouncing in search inputs.
- Understand how `escapeHtml()` prevents Cross-Site Scripting (XSS).

### Tasks
1. Read `public/js/explore.js`:
   - Trace `applyFiltersAndSearch()`: how it reads dropdown values, calls `buildQueryString()`, and fetches data.
   - Trace the 300ms debounce timer on `#searchInput`.
2. Read `public/js/food.js`:
   - Trace how `URLSearchParams` retrieves `?slug=litti-chokha`.
   - Trace how HTML cards are created dynamically with template literals.
3. Open `public/js/main.js` and examine `escapeHtml()`.

### Viva Self-Check Questions
- *What is debouncing and what problem does it solve?*
- *How does `escapeHtml()` protect against XSS attacks?*
- *What does `URLSearchParams` do?*

---

## Day 6: Admin Authentication & Full CRUD Operations

### Objectives
- Understand session-based authentication vs token-based authentication.
- Understand password hashing with bcrypt.
- Trace the complete Create, Read, Update, Delete (CRUD) lifecycle.

### Tasks
1. Read `middleware/auth.js` to understand how `requireAdminAuth` guards routes.
2. Read `controllers/adminController.js`:
   - `login()`: bcrypt password verification and session initialization.
   - `createFood()` & `updateFood()`: multi-table insertions wrapped in transactions.
   - `deleteFood()`: deletion and cascading.
3. Log into the admin portal at `http://localhost:3000/admin/login.html` (credentials in `README.md`).
4. Test adding a test food record, editing it, and deleting it.

### Viva Self-Check Questions
- *Why do we use bcrypt instead of MD5 or SHA256 for passwords?*
- *What is a session cookie and what does `httpOnly: true` mean?*
- *Why are admin CRUD operations wrapped in database transactions?*

---

## Day 7: Final Viva Preparation & Mock Rehearsal

### Objectives
- Practice your 30-second, 1-minute, and 2-minute elevator pitches aloud.
- Review all 20 questions in `docs/viva-survival.md`.
- Practice demonstrating the live application smoothly.

### Checklist
- [ ] Practice speaking the 1-minute elevator pitch without pausing.
- [ ] Demonstrate searching for `"Litti Chokha"` on Explore Foods.
- [ ] Demonstrate filtering by Region: *"South India"* and Season: *"Summer"*.
- [ ] Open a dish detail page and explain the ingredients, preparation, and references.
- [ ] Log into the Admin Portal, show the live statistics dashboard, and open the Add Food form.
- [ ] Explain the database schema using `docs/database-viva.md`.
- [ ] Answer 5 random questions from `docs/viva-survival.md` without looking at the notes.

**You are now fully prepared to score top marks in your project viva!**
