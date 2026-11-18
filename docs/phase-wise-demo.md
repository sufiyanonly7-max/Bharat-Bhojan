# Bharat Bhojan – Phase-Wise Demonstration & Screenshot Guide

This guide provides an exact, realistic demonstration plan for each 15-day development phase of **Bharat Bhojan**. If your faculty guide or examiner asks what was achieved in Phase 1, Phase 2, or Phase 3, follow the scripted demonstrations below.

---

## 1. Phase 1 Demonstration (First 15 Days)
*Theme: Planning, Requirements, Database Architecture & Prototype Scaffolding*

### What to Show If the Teacher Asks: *"What did you complete in the first 15 days?"*

#### Step 1: Show Project Scaffolding
* **Action:** Open the project folder in VS Code.
* **Demonstrate:** Show the organized folder structure: `config/`, `database/`, `routes/`, `controllers/`, `public/`, `admin/`, and `docs/`.
* **Explanation:**
  > *"Sir/Madam, during the first 15 days, my goal was to lay a solid architectural foundation. I initialized the Node.js project, configured `package.json` with only four essential dependencies (`express`, `dotenv`, `express-session`, `bcryptjs`), and organized the codebase using the classic MVC pattern."*

#### Step 2: Show the Relational Database Design
* **Action:** Open `database/schema.sql` in VS Code.
* **Demonstrate:** Scroll through the 11 tables. Highlight the master lookup tables (`regions`, `states`, `categories`, `seasons`, `ingredients`), the central `foods` entity, and the associative junction tables (`food_ingredients`, `food_seasons`, `food_references`).
* **Explanation:**
  > *"I designed our relational database schema in Third Normal Form (3NF). Notice how we resolved Many-to-Many relationships: instead of storing ingredients as a comma-separated text string, we have a dedicated `food_ingredients` junction table with a composite primary key `(food_id, ingredient_id)` and `ON DELETE CASCADE` rules to prevent orphaned records."*

#### Step 3: Show the SQLite Database Connection
* **Action:** Open `config/database.js`.
* **Demonstrate:** Point out `new DatabaseSync(dbPath)`.
* **Explanation:**
  > *"I configured SQLite using Node.js's built-in `node:sqlite` engine. It connects directly to our local database file without requiring external C++ compilers or third-party background database servers."*

#### Step 4: Show the Initial Web Server and Layout
* **Action:** Start the server in terminal (`node server.js`) and open `http://localhost:3000`.
* **Demonstrate:** Point out the header navigation, brand logo, hero section, and clean terracotta/turmeric color palette defined by CSS variables in `public/css/style.css`.
* **Explanation:**
  > *"By the end of Phase 1, I had a working Express server serving our semantic HTML5 landing page layout with custom CSS variables, establishing our warm Indian cultural theme."*

---

## 2. Phase 2 Demonstration (Second 15 Days)
*Theme: Core Application Development, Database Population, REST APIs, Search & Filters*

### What to Show If the Teacher Asks: *"What did you complete in the second 15 days?"*

#### Step 1: Show the Seeded Relational Database
* **Action:** Open `database/seed.js` or run a quick terminal check.
* **Demonstrate:** Show that the database contains 37 authentic dishes across 21 states, 6 regions, and 165 ingredients.
* **Explanation:**
  > *"In Phase 2, I populated the database with authentic regional dishes backed by verified sources, including 8 distinct Bihar specialties like Litti Chokha, Thekua, and Mithila Makhana Kheer."*

#### Step 2: Show Public REST APIs & Parameterized SQL
* **Action:** Open `routes/foods.js` and `controllers/foodsController.js`.
* **Demonstrate:** Show the route handlers for `/api/foods`, `/api/foods/search`, and `/api/foods/:slug`. Point to the SQL prepared statements using `?` placeholders.
* **Explanation:**
  > *"I built RESTful API endpoints for querying foods. All SQL queries use parameterized prepared statements to prevent SQL injection vulnerabilities."*

