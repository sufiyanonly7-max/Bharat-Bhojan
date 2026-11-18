# Software Quality Assurance & Testing Report
**Bharat Bhojan – Traditional Indian Food Knowledge Information System**  
*Academic Project #25 | Technology Domain: Software Verification and Validation*

---

## 1. Testing Strategy & Scope

The testing strategy for **Bharat Bhojan** encompasses:
1. **Functional Testing:** Verifying all core end-user journeys (navigation, searching, filtering, detail loading, and related dish linking).
2. **Administrative Security Testing:** Verifying session authentication, route protection middleware, password hashing, and input validation.
3. **Database Integrity & Transaction Testing:** Verifying referential constraints, cascading deletes, and parameterization against SQL Injection.
4. **Responsive UI/UX Testing:** Testing across mobile viewports (360px), tablets (768px), laptops (1024px), and desktops (1440px).
5. **Error & Edge-Case Handling:** Testing invalid routes, nonexistent slugs, broken image fallbacks, and zero-result search states.

---

## 2. Test Execution Matrix

| Test ID | Module | Test Case | Input / Action | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Navigation | Home Page Load | Navigate to `http://localhost:3000/` | Landing page renders with hero title, search box, live statistics counters, and 6 featured dishes. | Rendered smoothly with zero console errors. | **PASS** |
| **TC-02** | Navigation | Desktop Nav Links | Click "Explore Foods", "Regions", "Seasonal", "About", "References" | Correct views load and active page is highlighted in the navigation bar. | Page loads instantaneously; active class updates. | **PASS** |
| **TC-03** | Navigation | Mobile Hamburger Menu | Click `☰` button on viewport width < 768px | Mobile menu drawer toggles open with full-width navigation links; icon switches to `✕`. | Toggles cleanly without page reflow issues. | **PASS** |
| **TC-04** | Explorer | Default Food Listing | Open `explore.html` with no query parameters | Loads all 37 traditional dishes from SQLite database with result count ("Showing 37 traditional dishes"). | 37 food cards rendered with images and badges. | **PASS** |
| **TC-05** | Search | Direct Keyword Search | Enter "Litti Chokha" in search box | System debounces (300ms) and renders Litti Chokha card matching name. | Returns Litti Chokha card immediately. | **PASS** |
| **TC-06** | Search | Ingredient Search | Enter "sattu" in search box | Matches dishes containing "sattu" (e.g. Litti Chokha, Sattu Ghol). | Returns all dishes utilizing sattu. | **PASS** |
| **TC-07** | Search | Zero Results Search | Enter "PizzaBurgerRandomXYZ" in search box | Empty state card appears with icon, explanatory message, and "Reset All Filters" button. | Displays "No Matching Traditional Foods" message. | **PASS** |
| **TC-08** | Filters | State Filter | Select State = "Bihar" | Grid updates to show 8 traditional dishes originating from Bihar. | Exactly 8 Bihar dishes displayed. | **PASS** |
| **TC-09** | Filters | Region Filter | Select Zone = "South India" | Grid updates to display South Indian dishes (Idli, Sambar, Chettinad Chicken, Appam, Avial, Bisi Bele Bath, Haleem). | Correctly displays South Indian dishes. | **PASS** |
| **TC-10** | Filters | Season Filter | Select Season = "Winter" | Grid updates to display dishes associated with winter harvest (Saag, Tilkut, Litti, Siddu, Thukpa, Bagiya). | Winter dishes accurately filtered. | **PASS** |
| **TC-11** | Filters | Combined Filters | State = "Bihar" AND Season = "Winter" | Grid filters dishes satisfying both criteria simultaneously (`state_id` AND `food_seasons`). | Displays 4 matching dishes (Dal Pittha, Tilkut, Litti, Thekua). | **PASS** |
| **TC-12** | Filters | Reset Filters Button | Click "Reset All Filters" | Search box and all dropdowns reset to default; full 37 dishes reload. | State clears and all 37 dishes re-render. | **PASS** |
| **TC-13** | Detail | Valid Food Details | Click "View Details" on Litti Chokha (`/food.html?slug=litti-chokha`) | Loads food title, native script (लिट्टी चोखा), image, full narrative, ingredients with primary badges, and citations. | Full record rendered with related dishes. | **PASS** |
| **TC-14** | Detail | Nonexistent Food Slug | Navigate to `/food.html?slug=nonexistent-dish-xyz` | Renders a styled 404 message ("Dish Record Not Found") with a button to return to explore. | Graceful error state shown; no JS crash. | **PASS** |
| **TC-15** | Detail | Household Variations Callout | Inspect cultural context block on food detail view | Explicit academic note stating that recipes vary across communities and households. | Callout alert clearly visible. | **PASS** |
| **TC-16** | Regions | Regional Zone Explorer | Click "North-East India" tab on `regions.html` | Displays regional ecological narrative, represented states (Assam, Nagaland, Manipur, Sikkim), and 5 dishes. | Switches cleanly without page refresh. | **PASS** |
| **TC-17** | Seasonal | Seasonal Rhythms Page | Click "Monsoon" tab on `seasonal.html` | Displays Ritu narrative and dishes associated with monsoon (Bhutte Ka Kees, Haleem, Kadhi Pakora). | Correct dishes rendered. | **PASS** |
| **TC-18** | Security | Admin Login Success | Submit username `admin`, password `admin123` at `/admin/login.html` | bcrypt verification succeeds; creates server session; redirects to `/admin/dashboard.html`. | Logged in successfully; redirected to dashboard. | **PASS** |
| **TC-19** | Security | Admin Login Failure | Submit username `admin`, password `wrongpass` | Returns HTTP 401 with "Invalid username or password" alert; session not created. | Displays error alert; stays on login page. | **PASS** |
| **TC-20** | Security | Unauthenticated Access | Direct browser navigation to `/admin/dashboard.html` without session | Server middleware blocks request and redirects user to `/admin/login.html`. | Redirects immediately to login page. | **PASS** |
| **TC-21** | Security | API Route Protection | `POST /api/admin/foods` without session cookie | Returns HTTP 401 Unauthorized `{ success: false, message: "Access denied..." }`. | Request rejected with 401 status code. | **PASS** |
| **TC-22** | Admin CRUD | Create New Food | Fill Add Food Form with test dish "Mithila Bagiya" and submit | Inserts record into `foods` and junction tables; returns HTTP 201; redirects to dashboard. | New dish added; visible in dashboard and explore. | **PASS** |
| **TC-23** | Admin CRUD | Edit Existing Food | Edit "Mithila Bagiya" to update description and save | Executes SQL UPDATE and syncs junction tables; changes persist. | Updated description reflected in database. | **PASS** |
| **TC-24** | Admin CRUD | Delete Food with Confirm | Click "Delete" on "Mithila Bagiya" and confirm prompt | Deletes record from `foods`; cascading foreign keys remove junction rows; table refreshes. | Record permanently deleted. | **PASS** |
| **TC-25** | Admin Form | Input Validation | Submit form with empty required field (e.g. missing name or state) | HTML5 and server-side validation reject submission with explicit error message. | Submission blocked; error message displayed. | **PASS** |
| **TC-26** | Security | SQL Injection Prevention | Enter `' OR '1'='1` in search input | Query executes via parameterized statement (`LIKE ?`); treated as literal search string; no SQL error. | Safely returned 0 results; no database exploit. | **PASS** |
| **TC-27** | Resilience | Broken Image Fallback | Force image error via invalid URL (`/assets/images/invalid.jpg`) | `onerror="handleImageError(this)"` catches event and swaps `src` to local SVG placeholder. | Swaps to placeholder SVG; no broken image icon. | **PASS** |
| **TC-28** | Error Handling | Invalid Web Page 404 | Navigate to `http://localhost:3000/random-page-does-not-exist` | Custom styled 404 HTML page rendered with links to Return Home or Search Foods. | Custom 404 HTML page displayed. | **PASS** |
| **TC-29** | Error Handling | Invalid API Endpoint 404 | `GET /api/nonexistent-endpoint` | Returns HTTP 404 JSON response `{ success: false, error: { message: "API endpoint not found..." } }`. | Clean JSON 404 envelope returned. | **PASS** |
| **TC-30** | Responsive | Mobile Viewport (360px) | Emulate 360px × 640px in Chrome DevTools | No horizontal scrollbar; cards collapse to single column; touch targets > 44px; fonts readable. | Clean mobile layout with zero overflow. | **PASS** |
| **TC-31** | Responsive | Tablet Viewport (768px) | Emulate 768px × 1024px in Chrome DevTools | Two-column grid layout; navigation displays cleanly; filter toolbar wraps comfortably. | Responsive grid adapts seamlessly. | **PASS** |
| **TC-32** | Persistence | Server Restart Persistence | Stop server process and restart with `npm start` | SQLite database persists all seeded and newly created records without data loss. | Database file `bharat_bhojan.db` maintains all data. | **PASS** |

