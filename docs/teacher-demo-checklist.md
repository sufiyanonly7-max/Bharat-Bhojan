# Bharat Bhojan – Step-by-Step Teacher Demonstration Guide

A clear, scripted 14-step presentation sequence designed for a BCA student demonstrating the project live to an internal guide or external examiner.

**Total Demo Time:** 5 to 7 Minutes  
**Demonstration URL:** `http://localhost:3000`  
**Admin Portal URL:** `http://localhost:3000/admin/login.html`  

---

## The 14-Step Live Demonstration Script

### Step 1: Start the Local Server
* **Action:** Open terminal in the project directory and run:
  ```bash
  node server.js
  ```
* **What to Say:**
  > *"Good morning, Sir/Madam. I am starting our Node.js and Express server. The server runs completely locally on port 3000 and connects to our SQLite database via Node's native `DatabaseSync` engine without any external cloud or internet dependencies."*

---

### Step 2: Open the Homepage
* **Action:** Open browser to `http://localhost:3000`.
* **What to Show:** Point out the clean terracotta/turmeric theme, the hero title, the live database counters (37 Foods, 25 States, 6 Regions, 12 References), and the featured dishes carousel.
* **What to Say:**
  > *"This is the landing page of Bharat Bhojan. Notice the live statistics counters—these values are not hardcoded in HTML; they are fetched asynchronously via our `/api/stats` REST endpoint directly from the relational database."*

---

### Step 3: Explain the Project Objective
* **What to Say:**
  > *"Academic Project #25 focuses on Traditional Indian Food Knowledge under the Indian Knowledge Systems (IKS) theme. Unlike commercial recipe websites that only list cooking measurements, Bharat Bhojan models the cultural context, indigenous ingredients, seasonal Ritu cycles, and historical traditions of regional foods using a normalized relational database."*

---

### Step 4: Open Explore Foods
* **Action:** Click **"Explore Foods"** in the navigation bar (`http://localhost:3000/explore.html`).
* **What to Show:** The multi-filter toolbar (State, Region, Season, Category, Diet, Sort) and the responsive card grid.
* **What to Say:**
  > *"Here on the Explore page, all 37 curated dishes are displayed. Each card shows the Romanized name, the native script in Devanagari or regional font, state of origin, culinary category, and an official green/red dietary indicator."*

---

### Step 5: Live Search Demonstration ("Litti Chokha")
* **Action:** Type `"Litti Chokha"` into the search box.
* **What to Show:** The grid updates smoothly to display the Litti Chokha card. Then type `"sattu"` to show ingredient-level search.
* **What to Say:**
  > *"Our search bar implements client-side debouncing with a 300-millisecond delay. It avoids spamming the backend on every keystroke. On the server side, it runs a parameterized SQL `LIKE` query across dish names, native scripts, descriptions, and joined ingredients."*

---

### Step 6: Multi-Criteria Filter Demonstration (Bihar + Winter)
* **Action:** In the filter dropdowns, select **State:** *Bihar* and **Season:** *Winter*.
* **What to Show:** The grid instantly filters down to the 4 traditional winter dishes of Bihar (*Litti Chokha*, *Thekua*, *Dal Pittha*, *Gaya Tilkut*).
* **What to Say:**
  > *"This demonstrates multi-criteria relational filtering. The backend dynamically constructs a parameterized SQL query with `WHERE` clauses combining the foreign keys for `state_id` and the `food_seasons` junction table without any SQL injection vulnerability."*

---

### Step 7: Open Food Details View
* **Action:** Click **"Explore Culinary Traditions →"** on the *Litti Chokha* card (`/food.html?slug=litti-chokha`).
* **What to Show:** The hero image, native script (`लिट्टी चोखा`), cultural significance block, academic variation disclaimer, traditional preparation methods, ingredients list, and citations.
* **What to Say:**
  > *"The details page is driven by a clean, human-readable URL slug (`?slug=litti-chokha`). Notice the academic disclaimer: we explicitly acknowledge that recipes naturally vary across households and communities, avoiding false claims of a 'single authentic recipe'."*

