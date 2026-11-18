# Bharat Bhojan – Code Study Guide (Top 15 Files)

A structured, file-by-file revision guide designed to help a BCA student walk through and confidently explain the 15 most important files in the codebase during viva examinations.

---

## 1. `server.js`
* **Path:** `server.js`
* **Purpose:** The central entry point of the Node.js/Express backend; configures middleware, session security, static folder hosting, API routing, and starts the HTTP server.
* **Key Functions/Variables:** `app.use()`, `express.static()`, `session()`, `app.listen()`.
* **Important Logic Breakdown:**
  * Lines 15-26: Initializes `express-session` with a 2-hour cookie lifetime and `httpOnly: true` to prevent client-side JavaScript from accessing session cookies.
  * Lines 36-39: Mounts API routers (`/api/foods`, `/api/metadata`, `/api/admin`).
  * Lines 48-60: Centralized 404 handler distinguishing between API requests (returns JSON) and browser navigation (serves `public/404.html`).
* **Sample Viva Question:** *"What is the purpose of `express.static` in `server.js`?"*
  * **Answer:** *"It serves client-side static files—HTML documents, CSS stylesheets, client JavaScript files, and SVG images—directly to the browser without requiring individual route handlers for every file."*

---

## 2. `config/database.js`
* **Path:** `config/database.js`
* **Purpose:** Establishes and manages the SQLite database connection using Node's built-in `node:sqlite` module, providing utility wrappers for executing queries, fetching rows, and running ACID transactions.
* **Key Functions:** `getDb()`, `queryAll()`, `queryOne()`, `execute()`, `transaction()`.
* **Important Logic Breakdown:**
  * Uses `new DatabaseSync(dbPath)`: Node.js 22+ native SQLite driver that runs synchronously without external C++ compilation dependencies (`node-gyp`).
  * `queryAll(sql, params)` prepares a statement and calls `.all(...params)` to return an array of matching rows.
  * `transaction(fn)` wraps database mutations between `BEGIN IMMEDIATE` and `COMMIT`, executing `ROLLBACK` if an error is thrown.
* **Sample Viva Question:** *"Why did you wrap operations in `BEGIN IMMEDIATE` and `COMMIT`?"*
  * **Answer:** *"To ensure transaction atomicity. If a complex operation like adding a food and its 5 ingredients fails halfway through, `ROLLBACK` restores the database to its previous consistent state, preventing orphaned records."*

---

## 3. `database/schema.sql`
* **Path:** `database/schema.sql`
* **Purpose:** Defines the complete relational database structure using ANSI SQL Data Definition Language (DDL), specifying tables, column types, primary keys, foreign key constraints, checks, and B-Tree indexes.
* **Key Components:** 11 normalized tables, `PRAGMA foreign_keys = ON`, `ON DELETE CASCADE` on junction tables, B-Tree indexes on `slug` and foreign keys.
* **Important Logic Breakdown:**
  * `PRAGMA foreign_keys = ON`: SQLite disables foreign key enforcement by default; this command ensures referential integrity checks are active.
  * `slug TEXT NOT NULL UNIQUE`: Guarantees human-readable URLs are strictly unique across all food records.
* **Sample Viva Question:** *"Why are junction tables like `food_ingredients` given a composite primary key `(food_id, ingredient_id)`?"*
  * **Answer:** *"A composite primary key guarantees that a specific ingredient cannot be linked to the same food twice, preventing duplicate ingredient rows while uniquely identifying each link."*

---

## 4. `database/seed.js`
* **Path:** `database/seed.js`
* **Purpose:** Automated seeding script that executes `schema.sql`, clears old data, resets sequence counters, and inserts 37 traditional dishes, 12 verified references, 25 states, 6 regions, 9 categories, 6 seasons, and default admin credentials.
* **Key Logic:** Reads schema, resets tables with foreign keys temporarily disabled, and wraps the insertion of 37 food records and relational links inside an atomic transaction.
* **Sample Viva Question:** *"Why do you disable foreign keys during data deletion in `seed.js`?"*
  * **Answer:** *"Disabling foreign keys before truncating allows clearing tables without violating foreign key constraints, and re-enabling them immediately afterwards ensures full integrity enforcement during seeding."*

---

