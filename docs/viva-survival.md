# Bharat Bhojan – Viva Survival Guide

A rapid-fire, high-yield preparation guide designed specifically for a BCA 5th-semester student facing an external examiner or project viva.

---

## 1. Project Elevator Pitches

### 30-Second Elevator Pitch
> *"Good morning, Sir/Madam. My project is **Bharat Bhojan – Traditional Indian Food Knowledge Information System** (Academic Project #25). It is a full-stack, database-driven web application built with HTML, CSS, Vanilla JavaScript, Node.js, Express, and a normalized SQLite relational database. Unlike generic recipe websites, it systematically catalogs regional food heritage, indigenous ingredients, seasonal (Ritu) adaptations, and cultural context across 25 Indian states and 6 geographical zones with full administrative CRUD management."*

### 1-Minute Elevator Pitch
> *"Good morning, Sir/Madam. My project is **Bharat Bhojan – Traditional Indian Food Knowledge Information System**. In today's fast-paced environment, traditional culinary wisdom, ancient preservation methods, and seasonal eating practices are rapidly fading into unindexed oral traditions. 
> 
> To address this, I built an educational information portal adhering to the Indian Knowledge Systems (IKS) theme. The system demonstrates core computer science competencies: a normalized 3NF relational database with 11 tables handling many-to-many relationships, RESTful API endpoints for multi-criteria filtering and debounced search, responsive frontend interfaces without heavy third-party frameworks, and a secure session-authenticated administrative dashboard supporting complete transactional CRUD operations. All 37 food records are cross-referenced with 12 credible academic, governmental, and historical sources."*

### 2-Minute Comprehensive Pitch
> *"Good morning, Sir/Madam. My project is **Bharat Bhojan – Traditional Indian Food Knowledge Information System**, developed for BCA 5th Semester.
> 
> **Problem Statement:** Most commercial culinary platforms focus solely on rapid step-by-step cooking instructions and commercial monetization, overlooking indigenous ingredient roots, agro-climatic seasonality, and community rituals. Traditional Indian food knowledge is rooted in empirical observation—such as balancing diets across six seasons (Shad-Ritu) and utilizing fermentation, ash filtration, and earthen baking.
> 
> **System Architecture:** I designed the system following a clean Model-View-Controller (MVC) pattern:
> 1. **Database Layer:** Uses SQLite with Node's native `DatabaseSync` engine. The schema contains 11 normalized tables with primary keys, foreign key constraints (`ON DELETE CASCADE`), indexes on search slugs, and junction tables for many-to-many relationships between foods, ingredients, seasons, and references.
> 2. **Backend API:** Built with Node.js and Express. It provides clean REST endpoints for live search, multi-criteria filtering by state, region, category, diet, and season, as well as session-guarded admin routes protected by bcrypt password hashing.
> 3. **Frontend Layer:** Implemented using semantic HTML5, custom CSS with CSS custom properties (responsive down to 360px), and modular Vanilla JavaScript using the Fetch API and DOM manipulation. I deliberately avoided frameworks like React or Bootstrap to demonstrate solid web fundamentals.
> 4. **Data Credibility:** The database features 37 curated dishes across all 6 Indian regions, including deep documentation of Bihar's heritage (8 dishes like Litti Chokha, Thekua, Mithila Makhana Kheer, and Silao Khaja). Every entry cites credible academic books and government gazettes.
> 
> The application has been verified through an automated 43-assertion test suite and runs entirely locally without paid cloud dependencies."*

---

## 2. Top 20 Rapid Viva Questions & Crisp Answers

#### Q1: What is the primary objective of your project?
**Answer:** The primary objective is to create a structured, database-driven information portal that documents traditional Indian regional dishes, indigenous ingredients, seasonal (Ritu) adaptations, preparation traditions, and cultural contexts, rather than just modern recipes.

#### Q2: What technology stack did you use and why?
**Answer:** I used semantic HTML5, CSS3, and Vanilla JavaScript on the frontend, Node.js and Express.js on the backend, and SQLite for the relational database. I chose this stack to demonstrate core web fundamentals and database normalization without depending on heavy third-party abstractions like React or Bootstrap.

