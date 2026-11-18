# Academic Project Proposal
**Bachelor of Computer Applications (BCA) – 5th Semester**  
**Project Number:** 25  
**Official Project Title:** Traditional Indian Food-Knowledge Information System  
**System Name:** Bharat Bhojan – Traditional Indian Food Knowledge Information System  
**Technology Domain:** Database + Web Development  

---

## 1. Project Title
**Bharat Bhojan – Traditional Indian Food Knowledge Information System**  
A Database-Driven Web Information Portal Documenting Regional Foods, Ingredients, Seasonality, Preparation Traditions, and Cultural Context.

---

## 2. Introduction and Background
Food in India is fundamentally more than basic bodily nutrition; it represents thousands of years of geographical adaptation, agricultural cycles, religious philosophy, and regional culture. Across diverse geographical landscapes—from the cold mountain valleys of the Himalayas to the coastal peninsulas and river deltas—different communities evolved distinct culinary practices utilizing native grains, wild greens, natural fermentation techniques, and earthen vessels.

In contemporary society, rapid urbanization and commercial fast-food culture have begun to detach younger generations from traditional regional diets. While thousands of cooking blogs exist on the internet, most present recipes in isolation without documenting the underlying agricultural seasonality, traditional culinary science, historical background, or regional cultural context. 

This project, titled **Bharat Bhojan**, is an academic initiative designed to address this gap. It applies core computer science principles—specifically relational database design, RESTful web services, and responsive frontend engineering—to organize and present traditional Indian food knowledge in a structured, accessible, and educational manner.

---

## 3. Indian Knowledge System (IKS) Component
The Indian Knowledge System (IKS) foundation of this project is built upon traditional Indian dietary wisdom:

1. **Ritu-Charya (Seasonal Dietary Rhythms):** Traditional Indian texts and folk traditions describe six distinct seasons (*Shad-Ritu*). Diet was historically modified according to the season—for example, consuming cooling roasted gram flour (*Sattu*) during scorching summer months, warming mustard greens (*Sarson*) and sesame seeds (*Til*) during winter, and light digestive preparations during the monsoon.
2. **Indigenous Food Science & Preservation:** Long before modern industrial refrigeration, Indian communities mastered natural preservation methods:
   - Natural microbial fermentation in rice and pulses (e.g., *Dosa*, *Dhokla*, *Misal*).
   - Natural alkali preparation using plant ashes (e.g., Assamese *Kolakhar* from sun-dried banana peels).
   - Sun-drying and natural souring agents (e.g., Goan *Kokum*, Assamese *Ou Tenga*).
   - Clay oven baking over biomass embers (e.g., Bihari *Litti*, Odia *Chhena Poda*).
3. **Agro-Ecological Adaptation:** Traditional foods were developed around drought-tolerant native grains (such as barley, gram, and millets) and local water profiles, minimizing food waste and environmental strain.

---

## 4. Problem Statement
Traditional Indian food knowledge varies significantly across regions, communities, and agro-climatic zones. Information about regional foods, indigenous ingredients, seasonal practices, preparation traditions, and cultural significance is often distributed across rare books, localized publications, oral family memories, and unindexed web pages. 

Most existing websites focus exclusively on commercial cooking instructions, often obscuring the cultural history, seasonality, and regional significance of traditional foods. The proposed system aims to organize selected, verified information into a structured, searchable, and educational digital portal.

---

## 5. Need for the Project
1. **Preservation of Indigenous Knowledge:** Digital archiving helps document traditional culinary practices before they are displaced by homogenized commercial foods.
2. **Structured Information Retrieval:** Enabling students, researchers, and cultural enthusiasts to query dishes not just by name, but by state, geographical zone, season, and primary ingredients.
3. **Educational Awareness:** Helping users understand that Indian cuisine is not a single monolithic entity, but a rich mosaic of hundreds of localized culinary ecosystems.
4. **Academic Demonstration of CS Fundamentals:** Demonstrating how relational database normalization (3NF) solves data redundancy and organizes complex cultural relationships in web applications.

