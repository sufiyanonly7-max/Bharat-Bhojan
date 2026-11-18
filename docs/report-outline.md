# Academic Project Report Outline
**Bachelor of Computer Applications (BCA) – Semester V**  
**Official Project Number:** 25  
**Project Title:** Traditional Indian Food-Knowledge Information System  
**System Name:** Bharat Bhojan  

---

> [!NOTE]
> This outline is organized according to standard BCA academic project report guidelines. Under each chapter heading is a precise checklist specifying exactly what information, diagrams, and code snippets from this application should be written into your final semester submission.

---

### Preliminary Pages
- **Title Page:** Project title, student name, roll number, registration number, college emblem, and department details.
- **Certificate of Approval:** Signed by project guide and Head of Department (HOD).
- **Declaration by the Candidate:** Standard academic honesty declaration stating work was developed by the student.
- **Acknowledgements:** Acknowledgement of department professors, laboratory assistants, and university mentors.
- **Abstract / Executive Summary:** 250-word summary highlighting the problem, relational database methodology, technology stack, and outcome.
- **Table of Contents, List of Figures, and List of Tables.**

---

### Chapter 1 – Introduction and Background
- **1.1 Overview:** Introduction to India's vast cultural and geographical diversity and its reflection in regional culinary traditions.
- **1.2 Motivation:** Why digital preservation of traditional food systems is relevant today.
- **1.3 Project Identity:** Introduction to *Bharat Bhojan* as an educational database-driven information system.
- **1.4 Academic Scope:** Framing the project within the BCA 5th-semester curriculum focusing on database systems, backend web services, and user interface design.

---

### Chapter 2 – Indian Knowledge System (IKS) Foundation
- **2.1 Concept of Traditional Food Knowledge:** What constitutes traditional food in this project (agro-ecology, native grains, cultural rituals).
- **2.2 Ritu-Charya (Seasonal Rhythms):** The six traditional Indian seasons (*Shad-Ritu*) and how diet historically adapted to temperature and harvest cycles.
- **2.3 Indigenous Food Processing & Chemistry:**
  - Natural lactic acid and yeast fermentation (*Dosa*, *Dhokla*, *Misal*).
  - Alkaline mineral extraction using plant ashes (Assamese *Kolakhar*).
  - Clay pot baking and thermal dynamics (Bihari *Litti*, Odia *Chhena Poda*).
- **2.4 Agro-Climatic and Botanical Significance:** Use of native drought-tolerant staples like sattu, maize (*Makki*), and horse gram (*Gahat*).

---

### Chapter 3 – Literature / Source Study
- **3.1 Review of Authoritative Works:**
  - K. T. Achaya’s *A Historical Dictionary of Indian Food* (Oxford University Press, 1998).
  - K. T. Achaya’s *Indian Food: A Historical Companion* (Oxford University Press, 1994).
  - Anthropological Survey of India’s *Traditional Food Systems of India* (2016).
  - Ministry of Tourism’s *Culinary Heritage of India* documentation.
  - Geographical Indications (GI) Journal gazettes (Silao Khaja, Hyderabadi Haleem, Bebinca).
- **3.2 Analysis of Existing Web Portals:** Comparison of commercial recipe blogs vs. cultural information systems, highlighting the absence of structured relational queries and historical context in commercial blogs.

---

### Chapter 4 – Problem Statement, Objectives and Methodology
- **4.1 Problem Definition:** Fragmentation and loss of context in modern digital food documentation.
- **4.2 Need for the System:** Why a normalized, database-backed information system is needed.
- **4.3 Project Objectives:** The 7 specific objectives (cataloging, 3NF schema, search/filtering, cultural narrative, session authentication, beginner-friendly code).
- **4.4 Methodology (SDLC):** Phased software engineering approach from requirements gathering to database design, implementation, and verification.

---