#### Step 3: Demonstrate Live Search with Debouncing
* **Action:** Open `http://localhost:3000/explore.html`. Type `"Litti"` or `"sattu"` in the search input.
* **Demonstrate:** The food cards update dynamically.
* **Explanation:**
  > *"On the Explore page, I implemented client-side debouncing with a 300ms timer. It pauses while the user is typing and only sends an API request when typing stops, preventing excessive network traffic."*

#### Step 4: Demonstrate Multi-Criteria Filtering
* **Action:** In the dropdowns, select **State:** *Bihar* and **Season:** *Winter*.
* **Demonstrate:** The grid instantly filters to 4 traditional winter dishes.
* **Explanation:**
  > *"The backend dynamically constructs a parameterized SQL query with `WHERE` clauses combining state foreign keys and season junction table joins."*

#### Step 5: Demonstrate the Food Details Page
* **Action:** Click on *Litti Chokha* (`/food.html?slug=litti-chokha`).
* **Demonstrate:** Show the native script (`लिट्टी चोखा`), cultural history, academic variation disclaimer, traditional preparation steps, key ingredients list, and citations.
* **Explanation:**
  > *"The detail view parses the URL slug using JavaScript `URLSearchParams` and calls `/api/foods/:slug`, dynamically assembling cultural context, ingredients, and references."*

#### Step 6: Show Regional & Seasonal Explorer Views
* **Action:** Click **"Regions"** (`regions.html`) and toggle between geographic zones. Click **"Seasonal Foods"** (`seasonal.html`) and toggle between *Ritu* tabs.
* **Explanation:**
  > *"I built dedicated views for exploring India's 6 geographical zones and 6 seasonal Ritus, connecting food habits with local geography and agro-climatic cycles."*

---

## 3. Phase 3 Demonstration (Final 15 Days)
*Theme: Admin Authentication, Full CRUD, Testing, Data Quality Audit & Documentation*

### What to Show If the Teacher Asks: *"What did you complete in the final 15 days?"*

#### Step 1: Demonstrate Admin Authentication & Route Protection
* **Action:** Open `http://localhost:3000/admin/login.html`.
* **Demonstrate:** Enter wrong password to show the error alert. Then enter `admin` / `admin123` to log in. Show that direct unauthenticated access to `/api/admin/dashboard` returns HTTP 401.
* **Explanation:**
  > *"In Phase 3, I implemented session-based authentication using `express-session` with secure HTTP cookies (`httpOnly: true`) and salted password hashing with `bcryptjs` (10 rounds). Passwords are never stored in plain text."*

#### Step 2: Demonstrate the Admin Dashboard & Full CRUD Lifecycle
* **Action:**
  1. On `/admin/dashboard.html`, show live metric counters and the management data table.
  2. Click **"+ Add Traditional Food"** and add a test dish with ingredients and seasons.
  3. Show the new dish appears in the table and on the public explore page.
  4. Edit the dish to update its description.
  5. Delete the dish and confirm the modal prompt.
* **Explanation:**
  > *"The admin portal supports full transactional CRUD operations. Inserting or updating multi-table records is wrapped in an atomic SQL transaction (`BEGIN IMMEDIATE ... COMMIT`). Deleting a dish automatically cascades and removes its junction table records via SQLite `ON DELETE CASCADE`."*

#### Step 3: Run the Automated End-to-End Test Suite
* **Action:** In terminal, execute:
  ```bash
  node test-system.js
  ```
* **Demonstrate:** Show that all 43 assertions across 23 test categories pass with 0 errors.
* **Explanation:**
  > *"I authored an automated end-to-end integration test suite that programmatically verifies HTML routes, public APIs, search matching, filter combinations, route protection guards, and CRUD lifecycles."*

