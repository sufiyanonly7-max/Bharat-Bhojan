# How It Works – Complete Data Flow Guide
**Bharat Bhojan – Traditional Indian Food Knowledge Information System**  
*Academic Project #25 | Step-by-Step Architecture & Code Walkthrough*

---

> [!NOTE]
> This document explains the exact step-by-step technical journey of data across the entire system. Study these flows to master how your frontend, backend server, and database interact during your viva presentation.

---

## 1. Flow: User Opens Explore Foods

```text
User Browser
    │
    ▼ (1) Navigates to http://localhost:3000/explore.html
Express Server (server.js)
    │
    ▼ (2) express.static() serves explore.html, style.css, responsive.css, explore.js
Browser Execution
    │
    ▼ (3) explore.js executes on DOMContentLoaded:
          - Calls loadFilterDropdowns() -> GET /api/states, /regions, /categories, /seasons
          - Calls fetchAndRenderFoods()
    │
    ▼ (4) fetch('/api/foods')
Express Router (routes/foods.js)
    │
    ▼ (5) router.get('/', foodsController.getAllFoods)
Controller Logic (controllers/foodsController.js)
    │
    ▼ (6) Prepares SQL:
          SELECT DISTINCT f.id, f.name, f.local_name, f.slug, f.short_description,
                          f.veg_type, f.image_url, s.name AS state_name,
                          r.name AS region_name, c.name AS category_name
          FROM foods f
          JOIN states s ON f.state_id = s.id
          JOIN regions r ON f.region_id = r.id
          JOIN categories c ON f.category_id = c.id
          ORDER BY f.name ASC;
SQLite Database (database/bharat_bhojan.db via node:sqlite)
    │
    ▼ (7) Database executes query and returns array of 35 food objects
Controller Logic
    │
    ▼ (8) attachSeasons() aggregates seasons for each food; returns { success: true, count: 35, data: [...] }
Browser Execution (explore.js)
    │
    ▼ (9) JavaScript receives JSON payload:
          - Updates results counter: "Showing 35 traditional dishes"
          - Iterates array, creates HTML string via createFoodCardHtml(food)
          - Injects cards into document.getElementById('foodsGrid')
```

---

## 2. Flow: Real-Time Debounced Search

```text
User Action
    │
    ▼ (1) Types "Litti" into #searchInput
explore.js
    │
    ▼ (2) 'input' event listener fires.
          - Clears previous debounceTimer
          - Sets a new 300ms setTimeout() timer
    │
    ▼ (3) 300ms timer elapses without new keystrokes:
          - Shows loading spinner in #foodsGrid
          - Calls fetch('/api/foods/search?q=Litti')
Express Router & Controller (controllers/foodsController.js)
    │
    ▼ (4) searchFoods() runs parameterized SQL with LIKE ? and ? = '%Litti%':
          WHERE f.name LIKE ? OR f.local_name LIKE ? OR s.name LIKE ?
                OR r.name LIKE ? OR c.name LIKE ? OR f.cultural_context LIKE ?
                OR i.name LIKE ?
SQLite Engine
    │
    ▼ (5) Matches Litti Chokha; returns 1 record
Controller
    │
    ▼ (6) Sends JSON: { success: true, query: "Litti", count: 1, data: [ { name: "Litti Chokha", ... } ] }
explore.js
    │
    ▼ (7) Replaces spinner with Litti Chokha food card and updates results counter.
```

---

## 3. Flow: Multi-Criteria Filtering

```text
User Action
    │
    ▼ (1) Selects State = "Bihar" AND Season = "Winter" in dropdowns
explore.js
    │
    ▼ (2) 'change' event fires on dropdowns -> calls fetchAndRenderFoods()
    │
    ▼ (3) Calls fetch('/api/foods?state=Bihar&season=Winter')
foodsController.js
    │
    ▼ (4) Builds parameterized SQL query dynamically:
          - Starts with: SELECT DISTINCT ... FROM foods f JOIN states s ...
          - Checks season parameter: Joins food_seasons fs JOIN seasons sn
          - Appends: WHERE LOWER(sn.name) = LOWER(?) AND (LOWER(s.name) = LOWER(?) OR f.state_id = ?)
          - Parameter values: ['Winter', 'Bihar', 0]
SQLite Engine
    │
    ▼ (5) Executes query with prepared statement; returns 4 matching dishes:
          - Litti Chokha, Thekua, Dal Pittha, Gaya Tilkut
explore.js
    │
    ▼ (6) Receives 4 records; renders 4 cards and updates: "Showing 4 traditional dishes"
```

---

## 4. Flow: Viewing Food Details Page