---

### Step 8: Explain Database Normalization on the Detail Page
* **Action:** Point to the **Key Ingredients** sidebar and the **Credible Sources & References** section.
* **What to Show:** Ingredients with "Key" badges and traditional proportions; references linked to K.T. Achaya and BSTDC.
* **What to Say:**
  > *"Here you can see the power of our 3NF relational design: ingredients and references are stored in separate master tables and connected to this dish through associative junction tables (`food_ingredients` and `food_references`). A single dish can cite multiple verified sources, and an ingredient can belong to many dishes."*

---

### Step 9: Open References & Bibliography
* **Action:** Click **"References"** in the top navigation bar (`http://localhost:3000/references.html`).
* **What to Show:** The 12 references organized into 4 categorized groups (Government & Institutional, Authoritative Books, Academic Journals, Cultural Archives).
* **What to Say:**
  > *"To ensure academic credibility, we do not cite anonymous lifestyle blogs. Every record is cross-referenced with official Geographical Indication gazettes, Oxford University Press food histories by K.T. Achaya, and Ministry of Culture archives."*

---

### Step 10: Log into the Admin Portal
* **Action:** Click **"🔒 Admin"** in the navigation bar (`http://localhost:3000/admin/login.html`). Enter username `admin`, password `admin123`.
* **What to Show:** Successful authentication, redirection to `/admin/dashboard.html`, live metric cards, and the complete management table.
* **What to Say:**
  > *"Our admin portal is protected by session-based authentication. Passwords are never stored in plain text; they are salted and hashed using `bcryptjs` with 10 rounds. The browser receives a secure HTTP cookie (`connect.sid`) with `httpOnly: true`, and our custom Express middleware guards every protected route."*

---

### Step 11: Demonstrate Full CRUD (Create, Read, Update, Delete)
* **Action:**
  1. Click **"+ Add Traditional Food"** to open the form.
  2. Enter a quick demo dish:
     - Name: `Bhojpur Chana Ghugni`
     - State: `Bihar`
     - Category: `Snack & Savory`
     - Diet: `Vegetarian`
     - Fill short descriptions and add an ingredient.
  3. Submit the form -> it creates the record and redirects to dashboard.
  4. Find the record in the table, click **"Edit"**, update the description, and save.
  5. Click **"Delete"**, confirm the browser modal prompt, and observe the row disappear.
* **What to Say:**
  > *"Our administrative portal supports full transactional CRUD operations. Inserting or updating a food and its multiple ingredients and seasons is wrapped inside an atomic SQL transaction (`BEGIN IMMEDIATE ... COMMIT`). When we delete a record, foreign key cascading (`ON DELETE CASCADE`) automatically cleans up the junction tables."*

---

### Step 12: Explain Technology Choices
* **What to Say:**
  > *"We deliberately chose pure HTML5, CSS3, Vanilla JavaScript, Node.js, Express, and SQLite. We avoided heavy frameworks like React, Next.js, or Tailwind to prove that we understand the foundational mechanics of web development: DOM manipulation, asynchronous Fetch API, CSS Grid, RESTful API design, and SQL normalization."*

---

### Step 13: Explain Limitations Honestly
* **What to Say:**
  > *"As an academic prototype, Bharat Bhojan has three intentional scope boundaries:
  > 1. It is a curated dataset of 37 dishes across 21 states rather than an exhaustive encyclopedia.
  > 2. It avoids medical or clinical health claims to maintain academic integrity.
  > 3. Sessions are managed in server memory rather than a distributed Redis cache, keeping the project 100% lightweight and local."*

---

### Step 14: Finish the Demonstration
* **Action:** Log out of the admin portal (`admin/login.html`) and return to the home page.
* **What to Say:**
  > *"The system has been verified using an automated 43-assertion end-to-end test suite (`test-system.js`), with 100% of tests passing. Thank you, Sir/Madam. I am happy to answer any questions about the database schema or code."*