#### Q3: Why did you choose SQLite instead of MySQL or MongoDB?
**Answer:** SQLite is a serverless, zero-configuration relational database stored directly in a local file (`bharat_bhojan.db`), making it ideal for self-contained academic demonstrations. However, because our schema is fully normalized ANSI SQL, I have also provided a `mysql-schema.sql` script that can be imported directly into MySQL with identical tables and keys.

#### Q4: How is your database normalized?
**Answer:** The database adheres to Third Normal Form (3NF). Repeating groups are eliminated into separate tables (1NF), all non-key columns depend on the primary key (2NF), and transitive dependencies are eliminated by separating states, regions, and categories into lookup tables (3NF).

#### Q5: How do you handle Many-to-Many relationships in your database?
**Answer:** Many-to-Many relationships are implemented using intermediate junction tables with composite primary keys and foreign keys. Specifically: `food_ingredients` connects foods and ingredients, `food_seasons` connects foods and seasons, and `food_references` connects foods and bibliographic references.

#### Q6: What happens to junction table records when a food is deleted?
**Answer:** In our SQLite schema, foreign keys are defined with `ON DELETE CASCADE`. When an administrator deletes a food record, SQLite automatically removes all associated entries in `food_ingredients`, `food_seasons`, and `food_references`, preventing orphaned records.

#### Q7: How does your search feature work?
**Answer:** On the frontend, a JavaScript `input` event triggers an asynchronous `fetch()` call with a 300ms debounce timer to prevent excessive API requests. On the backend, the SQL query uses `LIKE %term%` across dish names, native names, short descriptions, and joined ingredients.

#### Q8: What is the difference between client-side filtering and server-side filtering?
**Answer:** Client-side filtering fetches all records once and filters them in browser memory using JavaScript arrays, which works well for small datasets. Server-side filtering sends filter parameters (such as `?state=Bihar&season=Winter`) as query strings to the backend, which constructs a parameterized SQL query and returns only matching records from the database. Bharat Bhojan implements server-side filtering.

#### Q9: How is administrator authentication implemented?
**Answer:** Authentication uses `express-session` with server-side memory storage and HTTP cookies (`connect.sid`). Passwords are never stored in plain text; they are salted and hashed using `bcryptjs` with 10 salt rounds before storage in the `admins` table.

#### Q10: How do you protect administrative routes from unauthorized access?
**Answer:** I created custom Express middleware named `requireAdminAuth` in `middleware/auth.js`. For API endpoints, it inspects `req.session.adminUser` and returns an HTTP 401 Unauthorized JSON error if the session is absent; for administrative HTML pages, it redirects the browser to `/admin/login.html`.

#### Q11: What is a database transaction and where did you use it?
**Answer:** A transaction is a unit of work that guarantees Atomicity, Consistency, Isolation, and Durability (ACID). If any single statement fails, the entire transaction rolls back. I used transactions in `database/seed.js` and in `createFood()` / `updateFood()` in `adminController.js` to ensure that inserting a food and its multiple ingredients and seasons succeeds or fails together.

#### Q12: How do you prevent SQL Injection in your backend?
**Answer:** I strictly avoid string concatenation in SQL queries. All SQL statements use parameterized prepared statements (`prepare('SELECT * FROM foods WHERE id = ?')`) with values passed as separate parameters (`.get(id)` or `.all(id)`), ensuring user input is treated strictly as data and never executable code.

#### Q13: How do you prevent Cross-Site Scripting (XSS) on the frontend?
**Answer:** In our Vanilla JavaScript files, all dynamic text injected into HTML elements is processed through an `escapeHtml()` utility function that converts special characters like `<`, `>`, `&`, `"`, and `'` into safe HTML character entities before inserting them into innerHTML.