## 5. `routes/foods.js`
* **Path:** `routes/foods.js`
* **Purpose:** Defines public REST API endpoints for food retrieval, search, featured dishes, and individual food details by slug.
* **Key Routes:**
  * `GET /api/foods`: Multi-criteria filter query.
  * `GET /api/foods/search`: Full-text keyword search.
  * `GET /api/foods/featured`: Curated homepage showcase.
  * `GET /api/foods/:slug`: Comprehensive detail record by URL slug.
* **Sample Viva Question:** *"Why is `/featured` defined before `/:slug` in the router?"*
  * **Answer:** *"Express matches routes in top-down sequential order. If `/:slug` were placed first, Express would treat the string 'featured' as a dynamic `:slug` parameter rather than calling the dedicated featured route handler."*

---

## 6. `routes/admin.js`
* **Path:** `routes/admin.js`
* **Purpose:** Declares administrative API routes for login, logout, authentication status checks, dashboard metrics, and CRUD operations on food records.
* **Key Routes:** `POST /login`, `POST /logout`, `GET /dashboard`, `POST /foods`, `PUT /foods/:id`, `DELETE /foods/:id`.
* **Important Logic:** Protected routes apply the `requireAdminAuth` middleware before invoking controller handlers.
* **Sample Viva Question:** *"What HTTP methods are used for CRUD operations?"*
  * **Answer:** *"Create uses `POST`, Read uses `GET`, Update uses `PUT`, and Delete uses `DELETE`. This follows standard RESTful API conventions."*

---

## 7. `controllers/foodsController.js`
* **Path:** `controllers/foodsController.js`
* **Purpose:** Implements business logic for public food queries, building dynamic SQL statements for filtering, executing search queries, and formatting detail envelopes.
* **Key Functions:** `getFoods()`, `searchFoods()`, `getFoodBySlug()`, `getFeaturedFoods()`.
* **Important Logic Breakdown:**
  * In `getFoods()`, dynamic `WHERE` clauses are pushed into an array (`conditions.push('f.state_id = ?')`), and values are pushed into a `params` array. This builds flexible SQL safely without string interpolation.
  * In `getFoodBySlug()`, the controller executes 4 fast queries: fetching the food record, its ingredients, its seasons, its references, and finding related dishes in the same region.
* **Sample Viva Question:** *"How does `getFoodBySlug` avoid SQL injection?"*
  * **Answer:** *"It uses prepared statements with parameter placeholders (`?`). The slug parameter is passed directly to `.get(slug)`, ensuring SQLite treats it strictly as a string value rather than executable SQL."*

---

## 8. `controllers/adminController.js`
* **Path:** `controllers/adminController.js`
* **Purpose:** Handles administrative operations: authenticating users, managing sessions, computing dashboard summary metrics, and executing transactional CRUD operations.
* **Key Functions:** `login()`, `logout()`, `getDashboard()`, `createFood()`, `updateFood()`, `deleteFood()`.
* **Important Logic Breakdown:**
  * `login()`: Fetches admin by username, compares password using `bcrypt.compareSync()`, and sets `req.session.adminUser`.
  * `createFood()` & `updateFood()`: Wrapped in `transaction()`. Inserts/updates `foods` row and synchronizes `food_ingredients`, `food_seasons`, and `food_references`.
* **Sample Viva Question:** *"How does password verification work in `login()`?"*
  * **Answer:** *"The stored hash contains the salt and algorithm parameters. `bcrypt.compareSync(plainPassword, passwordHash)` extracts the salt, hashes the incoming plain password with it, and compares the resulting hash in constant time."*

---

## 9. `controllers/metadataController.js`
* **Path:** `controllers/metadataController.js`
* **Purpose:** Supplies master lookup data for frontend dropdown filters and admin forms.
* **Key Functions:** `getStates()`, `getRegions()`, `getCategories()`, `getSeasons()`, `getReferences()`.
* **Sample Viva Question:** *"Why are metadata lookups handled through separate API endpoints?"*
  * **Answer:** *"Decoupling metadata from food queries allows the frontend to populate dropdown menus (State, Region, Category) once, without downloading redundant lookup data in every food request."*

---