---

## 3. Automated End-to-End Test Suite (`test-system.js`)

In addition to manual test cases, the project includes an automated end-to-end integration test suite in `test-system.js`.

### How to Run:
```bash
node test-system.js
```

### Automated Assertions:
- **Total Assertions Executed:** 43
- **Test Scenarios Covered:** 23
- **Passed Assertions:** 43 (100%)
- **Failed Assertions:** 0 (0%)
- **Key Modules Validated Programmatically:**
  1. Static HTML serving: `/`, `/explore.html`, `/food.html?slug=litti-chokha`, `/regions.html`, `/seasonal.html`, `/about.html`, `/references.html`.
  2. Public API endpoints: `/api/stats`, `/api/foods/featured`, `/api/foods/search`, `/api/foods/:slug`.
  3. Multi-criteria filtering: `?state=Bihar&season=Winter`.
  4. Authentication guards: Unauthorized access to `/api/admin/dashboard` returning HTTP 401.
  5. Password validation: Invalid password rejection (HTTP 401) and valid credentials session creation (HTTP 200).
  6. Transactional CRUD lifecycle: Creating a test food, verifying public slug accessibility, updating the record, deleting the record, and verifying cascade deletion.
  7. Centralized error handling: Nonexistent API routes returning structured JSON 404 and web routes returning custom HTML 404.

---

## 4. Testing Summary & Conclusion

- **Total Manual Test Cases:** 32 (100% Pass)
- **Total Automated Assertions:** 43 (100% Pass)
- **System Stability:** Verified solid across database integrity, referential constraints, API security, and responsive UI rendering.