#### Step 4: Show the Academic Documentation Suite & Submission Archive
* **Action:** Show the `docs/` folder in VS Code and highlight `one-page-cheat-sheet.md`, `database-viva.md`, `data-quality-report.md`, and the final submission ZIP `Bharat-Bhojan-BCA-Project.zip`.
* **Explanation:**
  > *"Finally, I conducted a factual audit to eliminate unsupported medical claims, finalized our comprehensive 9-chapter report outline, and packaged the clean submission archive."*

---

## 4. Recommended Screenshots for Each Phase

Use these exact screenshot recommendations when compiling your printed project report or PowerPoint presentation:

### Phase 1 Screenshots (4 Recommended Screenshots)
1. **Screenshot 1.1 – Project Directory Architecture:**  
   *View:* VS Code Explorer showing the clean root directory, `config/`, `database/`, `routes/`, `controllers/`, `public/`, and `package.json`.
2. **Screenshot 1.2 – Relational Database Schema (DDL):**  
   *View:* `database/schema.sql` opened in editor showing table declarations for `foods`, `regions`, `states`, and junction tables with foreign key constraints.
3. **Screenshot 1.3 – Local Server Startup in Terminal:**  
   *View:* Command prompt / terminal displaying the execution of `node server.js` and the server running banner on port 3000.
4. **Screenshot 1.4 – Initial Public Homepage Layout:**  
   *View:* Web browser displaying `http://localhost:3000` with the brand logo, hero title (*"Discover India's Traditional Food Knowledge"*), and warm terracotta theme.

---

### Phase 2 Screenshots (6 Recommended Screenshots)
1. **Screenshot 2.1 – Explore Foods Catalog Grid:**  
   *View:* `explore.html` displaying dish cards with dietary badges, state tags, and native Devanagari titles.
2. **Screenshot 2.2 – Real-Time Debounced Search in Action:**  
   *View:* `explore.html` with `"sattu"` typed into the search box, showing instant filtered results for *Litti Chokha* and *Sattu Ghol*.
3. **Screenshot 2.3 – Multi-Criteria Relational Filtering:**  
   *View:* `explore.html` with dropdowns set to **State:** *Bihar* and **Season:** *Winter*, showing the 4 matching seasonal dishes.
4. **Screenshot 2.4 – Comprehensive Food Details View:**  
   *View:* `food.html?slug=litti-chokha` showing the hero section, native script, cultural significance, household variations note, and key ingredients sidebar.
5. **Screenshot 2.5 – Regional Diversity Explorer:**  
   *View:* `regions.html` showing the *North-East India* or *South India* active tab with regional cultural narrative, state chips, and zone dishes.
6. **Screenshot 2.6 – Seasonal Foods & Ritu-Charya Explorer:**  
   *View:* `seasonal.html` showing the *Monsoon (Varsha)* or *Winter (Shishira)* tab with agro-climatic descriptions and season-linked dishes.

---

### Phase 3 Screenshots (6 Recommended Screenshots)
1. **Screenshot 3.1 – Administrator Sign-In Interface:**  
   *View:* `admin/login.html` showing the clean authentication form without hardcoded credentials.
2. **Screenshot 3.2 – Administrator Management Dashboard:**  
   *View:* `admin/dashboard.html` showing the summary metric cards (Total Foods, States, Regions, Categories, References) and the food records data table.
3. **Screenshot 3.3 – Dynamic Add / Edit Food Form:**  
   *View:* `admin/food-form.html` displaying input fields, multi-row dynamic ingredient controls, and seasonal checkboxes.
4. **Screenshot 3.4 – Automated Test Suite Execution:**  
   *View:* Terminal displaying `node test-system.js` output with `Verification Summary: 43 Passed, 0 Failed`.
5. **Screenshot 3.5 – Categorized Academic References Library:**  
   *View:* `public/references.html` showing the 12 verified bibliographic citations grouped into the 4 academic source categories.
6. **Screenshot 3.6 – Mobile Responsive Layout (360px Viewport):**  
   *View:* Chrome Developer Tools device simulation (iPhone / Pixel, 360px width) displaying the mobile navigation drawer toggle and fluid single-column card grid.