## 10. `middleware/auth.js`
* **Path:** `middleware/auth.js`
* **Purpose:** Route protection guard that checks for an active administrative session.
* **Key Function:** `requireAdminAuth(req, res, next)`.
* **Logic Breakdown:**
  * Checks `if (req.session && req.session.adminUser) { return next(); }`.
  * If the request is for an API endpoint (`req.originalUrl.startsWith('/api/')`), returns HTTP 401 Unauthorized JSON: `{ success: false, message: 'Unauthorized...' }`.
  * If the request is for an HTML page, redirects the browser via `res.redirect('/admin/login.html')`.
* **Sample Viva Question:** *"Why does the middleware check whether the URL starts with `/api/`?"*
  * **Answer:** *"Because API clients expect structured JSON error codes (HTTP 401) to handle programmatically, whereas human browser visitors requesting a page should be redirected to the login screen."*

---

## 11. `middleware/errorHandler.js`
* **Path:** `middleware/errorHandler.js`
* **Purpose:** Centralized Express error handler catching unhandled application exceptions.
* **Key Function:** `errorHandler(err, req, res, next)`.
* **Logic Breakdown:** Takes four arguments `(err, req, res, next)`, which informs Express that this is an error-handling middleware. Logs error details to the server console and sends a clean HTTP 500 JSON response without exposing internal stack traces.
* **Sample Viva Question:** *"How does Express identify a middleware as an error handler?"*
  * **Answer:** *"Express examines function arity (the number of arguments). A middleware with exactly 4 parameters `(err, req, res, next)` is treated as an error-handling middleware."*

---

## 12. `public/js/explore.js`
* **Path:** `public/js/explore.js`
* **Purpose:** Powers the Explore Foods catalog: manages dropdown filters (State, Region, Season, Category, Diet, Sort), implements 300ms debounced live search, and updates the responsive card grid.
* **Key Functions:** `loadFilterOptions()`, `applyFiltersAndSearch()`, `renderFoods()`, `buildQueryString()`.
* **Sample Viva Question:** *"What is debouncing and why did you implement it in `explore.js`?"*
  * **Answer:** *"Debouncing postpones function execution until a specified delay (300ms) has elapsed since the last event. It prevents firing a network request on every keystroke, reducing server load and avoiding race conditions."*

---

## 13. `public/js/food.js`
* **Path:** `public/js/food.js`
* **Purpose:** Client-side script for the dish detail view (`food.html`). Fetches dish details by URL slug, sanitizes content, and renders cultural context, preparation steps, ingredients, references, and related regional dishes.
* **Key Logic:** Reads `new URLSearchParams(window.location.search).get('slug')`, fetches `/api/foods/:slug`, and conditionally renders festival or serving sections only if non-empty.
* **Sample Viva Question:** *"How does `food.js` know which dish to display?"*
  * **Answer:** *"It extracts the `slug` query parameter from the browser URL using the JavaScript `URLSearchParams` API and passes it to the `/api/foods/:slug` endpoint."*

---

## 14. `admin/admin.js`
* **Path:** `admin/admin.js`
* **Purpose:** Client-side script powering the administrative portal: handles AJAX login, loads dashboard summary metrics, populates the food management table, manages dynamic ingredient rows, and executes delete confirmations.
* **Key Functions:** `handleLogin()`, `loadDashboard()`, `loadFoodForm()`, `saveFood()`, `deleteFood()`.
* **Sample Viva Question:** *"How does the admin script handle adding multiple ingredients dynamically?"*
  * **Answer:** *"It uses DOM manipulation. Clicking 'Add Ingredient' creates and appends a new row of input fields to `#ingredientsContainer`. On form submission, the script loops through these rows, collects the values into an array of objects, and sends them as JSON."*

---

## 15. `test-system.js`
* **Path:** `test-system.js`
* **Purpose:** End-to-end automated integration testing suite verifying all 43 assertions across 23 testing scenarios.
* **Key Verification Scenarios:** HTML route availability, API health, multi-criteria filtering, search matching, slug lookups, 401 route guards, login session establishment, and complete transactional CRUD lifecycle (POST, PUT, DELETE with cascade validation).
* **Sample Viva Question:** *"How did you verify that deleting a food cleans up junction tables?"*
  * **Answer:** *"In `test-system.js`, after creating a test dish with ingredients and seasons, the script deletes it via `DELETE /api/admin/foods/:id` and verifies that requesting the slug returns HTTP 404, confirming SQLite cascaded the deletion across junction tables."*