```text
User Action
    │
    ▼ (1) Clicks "View Details →" on Litti Chokha card
Browser
    │
    ▼ (2) Navigates to http://localhost:3000/food.html?slug=litti-chokha
food.js
    │
    ▼ (3) URLSearchParams extracts slug: "litti-chokha"
    │
    ▼ (4) Calls fetch('/api/foods/litti-chokha')
foodsController.js (getFoodBySlug)
    │
    ▼ (5) Executes 4 coordinated SQL queries:
          1. Query primary food info: SELECT f.*, s.name, r.name FROM foods WHERE slug = ?
          2. Query ingredients: SELECT i.name, fi.quantity_or_note, fi.is_primary FROM food_ingredients ...
          3. Query seasons: SELECT s.name, s.description FROM food_seasons ...
          4. Query references: SELECT r.title, r.author, r.url FROM food_references ...
          5. Query related dishes: 3 random dishes from same category/region excluding current ID
    │
    ▼ (6) Combines all results into a single detailed object and returns JSON
food.js
    │
    ▼ (7) Populates:
          - Page title: "Litti Chokha | Bharat Bhojan"
          - Native script: "लिट्टी चोखा"
          - Cultural & Historical narrative block (with variation callout)
          - Traditional preparation method block
          - Key ingredients sidebar list (with "Key" badges)
          - Credible reference citations
          - Related regional dishes grid
```

---

## 5. Flow: Administrator Authentication (Login)

```text
Admin User
    │
    ▼ (1) Enters username "admin" and password "admin123" at /admin/login.html
admin.js
    │
    ▼ (2) Captures form submit; sends POST to /api/admin/login with JSON body
Express Router (routes/admin.js) -> adminController.js (login)
    │
    ▼ (3) Queries database: SELECT * FROM admins WHERE username = ? with ['admin']
    │
    ▼ (4) Compares passwords:
          bcrypt.compareSync("admin123", admin.password_hash)
    │
    ▼ (5) Match confirmed!
          req.session.adminUser = { id: 1, username: "admin" };
          Sets Set-Cookie: connect.sid=...; HttpOnly
          Returns: { success: true, message: "Authentication successful..." }
admin.js
    │
    ▼ (6) Displays success alert and redirects to /admin/dashboard.html
```

---

## 6. Flow: Adding a New Food Record (Create)

```text
Admin User
    │
    ▼ (1) Opens /admin/food-form.html, fills details, adds ingredient rows, clicks "Save Record"
admin.js
    │
    ▼ (2) Reads all inputs, builds payload JSON:
          {
            name: "Mithila Bagiya",
            local_name: "मिथिला बगिया",
            state_id: 1,
            category_id: 1,
            veg_type: "Vegetarian",
            ...
            ingredients: [ { name: "Rice Flour", quantity: "2 cups", is_primary: 1 }, ... ],
            seasons: [4],
            references: [1]
          }
    │
    ▼ (3) Sends POST /api/admin/foods with payload and session cookie
Middleware (middleware/auth.js)
    │
    ▼ (4) requireAdmin verifies req.session.adminUser exists -> passes to next()
adminController.js (createFood)
    │
    ▼ (5) Generates unique slug: "mithila-bagiya"
    │
    ▼ (6) Opens Database Transaction (transaction()):
          a. INSERT INTO foods (name, local_name, slug, state_id, ...) VALUES (...)
          b. For each ingredient:
             - INSERT OR IGNORE INTO ingredients (name)
             - INSERT INTO food_ingredients (food_id, ingredient_id, quantity, is_primary)
          c. For each season:
             - INSERT INTO food_seasons (food_id, season_id)
          d. For each reference:
             - INSERT INTO food_references (food_id, reference_id)
          e. Transaction COMMITS.
    │
    ▼ (7) Returns HTTP 201 Created: { success: true, message: "Food record created successfully." }
admin.js
    │
    ▼ (8) Displays success message and redirects to Dashboard; new dish is instantly live!
```

---

## 7. Flow: Editing an Existing Food Record (Update)

```text
Admin User
    │
    ▼ (1) Clicks "Edit" on a food in the dashboard table
Browser
    │
    ▼ (2) Loads /admin/food-form.html?id=36
admin.js
    │
    ▼ (3) Detects ?id=36 -> isEditMode = true
          Calls fetch('/api/admin/foods/36')
          Pre-populates all inputs, checks seasons, checks references, and creates ingredient rows
    │
    ▼ (4) User modifies the description and clicks "Save Changes"
adminController.js (updateFood)
    │
    ▼ (5) Wrapped in Transaction:
          - UPDATE foods SET short_description = ?, updated_at = datetime('now') WHERE id = 36
          - Synchronizes junction tables (deletes old links, inserts updated ones)
          - Transaction COMMITS
    │
    ▼ (6) Returns HTTP 200 OK: { success: true, message: "Food record #36 updated successfully." }
admin.js
    │
    ▼ (7) Redirects to Dashboard with updated record visible.
```

---

## 8. Flow: Deleting a Food Record (Delete)

```text
Admin User
    │
    ▼ (1) Clicks "Delete" button on a dish in the management table
admin.js
    │
    ▼ (2) window.confirm("Are you sure you want to permanently delete...?")
    │
    ▼ (3) User clicks "OK" -> Sends DELETE /api/admin/foods/36
Middleware
    │
    ▼ (4) requireAdmin confirms active session
adminController.js (deleteFood)
    │
    ▼ (5) Executes: DELETE FROM foods WHERE id = 36;
SQLite Foreign Key Cascades
    │
    ▼ (6) Because foreign keys in food_ingredients, food_seasons, and food_references
          have ON DELETE CASCADE, SQLite automatically removes all associated rows!
adminController.js
    │
    ▼ (7) Returns { success: true, message: "Food record was permanently deleted." }
admin.js
    │
    ▼ (8) Refreshes table; dish is gone from database and public website immediately.
```
