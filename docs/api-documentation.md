# REST API Documentation
**Bharat Bhojan – Traditional Indian Food Knowledge Information System**  
*Academic Project #25 | Technology Domain: Web Services & Backend Architecture*

---

## 1. API Architecture Overview

The Bharat Bhojan API is designed following REST principles:
- **Base URL:** `http://localhost:3000/api`
- **Data Format:** All requests and responses use `application/json; charset=utf-8`.
- **Query Parameter Safety:** All SQL operations utilize prepared statements with parameterized inputs (`?`).
- **Standard Response Envelope:** Consistent JSON structure:
  ```json
  {
    "success": true,
    "count": 1,
    "data": { ... }
  }
  ```
- **Error Response Envelope:**
  ```json
  {
    "success": false,
    "error": {
      "message": "Human-readable explanation of error.",
      "status": 404
    }
  }
  ```

---

## 2. Standard HTTP Status Codes

| Code | Status | Meaning |
| :--- | :--- | :--- |
| `200` | OK | Successful GET, PUT, or DELETE request. |
| `201` | Created | Successful POST creation of a new food record. |
| `400` | Bad Request | Missing required fields or invalid input payload. |
| `401` | Unauthorized | Protected endpoint accessed without an active admin session. |
| `404` | Not Found | Requested food slug, ID, or route does not exist. |
| `500` | Internal Server Error | Unhandled server error (caught by central error middleware). |

---

## 3. Public API Endpoints

### 3.1. Query Foods with Multi-Filter
`GET /api/foods`

Retrieves a list of traditional dishes matching query filters and sort criteria.

**Query Parameters:**
- `state` (optional): Filter by state name (e.g. `Bihar`, `Punjab`) or state ID.
- `region` (optional): Filter by geographical zone (e.g. `East India`, `South India`).
- `season` (optional): Filter by season (e.g. `Winter`, `Summer`, `Monsoon`).
- `category` (optional): Filter by category (e.g. `Main Dish`, `Sweet & Confectionery`).
- `veg_type` (optional): `Vegetarian` or `Non-Vegetarian`.
- `featured` (optional): `1` or `0`.
- `sort` (optional): `a-z` (default), `z-a`, `state`, or `newest`.

**Sample Request:**
```http
GET /api/foods?state=Bihar&season=Winter&veg_type=Vegetarian HTTP/1.1
Host: localhost:3000
```

**Sample Response (200 OK):**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 5,
      "name": "Dal Pittha (Bagiya)",
      "local_name": "दाल पिठ्ठा / बगिया (Bagiya)",
      "slug": "dal-pittha",
      "short_description": "Traditional steamed rice dumplings stuffed with seasoned coarse Bengal gram...",
      "veg_type": "Vegetarian",
      "image_url": "/assets/images/dal-pittha.svg",
      "featured": 0,
      "state_name": "Bihar",
      "region_name": "East India",
      "category_name": "Main Dish",
      "seasons": ["Winter"]
    },
    {
      "id": 1,
      "name": "Litti Chokha",
      "local_name": "लिट्टी चोखा",
      "slug": "litti-chokha",
      "short_description": "Rustic roasted whole-wheat balls stuffed with spiced roasted gram flour...",
      "veg_type": "Vegetarian",
      "image_url": "/assets/images/litti-chokha.svg",
      "featured": 1,
      "state_name": "Bihar",
      "region_name": "East India",
      "category_name": "Main Dish",
      "seasons": ["Winter", "Year-round"]
    }
  ]
}
```

---

### 3.2. Featured Foods
`GET /api/foods/featured`

Retrieves traditional dishes highlighted for the landing page showcase (`featured = 1`).

**Sample Response (200 OK):**
```json
{
  "success": true,
  "count": 12,
  "data": [ ... ]
}
```

---

### 3.3. Textual Search
`GET /api/foods/search?q=:query`

Executes multi-field textual search across food name, native script, state name, region name, category, short description, cultural notes, and ingredients.

**Sample Request:**
```http
GET /api/foods/search?q=sattu HTTP/1.1
```

**Sample Response (200 OK):**
```json
{
  "success": true,
  "query": "sattu",
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Litti Chokha",
      "local_name": "लिट्टी चोखा",
      "slug": "litti-chokha",
      "state_name": "Bihar",
      "region_name": "East India",
      "category_name": "Main Dish",
      "seasons": ["Winter", "Year-round"]
    },
    {
      "id": 3,
      "name": "Sattu Ghol (Sharbat)",
      "local_name": "सत्तू का घोल / सत्तू शरबत",
      "slug": "sattu-ghol",
      "state_name": "Bihar",
      "region_name": "East India",
      "category_name": "Beverage",
      "seasons": ["Summer"]
    }
  ]
}
```

---

### 3.4. Single Food Detailed Record
`GET /api/foods/:slug`

Retrieves complete information for a specific traditional dish, including its joined ingredients, seasons, bibliographic citations, and related regional dishes.

**Sample Request:**
```http
GET /api/foods/litti-chokha HTTP/1.1
```

**Sample Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Litti Chokha",
    "local_name": "लिट्टी चोखा",
    "slug": "litti-chokha",
    "state_id": 1,
    "region_id": 1,
    "category_id": 1,
    "short_description": "Rustic roasted whole-wheat balls stuffed with spiced roasted gram flour...",
    "cultural_context": "Litti Chokha is the quintessential culinary symbol of the Magadh and Bhojpur regions...",
    "traditional_preparation": "Whole wheat flour is kneaded into a pliable dough...",
    "seasonality_notes": "Relished year-round, but holds special reverence in the crisp winter months...",
    "festival_context": "Prepared during regional festivities, family reunions...",
    "serving_tradition": "Served hot by crushing the litti slightly with fingers and soaking it in melted desi ghee...",
    "veg_type": "Vegetarian",
    "image_url": "/assets/images/litti-chokha.svg",
    "featured": 1,
    "state_name": "Bihar",
    "region_name": "East India",
    "category_name": "Main Dish",
    "ingredients": [
      {
        "id": 1,
        "name": "Sattu (Roasted Gram Flour)",
        "quantity_or_note": "2 cups",
        "is_primary": 1
      },
      {
        "id": 2,
        "name": "Whole Wheat Flour",
        "quantity_or_note": "3 cups",
        "is_primary": 1
      }
    ],
    "seasons": [
      { "id": 4, "name": "Winter", "description": "Shishir & Hemant Ritu..." },
      { "id": 6, "name": "Year-round", "description": "Timeless staples..." }
    ],
    "references": [
      {
        "id": 1,
        "title": "A Historical Dictionary of Indian Food",
        "author": "K. T. Achaya",
        "publisher": "Oxford University Press",
        "publication_year": 1998,
        "source_type": "Academic Book"
      }
    ],
    "related_dishes": [
      { "id": 5, "name": "Dal Pittha (Bagiya)", "slug": "dal-pittha", "state_name": "Bihar" }
    ]
  }
}
```