---

## 6. Objectives of the Project
- To digitally document selected traditional Indian foods with verified geographical, cultural, and preparation details.
- To organize food records systematically according to region, state, season, category, and ingredients.
- To design and implement a normalized relational database in SQLite with full foreign key integrity.
- To build a fast, user-friendly, responsive web application supporting real-time search, multi-criteria filtering, and detailed dish views.
- To present cultural context, traditional preparation techniques, and seasonality notes without making unsupported health or medical claims.
- To create a secure, session-authenticated administrative dashboard supporting full CRUD (Create, Read, Update, Delete) operations.
- To demonstrate beginner-friendly, readable, standard web development using HTML5, CSS3, Vanilla JavaScript, Node.js, and Express.js.

---

## 7. Scope of the Project
- **Geographical Scope:** Covers all major zones of India (North, South, East, West, Central, and North-East India), with special representation of Bihar dishes (including Litti Chokha, Thekua, Sattu preparations, Silao Khaja, Mithila Makhana Kheer, Bihari Malpua, Dal Pittha, and Gaya Tilkut).
- **Curated Dataset:** Includes a curated initial dataset of 37 diverse traditional dishes backed by credible references.
- **Academic Prototype:** Positioned strictly as an educational information system prototype rather than an exhaustive commercial directory.
- **User Roles:** Caters to general visitors/students (browsing, searching, filtering) and administrators (managing food entries, categories, and references).

---

## 8. Proposed Methodology
The project follows the classical **Software Development Life Cycle (SDLC)** with a linear, structured approach:

1. **System Analysis & Data Gathering:** Identification of entity attributes, sourcing cultural data from credible publications (K.T. Achaya, Ministry of Tourism, GI Registry), and drafting functional requirements.
2. **Database Design:** Designing an Entity-Relationship (ER) model, normalizing tables to Third Normal Form (3NF), defining foreign keys, and writing SQL DDL scripts.
3. **Backend API Development:** Creating Express.js route handlers, controller logic, parameterized database queries, and session authentication middleware.
4. **Frontend Interface Engineering:** Developing semantic HTML5 templates, clean responsive CSS styling using CSS custom properties, and writing Vanilla JavaScript modules for dynamic fetch and DOM rendering.
5. **Testing & Verification:** Executing manual test cases across search, filtering, detail pages, admin authentication, CRUD operations, and responsive viewport checks (360px to desktop).
6. **Documentation & Viva Preparation:** Preparing comprehensive documentation including database design, API guides, testing reports, and viva revision notes.

---

## 9. Computational Method
- **Relational Data Modeling:** 3NF normalized schema separating core foods from many-to-many relationships (ingredients, seasons, references) via associative junction tables.
- **Parameterized SQL Execution:** Protection against SQL Injection using prepared statements with parameter binding (`?`).
- **Client-Side Debouncing:** Delaying API fetch requests during user typing in search bars (300ms window) to reduce unnecessary database load.
- **Cryptographic Security:** Hashing administrative passwords using bcrypt with a salt work factor of 10 rounds to avoid plain-text storage.
- **Stateless/Stateful Separation:** Public browsing remains completely stateless and unauthenticated; admin operations utilize secure, server-side session cookies.

---

## 10. Technology Stack
- **Frontend:**
  - HTML5 (Semantic structural elements)
  - CSS3 (Responsive grid, flexbox, CSS custom properties, mobile-first design)
  - Vanilla JavaScript (Fetch API, DOM manipulation, debouncing, zero external frameworks)
- **Backend:**
  - Node.js (Runtime environment)
  - Express.js (Web application server framework)
- **Database:**
  - SQLite via Node.js built-in `node:sqlite` (Portable, serverless, single-file relational database)
  - SQL (Structured Query Language for DDL and DML operations)
- **Security & Utilities:**
  - `bcryptjs` (Password hashing)
  - `express-session` (Session-based authentication)
  - `dotenv` (Environment configuration)