### Chapter 5 – System Analysis and Design
- **5.1 Functional Requirements:** Detailed specifications for public browsing, search, multi-criteria filtering, details view, and administrative CRUD.
- **5.2 Non-Functional Requirements:** Security, input validation, responsiveness, performance, and accessibility.
- **5.3 Architectural Design:** MVC (Model-View-Controller) inspired design connecting Express routers, controllers, and SQLite storage.
- **5.4 Database Design & Modeling:**
  - Complete Entity-Relationship (ER) Diagram (from `docs/database-design.md`).
  - Table schemas with Primary Keys, Foreign Keys, Unique constraints, and Check constraints.
  - Normalization justification (1NF, 2NF, 3NF analysis).
  - Explanation of junction tables for Many-to-Many relationships.
- **5.5 UI/UX Design System:** Color palette rationales, CSS custom properties, and mobile-first responsive grid layouts.

---

### Chapter 6 – Implementation and Development
- **6.1 Technology Stack Justification:** Why Node.js, Express, pure SQLite, and Vanilla JS were chosen over heavy frameworks.
- **6.2 Database Connection & Query Module:** Deep dive into `config/database.js` using Node's native `DatabaseSync`.
- **6.3 Backend Controllers & Business Logic:**
  - Query construction in `controllers/foodsController.js` (dynamic parameter binding).
  - Search implementation with debouncing and multi-field `LIKE` patterns.
  - Transaction handling in `controllers/adminController.js`.
- **6.4 Security Implementation:**
  - Password hashing with `bcryptjs` (salt factor 10).
  - Session management with `express-session` and route guarding in `middleware/auth.js`.
  - SQL Injection prevention through prepared statements.
- **6.5 Frontend Development:**
  - Client-side DOM manipulation in `public/js/explore.js`, `food.js`, and `regions.js`.
  - SVG vector asset generation strategy in `database/generate-assets.js`.
  - Image fallback resilience (`onerror="handleImageError(this)"`).

---

### Chapter 7 – Testing, Results and Discussion
- **7.1 Testing Methodology:** Black-box manual testing and functional verification.
- **7.2 Test Cases Matrix:** Inclusion of the full 32-case testing table from `docs/testing.md`.
- **7.3 Security Verification:** Proof of SQL injection immunity and unauthorized route rejection.
- **7.4 Responsiveness & Cross-Device Compatibility:** Performance on 360px mobile viewports, tablets, and desktops.
- **7.5 Verification Screenshots:**
  - Home Page Hero & Stats.
  - Explore Foods with active search and filter combinations.
  - Litti Chokha Food Detail view with ingredients and cultural notes.
  - Admin Dashboard and Add/Edit Food Form.

---

### Chapter 8 – IKS Relevance and Contemporary Applications
- **8.1 Preserving Regional Identity:** The role of computer applications in archiving intangible cultural heritage.
- **8.2 Supporting Sustainable Diets:** How highlighting seasonal foods encourages consumption of local, seasonal produce.
- **8.3 Educational Value for Younger Generations:** Making cultural food history engaging and accessible through structured digital media.

---

### Chapter 9 – Limitations and Future Scope
- **9.1 Honest Limitations:** Curated 35-dish prototype, single admin role, avoidance of health claims, and regional variations.
- **9.2 Future Enhancements:** Multilingual support (Hindi), interactive SVG map of India, crowdsourced student submissions with moderation, and PWA offline capabilities.

---

### Conclusion & Final Thoughts
- Concise summary affirming that the project successfully achieved all functional, technical, and academic objectives within the BCA domain.

---

### References & Bibliography
- Inclusion of all 10 verified sources from the database references table, formatted in standard IEEE or APA academic citation style.

---

### Appendix
- **Appendix A:** Complete SQLite Database Schema DDL (`database/schema.sql`).
- **Appendix B:** MySQL 8.0 Compatible Schema (`docs/mysql-schema.sql`).
- **Appendix C:** REST API Specifications (`docs/api-documentation.md`).
