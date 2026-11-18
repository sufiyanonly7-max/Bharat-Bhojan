# 5–7 Minute Viva Project Demonstration Script
**Bharat Bhojan – Traditional Indian Food Knowledge Information System**  
*Academic Project #25 | Presentation & Live Demonstration Guide*

---

### Step 1: Introduction & Problem Statement (0:00 – 0:45)
> "Good morning / afternoon, respected examiners.  
> My name is [Your Name], and for my BCA 5th-Semester Academic Project #25, I have developed **Bharat Bhojan – Traditional Indian Food Knowledge Information System**.  
> The problem we are addressing is that while thousands of recipe blogs exist online, traditional Indian culinary knowledge—which is deeply connected to regional geography, seasonal cycles (Ritu-Charya), native ingredients, and centuries-old cultural traditions—is fragmented across rare books and oral memories.  
> Our project demonstrates how relational database design and web development can structure and preserve this cultural knowledge in a fast, searchable, educational portal."

---

### Step 2: Show Landing Page & Architecture (0:45 – 1:30)
> *"Let us open the application running locally at `http://localhost:3000`."*  
> *(Show Homepage in browser)*  
> "This is our landing page. Notice the clean, warm earthy aesthetic inspired by traditional Indian terracotta pottery and spices, designed without heavy commercial frameworks.  
> At the top, we display live platform metrics retrieved directly from our database via an API call: over 35 cataloged dishes, 20+ represented states, 6 geographical zones, and verified citations.  
> Below, we showcase featured traditional dishes, an Indian regional zone overview, and seasonal highlights."

---

### Step 3: Browse Foods & Search Functionality (1:30 – 2:30)
> *"Now let us navigate to the Explore Foods page."*  
> *(Click 'Explore Foods' in navbar)*  
> "Here, our client-side JavaScript calls `GET /api/foods` and renders all database dishes as interactive cards.  
> Notice our real-time search system. If I type **'Litti Chokha'** in the search bar..."  
> *(Type 'Litti Chokha' in search box)*  
> "The input is debounced for 300 milliseconds to prevent server flooding. The backend executes a parameterized SQL query searching across dish names, native Devanagari script, ingredients, and cultural notes.  
> We can also search by ingredient. For instance, typing **'sattu'** displays all dishes utilizing roasted gram flour."

---

### Step 4: Multi-Criteria Filtering (2:30 – 3:15)
> *"Let us test our database-backed multi-criteria filtering."*  
> *(Select State: 'Bihar' and Season: 'Winter')*  
> "When I select State as 'Bihar' and Season as 'Winter', the frontend calls `/api/foods?state=Bihar&season=Winter`.  
> The backend controller joins the `foods`, `states`, `food_seasons`, and `seasons` tables using a prepared SQL query.  
> The results instantly filter down to the 4 dishes that satisfy both criteria: *Litti Chokha*, *Thekua*, *Dal Pittha*, and *Gaya Tilkut*.  
> If I click 'Reset All Filters', the state clears and all 35 dishes reload."

---

### Step 5: Food Detail View & Cultural Context (3:15 – 4:15)
> *"Now let us inspect a detailed record by clicking 'View Details' on Litti Chokha."*  
> *(Open Litti Chokha detail view)*  
> "This page demonstrates our database relationships:  
> 1. In the header, we see the standard name alongside its authentic Devanagari script (लिट्टी चोखा), origin state, region, category, and dietary indicator.  
> 2. On the right, our Many-to-Many junction table displays the exact ingredients (Sattu, Whole Wheat, Mustard Oil, Ghee) with quantities and 'Key' ingredient flags.  
> 3. In the narrative section, we explain its historical background as sustainable rations for farmers and soldiers in Magadh and Bhojpur.  
> 4. Notice our **Academic Callout**: we explicitly document that recipes and spice balances naturally vary across communities and households, avoiding unsupported claims of a 'single authentic recipe'.  
> 5. At the bottom, we cite credible sources like K.T. Achaya's *Historical Dictionary of Indian Food* and official tourism archives, followed by dynamically queried related dishes."

---

### Step 6: Database Normalization & Admin Portal (4:15 – 5:30)
> *"Let us now inspect the administrative functionality and database management."*  
> *(Navigate to `/admin/login.html`)*  
> "The admin portal is protected by session-based authentication. If an unauthenticated user tries to access `/admin/dashboard.html`, our Express middleware automatically redirects them back to login.  
> Let us sign in using `admin` and `admin123`."  
> *(Submit login form; dashboard appears)*  
> "The dashboard displays real-time statistics and a management table.  
> Notice that passwords are never stored in plain text—they are hashed using **bcrypt** with a salt factor of 10.  
> Let us click 'Add New Food Record' to demonstrate a full database insertion."  
> *(Open Add Food Form, fill sample test dish, and save)*  
> "When we save, the controller opens a database transaction: it inserts the food, synchronizes the ingredients in `food_ingredients`, links the seasons, and commits.  
> The new dish appears immediately in our dashboard table and on the public website.  
> If we click 'Delete', a confirmation prompt guards against accidental removal, and SQLite's `ON DELETE CASCADE` foreign keys safely clean up all junction records."

---

### Step 7: Technology Stack & Conclusion (5:30 – 6:30)
> "To summarize our technology stack:  
> - **Frontend:** Semantic HTML5, modern CSS3 with custom properties and responsive media queries, and Vanilla JavaScript with zero heavy frameworks.  
> - **Backend:** Node.js with Express.js implementing a clean RESTful MVC pattern.  
> - **Database:** Normalized 3NF SQLite database using Node's native `DatabaseSync` engine, parameterized SQL queries to prevent SQL Injection, and foreign key constraints.  
> 
> In the future, we plan to introduce Hindi multilingual support, an interactive SVG map of India, and public community submissions with moderation.  
> 
> Thank you, examiners. I am now ready for your questions."