---

## 11. Database Design Overview
The relational schema consists of 11 interrelated tables:
- **`regions`** (1:M with `states` and `foods`)
- **`states`** (1:M with `foods`)
- **`categories`** (1:M with `foods`)
- **`seasons`** (M:N with `foods` via `food_seasons`)
- **`ingredients`** (M:N with `foods` via `food_ingredients`)
- **`references_tbl`** (M:N with `foods` via `food_references`)
- **`foods`** (Central entity table)
- **`admins`** (Authentication entity table)

Indexes are placed on frequently searched and filtered fields (`state_id`, `region_id`, `category_id`, `slug`, `veg_type`, and junction foreign keys).

---

## 12. Major Modules
1. **Public Explorer Module:**
   - Multi-field search (dish name, native script, ingredients, cultural keywords).
   - Multi-criteria filtering (Region, State, Season, Category, Vegetarian/Non-Vegetarian).
   - Dynamic sorting (A-Z, Z-A, by State).
2. **Food Detail Module:**
   - Native name, geographical context, and dietary badge.
   - Narrative of cultural significance, preparation traditions, and seasonality.
   - Structured ingredients table with primary indicators.
   - Bibliographic citations and related regional dishes.
3. **Geographical & Seasonal Modules:**
   - Categorization by 6 Indian geographical zones.
   - Categorization by the 6 traditional Indian Ritus.
4. **Administrative Management Module:**
   - Secure login and logout.
   - Dashboard displaying live metric cards and a searchable food management table.
   - Dynamic Add/Edit form with dynamic ingredient rows and checkbox bindings.
   - Safe deletion with user confirmation.

---

## 13. Expected Output
- A fully functional, locally hosted web application accessible via standard web browsers.
- Real-time search and filter updates that respond immediately without page reloads.
- Verified cultural records for 37 diverse traditional Indian dishes.
- A functional admin portal capable of creating, updating, and deleting records in real time with immediate database persistence.
- Complete offline capability with zero reliance on paid APIs or external image hosts.

---

## 14. Limitations
- **Educational Prototype Scope:** The system documents 37 curated dishes to demonstrate relational database design. It does not represent every single Indian dish.
- **No Medical Claims:** The system documents traditional dietary habits and historical context; it does not provide medical, clinical, or dietetic prescriptions.
- **Regional Variations:** Because recipes vary between families and localities, entries represent common cultural baselines rather than a single exclusive recipe.
- **Single Admin Level:** The current administration system features a single administrator role without tiered editorial workflows.

---

## 15. Future Scope
- **Multilingual Support:** Localization into Hindi (हिन्दी) and regional Indian scripts.
- **Interactive Map of India:** A visual SVG map enabling users to click states to see regional dishes.
- **Community Submissions:** A public contribution form allowing users to submit family recipes for admin review.
- **Progressive Web App (PWA):** Service worker caching for offline access on mobile devices in low-connectivity areas.

---

## 16. Preliminary References
1. **Achaya, K. T.** (1998). *A Historical Dictionary of Indian Food*. Oxford University Press.
2. **Achaya, K. T.** (1994). *Indian Food: A Historical Companion*. Oxford University Press.
3. **Ministry of Tourism, Government of India.** (2021). *Culinary Heritage of India – Incredible India*.
4. **Anthropological Survey of India.** (2016). *Traditional Food Systems of India*. Ministry of Culture.
5. **Controller General of Patents, Designs and Trademarks.** (2020). *Geographical Indications Journal of India*. Ministry of Commerce and Industry.
6. **Tamang, J. P., et al.** (2016). *Fermented Foods and Beverages of India*. Journal of Ethnic Foods, Elsevier.
7. **Sen, Colleen Taylor.** (2015). *Feasts and Fasts: A History of Food in India*. Reaktion Books.
8. **Bihar State Tourism Development Corporation (BSTDC).** (2020). *Culinary Traditions of Bihar and Eastern India*. Department of Tourism, Government of Bihar.
