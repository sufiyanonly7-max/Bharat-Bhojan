# Comprehensive Viva-Voce Revision Guide & FAQ
**Bharat Bhojan – Traditional Indian Food Knowledge Information System**  
*Academic Project #25 | BCA 5th-Semester Viva Preparation*

---

> [!TIP]
> **How to Use This Guide:**  
> These answers are written in clear, natural, conversational English suitable for a BCA semester viva. You do not need to memorize textbook definitions word-for-word. Understand the concepts and explain them confidently in your own words.

---

### Section 1: Project Overview & Motivation

#### Q1. What is your project about?
**Answer:** My project is called **Bharat Bhojan**. It is a database-driven web information system that documents traditional regional foods across India, along with their native ingredients, seasonal cycles, traditional cooking methods, cultural stories, and credible sources. It has a public portal for searching and filtering dishes, and a password-protected admin portal for adding, editing, and deleting food records.

#### Q2. Why did you choose this project topic?
**Answer:** Most cooking websites on the internet only give recipe instructions for urban kitchens. They often ignore the cultural history, seasonality, and agricultural background of traditional dishes. I wanted to apply web development and relational database management to preserve and structure traditional Indian food knowledge in an educational format.

#### Q3. What is Indian Knowledge Systems (IKS) in the context of your project?
**Answer:** In this project, IKS refers to traditional Indian dietary practices developed over centuries. This includes *Ritu-Charya* (adjusting what you eat according to India's six seasons), natural food preservation (like natural fermentation in *Dosa* and *Dhokla*, or using banana-ash alkali in Assamese *Kolakhar*), and utilizing climate-resilient local grains like sattu, maize, and millets.

#### Q4. Is Bharat Bhojan a commercial or real-world website?
**Answer:** No, it is an **academic educational prototype**. It demonstrates how relational database design, REST APIs, and modern responsive web development can structure cultural knowledge.

#### Q5. Why did you include dishes from Bihar specifically?
**Answer:** While the project is geographically diverse and covers North, South, East, West, Central, and North-East India, I am developing this project in Bihar. Therefore, I included well-documented traditional foods from our home state—such as Litti Chokha, Thekua, Sattu preparations, Silao Khaja, Dal Pittha, and Gaya Tilkut—to celebrate regional heritage alongside other Indian traditions.

---

### Section 2: Database & SQL Fundamentals

#### Q6. What is a database?
**Answer:** A database is an organized collection of structured data stored electronically, allowing data to be easily accessed, inserted, updated, searched, and managed.

#### Q7. Why did you choose SQLite for this project?
**Answer:** I chose SQLite because:
1. It is a serverless, self-contained, single-file database (`bharat_bhojan.db`).
2. It requires zero complex background server configuration, making it fast and 100% reliable to demonstrate locally in college.
3. Node.js (version 22+) includes native built-in SQLite support (`node:sqlite`), so it requires no external native compilation tools.
4. It fully supports standard SQL queries, primary keys, foreign keys, transactions, and indexes.

#### Q8. Can this project work with MySQL?
**Answer:** Yes. The database architecture is relational. I have also prepared a `docs/mysql-schema.sql` file containing the MySQL 8.0-compatible schema, which uses identical table structures, foreign keys, and indexes.

#### Q9. What is a Primary Key?
**Answer:** A primary key is a column (or combination of columns) that uniquely identifies each row in a database table. Primary key values must be unique and cannot be `NULL`. In our `foods` table, `id` is the primary key.

#### Q10. What is a Foreign Key?
**Answer:** A foreign key is a column in one table that links to the primary key of another table, establishing a relationship between the two tables. For example, `state_id` in the `foods` table is a foreign key pointing to `id` in the `states` table.

#### Q11. What is Referential Integrity?
**Answer:** Referential integrity is a database rule ensuring that relationships between tables remain consistent. For example, you cannot insert a food record with a `state_id` that does not exist in the `states` table. In SQLite, we enforce this by running `PRAGMA foreign_keys = ON;`.

#### Q12. What is Database Normalization?
**Answer:** Normalization is the systematic process of organizing data in a relational database to reduce data redundancy and eliminate anomalies during insert, update, or delete operations.

#### Q13. How is your database normalized (1NF, 2NF, 3NF)?
**Answer:**
- **1NF (First Normal Form):** Every cell holds an atomic (single) value. We do not store comma-separated lists of ingredients or seasons in one cell.
- **2NF (Second Normal Form):** It is in 1NF, and all non-key attributes depend on the full primary key. In junction tables like `food_ingredients`, quantity depends on the combination of `(food_id, ingredient_id)`.
- **3NF (Third Normal Form):** It is in 2NF, and there are no transitive dependencies. For example, region details are stored in `regions`, not duplicated inside the `foods` table.

#### Q14. Why are ingredients stored in a separate table instead of a column in `foods`?
**Answer:** Because the relationship between foods and ingredients is **Many-to-Many**:
- One food has many ingredients (e.g., Litti Chokha contains sattu, wheat flour, mustard oil, garlic).
- One ingredient belongs to many foods (e.g., mustard oil is used in Litti, Machher Jhol, and Khaar).
Storing them in a separate table and linking them via a junction table (`food_ingredients`) prevents repeating text and allows searching for all foods made with a specific ingredient.

#### Q15. What is an Associative / Junction Table?
**Answer:** A junction table is an intermediate table used to model a Many-to-Many relationship between two entity tables. It contains foreign keys referencing both tables as its composite primary key. In our project, `food_ingredients`, `food_seasons`, and `food_references` are junction tables.

#### Q16. What is an Index in a database, and where did you use it?
**Answer:** An index is a special lookup data structure (like the index at the back of a textbook) that allows the database engine to locate specific rows much faster without scanning every row in the table. We created indexes on frequently searched and filtered columns, such as `state_id`, `region_id`, `category_id`, `slug`, and `veg_type`.

#### Q17. What is a Database Transaction?
**Answer:** A transaction is a unit of work that bundles multiple SQL statements together so that either **all of them succeed** (COMMIT) or **none of them take effect** (ROLLBACK). When an admin creates or edits a food in our application, inserting into `foods`, `food_ingredients`, and `food_seasons` is wrapped in a transaction so partial data is never saved if an error occurs.

---

### Section 3: Web Development Fundamentals (Frontend)

#### Q18. What is the difference between Frontend and Backend?
**Answer:**
- **Frontend:** The client-side part of the application that users see and interact with in their browser (HTML for structure, CSS for styling, and JavaScript for user interactions).
- **Backend:** The server-side part that runs on the web server (Node.js/Express in our case) that handles business logic, processes requests, runs database queries, and manages security.

#### Q19. Why did you use Vanilla JavaScript instead of React, Angular, or Vue?
**Answer:** The goal of a BCA academic project is to demonstrate mastery of core web fundamentals. Frameworks like React introduce build steps, heavy node modules, and abstractions like virtual DOM and JSX. Using Vanilla JavaScript shows that I understand DOM manipulation, the `fetch()` API, event listeners, and asynchronous programming directly.

#### Q20. What is Semantic HTML?
**Answer:** Semantic HTML means using HTML tags that accurately describe the meaning of the content inside them, such as `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>`, rather than generic `<div>` tags everywhere. This improves accessibility, readability, and search engine optimization.

#### Q21. What is Responsive Web Design?
**Answer:** Responsive design means building web pages that automatically adapt their layout, images, and fonts to look good and function properly on all screen sizes, from mobile phones (360px) to tablets and widescreen desktop monitors.

#### Q22. How did you make the application responsive?
**Answer:**
1. Using the viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
2. Using flexible CSS Grid (`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`) and Flexbox.
3. Defining CSS media queries in `responsive.css` for mobile screens (`max-width: 768px`) and extra small viewports (`max-width: 400px`).
4. Implementing a mobile hamburger toggle menu for smaller screens.

#### Q23. What are CSS Custom Properties (Variables)?
**Answer:** CSS variables are entities defined using `--variable-name` (e.g. `--primary: #A8422B;`) that store reusable values throughout a stylesheet. They make design systems consistent and easy to maintain.

#### Q24. How does your image fallback system work?
**Answer:** If an image fails to load or the path is broken, the `onerror` event on the `<img>` tag fires and triggers `handleImageError(this)`. This function immediately replaces the broken image URL with our local vector fallback (`/assets/images/placeholder.svg`), ensuring the user never sees a broken image icon.

---

### Section 4: Backend Architecture & APIs

#### Q25. What is Node.js?
**Answer:** Node.js is an open-source, cross-platform runtime environment that executes JavaScript code outside of a web browser, allowing developers to write server-side backend applications in JavaScript.

#### Q26. What is Express.js?
**Answer:** Express.js is a minimal, fast, and flexible web application framework for Node.js. It simplifies routing, handling HTTP requests and responses, and configuring middleware.

#### Q27. What is an API?
**Answer:** API stands for Application Programming Interface. It is a set of defined rules and endpoints that allows two software programs—in our case, the frontend web page and the backend server—to communicate and exchange data.

#### Q28. What is a REST API?
**Answer:** REST stands for Representational State Transfer. A REST API is an architectural style that uses standard HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URLs (e.g., `/api/foods`).

#### Q29. Explain HTTP methods: GET, POST, PUT, DELETE.
**Answer:**
- **GET:** Retrieves data from the server without modifying anything (e.g., `GET /api/foods`).
- **POST:** Submits new data to the server to create a resource (e.g., `POST /api/admin/foods`).
- **PUT:** Updates or replaces an existing resource on the server (e.g., `PUT /api/admin/foods/:id`).
- **DELETE:** Removes an existing resource from the server (e.g., `DELETE /api/admin/foods/:id`).

#### Q30. What is Middleware in Express?
**Answer:** Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application's request-response cycle. They can execute code, modify requests, and end requests or pass control to the next handler. We use middleware for:
1. Parsing incoming JSON (`express.json()`).
2. Managing admin sessions (`express-session`).
3. Protecting admin routes (`requireAdmin`).
4. Catching unhandled errors (`errorHandler`).

#### Q31. How does search work in your application?
**Answer:** When a user types in the search box, client-side JavaScript captures the input and waits 300 milliseconds (debouncing). It then sends a request to `GET /api/foods/search?q=query`. The backend runs a parameterized SQL query matching the query with `LIKE %query%` across the food name, local native script, state, region, category, cultural notes, and joined ingredients. The database returns the matching records as JSON, which JavaScript renders as cards.

#### Q32. What is Debouncing?
**Answer:** Debouncing is a programming practice that ensures a time-consuming task (like sending a network search request) is only executed after a user stops typing for a specified time (e.g., 300ms). This prevents flooding the server with an API request on every single keystroke.

#### Q33. How does filtering work when multiple filters are selected?
**Answer:** When the user selects filters (e.g., State = "Bihar" and Season = "Winter"), the backend controller builds a dynamic SQL query. It starts with `WHERE 1=1` and appends `AND s.name = ?` and `AND sn.name = ?` using parameterized variables. The database only returns records that satisfy all conditions simultaneously.

---

### Section 5: Security & Authentication

#### Q34. How does Admin Authentication work in your system?
**Answer:** We use **session-based authentication**:
1. The admin submits their username and password via `POST /api/admin/login`.
2. The server queries the `admins` table by username.
3. The server compares the submitted password against the stored bcrypt hash using `bcrypt.compareSync()`.
4. If valid, the server creates a session (`req.session.adminUser = { id, username }`) and sends a secure HTTP session cookie (`connect.sid`) to the browser.
5. On subsequent requests, the browser sends this cookie, and our `requireAdmin` middleware verifies that the session is active before allowing access to admin routes.

#### Q35. Why shouldn't passwords be stored as plain text?
**Answer:** If passwords are stored as plain text, anyone with database access (or in the event of a database leak) can instantly read users' passwords.

#### Q36. What is bcrypt, and what is a salt?
**Answer:** bcrypt is a cryptographic password hashing function designed to be slow and computationally intensive to prevent brute-force attacks. A "salt" is a random string generated and mixed with the password before hashing so that identical passwords result in completely different hashes.

#### Q37. What is SQL Injection?
**Answer:** SQL Injection is a security vulnerability where an attacker inputs malicious SQL commands into a form field or query parameter, tricking the database into running unauthorized queries (like `SELECT * FROM users WHERE '1'='1'`).

#### Q38. How did you prevent SQL Injection in your project?
**Answer:** We prevented SQL injection by using **parameterized queries / prepared statements** exclusively. Instead of concatenating variables into SQL strings (like `WHERE name = '` + input + `'`), we use parameter placeholders (`WHERE name = ?`) and pass inputs as separate parameter arrays. The database engine treats the input strictly as literal data, never as executable SQL code.

#### Q39. What is Cross-Site Scripting (XSS), and how did you prevent it?
**Answer:** XSS is an attack where malicious JavaScript code is injected into a website and executed in other users' browsers. In our frontend JavaScript, dynamic database text is passed through an `escapeHtml()` function that converts characters like `<`, `>`, `&`, and `"` into safe HTML entities before inserting them into the DOM.

---

### Section 6: Academic Scope & Future Improvements

#### Q40. Why does your project explicitly say "recipes may vary by household"?
**Answer:** Because Indian food is regional and familial. Traditional foods like *Litti Chokha* or *Dal Baati* have variations in every village and household. Claiming that there is only one "authentic" recipe would be culturally inaccurate. Our academic documentation establishes baseline cultural and historical knowledge while respecting regional diversity.

#### Q41. Why are there no health or medical claims in your project?
**Answer:** Providing medical, nutritional, or health prescriptions requires formal clinical research and dietary certification. As an IT/computer applications student project, the focus is strictly on cultural, historical, and database information systems.

#### Q42. If you had another month, what features would you add?
**Answer:**
1. **Multilingual Support:** Adding a language switcher for Hindi and regional scripts.
2. **Interactive Map of India:** A clickable SVG map where clicking a state shows its traditional foods.
3. **Public Community Submissions:** Allowing visitors to submit traditional family recipes, which appear only after admin moderation and approval.
4. **PWA (Progressive Web App):** Enabling offline caching so users in rural areas can access the database without internet connectivity.

---

### Section 7: Advanced Web, Backend & Software Engineering Questions

#### Q43. What is the difference between Synchronous and Asynchronous code in Node.js?
**Answer:** Synchronous code executes sequentially, blocking subsequent operations until the current line finishes. Asynchronous code (using Promises or `async/await`) delegates time-consuming tasks (like network calls or file reads) to the system, allowing the single-threaded Node.js event loop to process other incoming requests without stalling.

#### Q44. What is the Node.js Event Loop?
**Answer:** The Event Loop is the core mechanism that allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded. It offloads I/O operations to the system kernel whenever possible and executes callbacks when operations complete.

#### Q45. What is `package.json` and what is its role?
**Answer:** `package.json` is the manifest file of a Node.js project. It contains metadata about the application (name, version, scripts) and lists all external package dependencies required to run the application, allowing any developer to replicate the exact environment using `npm install`.

#### Q46. What is the difference between `dependencies` and `devDependencies`?
**Answer:** `dependencies` are production packages required for the application to function at runtime (e.g., `express`, `bcryptjs`). `devDependencies` are packages needed only during development and testing (e.g., linters, build bundlers, or test harnesses), which are not required in a production deployment.

#### Q47. What is the role of `.env` file and the `dotenv` package?
**Answer:** The `.env` file stores sensitive environment-specific configuration variables (such as `PORT`, `SESSION_SECRET`, and default admin credentials) outside the source code repository. The `dotenv` package reads this file at server startup and attaches these key-value pairs to Node's `process.env` global object.

#### Q48. What are standard RESTful resource naming conventions?
**Answer:** REST conventions recommend using plural nouns for resource endpoints rather than verbs. For example, use `GET /api/foods` (not `/api/getFoods`) and `DELETE /api/admin/foods/:id` (not `/api/deleteFood?id=1`). The HTTP verb specifies the action, and the URL specifies the resource.

#### Q49. Explain the common HTTP status codes used in your project: 200, 201, 400, 401, 404, 500.
**Answer:**
- **200 OK:** The request succeeded and data was returned.
- **201 Created:** A new resource was successfully created (used in admin `POST /api/admin/foods`).
- **400 Bad Request:** Client submitted invalid or missing input (e.g., missing food name).
- **401 Unauthorized:** Request lacked valid authentication session or credentials.
- **404 Not Found:** The requested URL route or food slug does not exist.
- **500 Internal Server Error:** An unexpected server-side exception occurred.

#### Q50. How does `node:sqlite` differ from older packages like `better-sqlite3` or `sqlite3`?
**Answer:** `sqlite3` and `better-sqlite3` are third-party npm packages that require native C++ compilation tools (`node-gyp`, Python, C++ compiler) during installation, which frequently fails on student Windows computers. In contrast, `node:sqlite` (via `DatabaseSync`) is built directly into modern Node.js runtimes, requiring zero external compilers or native build chains.

#### Q51. What is the difference between `localStorage`, `sessionStorage`, and `HTTP Cookies`?
**Answer:**
- **`localStorage`:** Stores key-value strings in the browser with no expiration date; persists until cleared manually. Accessible via JavaScript.
- **`sessionStorage`:** Stores data for the duration of a single browser tab; data is cleared when the tab closes.
- **`HTTP Cookies`:** Small text tokens sent automatically with every HTTP request to the server. When marked with `httpOnly: true`, cookies cannot be read or stolen by client-side JavaScript, protecting against session hijacking via XSS.

#### Q52. What is a URL slug and why do you use it instead of database IDs?
**Answer:** A slug is a human-readable, URL-safe version of a title composed of lowercase letters and hyphens (e.g., `litti-chokha` instead of `id=1`). Slugs improve user experience, make URLs memorable and shareable, and improve Search Engine Optimization (SEO).

#### Q53. What is a Composite Key and where did you use it?
**Answer:** A Composite Key is a primary key composed of two or more columns that together uniquely identify a table row. In our junction table `food_ingredients`, the composite key is `PRIMARY KEY (food_id, ingredient_id)`, which guarantees that an ingredient cannot be associated with the same food more than once.

#### Q54. What happens if an admin tries to delete a region that still has states linked to it?
**Answer:** Because the foreign key in `states` defines `ON DELETE RESTRICT`, SQLite immediately rejects the deletion and raises a foreign key constraint error. This prevents orphaned state records and protects referential integrity.

#### Q55. How do you handle 404 errors for non-existent API routes versus non-existent web pages?
**Answer:** In `server.js`, the catch-all 404 middleware checks `req.originalUrl`. If the path starts with `/api/`, it returns a structured JSON object (`{ success: false, message: 'Resource not found' }`). If it is a web page navigation, it serves our branded, responsive `public/404.html` page with links back to the home page.

#### Q56. What is the DOM (Document Object Model) and how does Vanilla JS manipulate it?
**Answer:** The DOM is a tree-like object representation of the HTML document created by the browser. Vanilla JavaScript accesses and manipulates it using standard browser APIs like `document.getElementById()`, `document.querySelector()`, `element.innerHTML`, and `element.addEventListener()` to dynamically update content without reloading the page.

#### Q57. What is CORS and do we need it in our local setup?
**Answer:** CORS stands for Cross-Origin Resource Sharing, a browser security policy that restricts web pages from making AJAX requests to a different domain or port than the one serving the page. In our application, both the frontend static files and the backend API are served from the exact same origin (`http://localhost:3000`), so cross-origin requests do not occur and CORS issues are eliminated.

#### Q58. How did you test your application end-to-end?
**Answer:** I authored an automated test suite in `test-system.js`. It runs programmatic HTTP queries against all static HTML routes, public APIs, search and filter variations, admin session lifecycle, and transactional CRUD endpoints. It asserts 43 verification checks across 23 testing scenarios, logging a complete pass/fail report to the terminal.

#### Q59. Why did you use local SVG illustrations instead of external image URLs?
**Answer:** External image URLs often break when websites change links, and downloading high-resolution images requires an active internet connection. I created a procedural asset generator script (`database/generate-assets.js`) that produces 38 local, lightweight vector SVG illustrations stored directly in `public/assets/images/`, allowing the application to function 100% offline.

#### Q60. How does this project prove you are ready for a career in software development?
**Answer:** It demonstrates end-to-end full-stack software development competency: understanding problem domains (IKS), designing a 3NF normalized database, structuring RESTful APIs with input validation and security guards, authoring clean asynchronous JavaScript without framework crutches, writing thorough documentation, and validating functionality with automated tests.