#### Q14: What is the Indian Knowledge Systems (IKS) foundation in your project?
**Answer:** Bharat Bhojan models three pillars of IKS: (1) *Ritu-Charya* (seasonal dietary discipline matching the six traditional Indian seasons), (2) *Indigenous Food Processing* (natural wild fermentation, alkaline filtering using banana-ash, and earthen oven baking), and (3) *Agro-Ecological Alignment* (drought-hardy millets, sattu, and local wild greens).

#### Q15: Why are there no health or medical claims in your system?
**Answer:** To maintain academic integrity and safety, the system explicitly avoids medical or therapeutic claims like "cures disease" or "boosts immunity." The portal documents cultural traditions, historical consumption patterns, and culinary practices without masquerading as health advice.

#### Q16: How did you ensure data quality and avoid fake references?
**Answer:** I avoided anonymous recipe blogs and AI-generated citations. Every food is linked to real, verifiable sources: Oxford University Press monographs by food historian K.T. Achaya, Government Geographical Indications (GI) gazettes, and state tourism and cultural department archives.

#### Q17: What is the purpose of the slug column in the foods table?
**Answer:** A slug (such as `litti-chokha`) is a URL-friendly, human-readable string composed of lowercase letters and hyphens. It replaces numeric IDs in URLs (e.g., `/food.html?slug=litti-chokha` instead of `?id=1`), making URLs user-friendly, descriptive, and search-engine optimized.

#### Q18: What is the MVC architectural pattern and how is it used here?
**Answer:** MVC stands for Model-View-Controller. In our application:
- **Model:** SQLite database and SQL queries in `config/database.js`.
- **View:** HTML pages and CSS/JS in `public/` and `admin/`.
- **Controller:** Request handlers in `controllers/foodsController.js` and `controllers/adminController.js` that receive HTTP requests, query the model, and return JSON responses.

#### Q19: How did you test your application?
**Answer:** I created an automated end-to-end integration test suite in `test-system.js`. It executes 43 automated assertions covering static HTML routes, search queries, multi-criteria filters, detail views, authentication route guards, session creation, CRUD lifecycle (Create, Read, Update, Delete with cascade verification), and centralized error handling.

#### Q20: What are the main limitations of your project?
**Answer:** It is a curated academic prototype containing 37 representative dishes rather than an exhaustive encyclopedia. It runs with an in-memory session store rather than Redis, and uses local SVG illustrations rather than user-uploaded images. These architectural choices keep the project simple, understandable, and completely local.

---

## 3. How to Handle Tricky Viva Scenarios

### Scenario A: If an examiner asks why you didn't use React / Redux / Next.js
> *"Sir/Madam, frameworks like React and Next.js add significant build-tool complexity and abstraction layers. For this BCA semester project, my goal was to demonstrate mastery of core foundational concepts—DOM manipulation, the Fetch API, asynchronous JavaScript, CSS Flexbox/Grid, and raw SQL queries. Understanding the fundamentals makes learning frameworks trivial later."*

### Scenario B: If an examiner asks why you didn't use MongoDB (NoSQL)
> *"Sir/Madam, traditional food knowledge is inherently relational: a region contains many states; a state has many foods; and foods share common ingredients, seasons, and citations. A relational database with foreign keys and junction tables enforces referential integrity and eliminates data redundancy through normalization, which is difficult to guarantee in a document-based NoSQL database."*

### Scenario C: If you don't know the exact answer to a technical question
> *"Sir/Madam, I am not completely certain of that specific internal detail right now, but conceptually it relates to [mention related concept, e.g., how the Node.js event loop handles I/O or how SQLite manages locks]. I will study the documentation to clarify that point."*
*(Examiners respect honesty and conceptual grounding much more than guessing!)*

### Scenario D: If asked how the system would scale to 100,000 foods and 50,000 concurrent users
> *"Sir/Madam, for high concurrent production loads, I would implement three changes:
> 1. Migrate the database from SQLite to PostgreSQL with read replicas and full-text search indexes (`tsvector`).
> 2. Move sessions from single-process memory to a distributed Redis cache.
> 3. Implement server-side pagination with limit/offset queries to avoid sending large payloads over the network."*