---

### 3.5. Metadata Endpoints

- `GET /api/states`: List all states with region names and represented food counts.
- `GET /api/regions`: List 6 geographical zones with state lists and food counts.
- `GET /api/categories`: List all food categories with dish counts.
- `GET /api/seasons`: List all seasons with linked food counts.
- `GET /api/references`: List all bibliographic sources with citation counts.
- `GET /api/stats`: High-level aggregate metrics for landing page counters.

---

## 4. Administrator Protected Endpoints

### 4.1. Admin Login
`POST /api/admin/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Authentication successful. Welcome to Admin Portal.",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

---

### 4.2. Admin Logout
`POST /api/admin/logout`

Destroys the server-side session and clears the cookie.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

### 4.3. Admin Dashboard Overview
`GET /api/admin/dashboard`  
*(Requires active session)*

Returns summary statistics and the full list of food records for the management table.

---

### 4.4. Create Food Record
`POST /api/admin/foods`  
*(Requires active session)*

**Request Body:**
```json
{
  "name": "Pittha",
  "local_name": "पिठ्ठा",
  "state_id": 1,
  "category_id": 1,
  "veg_type": "Vegetarian",
  "featured": 0,
  "image_url": "/assets/images/placeholder.svg",
  "short_description": "Traditional steamed dumplings of eastern India.",
  "cultural_context": "Deeply linked to rural harvest traditions.",
  "traditional_preparation": "Rice flour dough steamed over boiling water.",
  "seasonality_notes": "Traditionally made during winter harvest.",
  "ingredients": [
    { "name": "Rice Flour", "quantity": "2 cups", "is_primary": 1 },
    { "name": "Chana Dal", "quantity": "1 cup", "is_primary": 1 }
  ],
  "seasons": [4],
  "references": [1]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Food record \"Pittha\" created successfully.",
  "data": {
    "id": 36,
    "slug": "pittha"
  }
}
```

---

### 4.5. Update Food Record
`PUT /api/admin/foods/:id`  
*(Requires active session)*

Updates fields in `foods` and synchronizes junction tables (`food_ingredients`, `food_seasons`, `food_references`) within a database transaction.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Food record #36 (\"Pittha\") updated successfully."
}
```

---

### 4.6. Delete Food Record
`DELETE /api/admin/foods/:id`  
*(Requires active session)*

Deletes the food record. Database cascading automatically removes associated entries in junction tables.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Food record \"Pittha\" (ID #36) was permanently deleted."
}
```
