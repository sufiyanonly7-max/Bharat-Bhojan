-- Bharat Bhojan Database Schema (SQLite Reference)
-- Academic Project #25: Traditional Indian Food Knowledge Information System

PRAGMA foreign_keys = ON;

-- 1. REGIONS TABLE
CREATE TABLE IF NOT EXISTS regions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- 2. STATES TABLE
CREATE TABLE IF NOT EXISTS states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    region_id INTEGER NOT NULL,
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE RESTRICT
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- 4. SEASONS TABLE
CREATE TABLE IF NOT EXISTS seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- 5. FOODS TABLE
CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    local_name TEXT,
    slug TEXT NOT NULL UNIQUE,
    state_id INTEGER NOT NULL,
    region_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    short_description TEXT NOT NULL,
    cultural_context TEXT NOT NULL,
    traditional_preparation TEXT NOT NULL,
    seasonality_notes TEXT NOT NULL,
    festival_context TEXT,
    serving_tradition TEXT,
    veg_type TEXT NOT NULL CHECK(veg_type IN ('Vegetarian', 'Non-Vegetarian')),
    image_url TEXT,
    featured INTEGER DEFAULT 0 CHECK(featured IN (0, 1)),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE RESTRICT,
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- 6. INGREDIENTS TABLE
CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- 7. FOOD_INGREDIENTS JUNCTION TABLE (Many-to-Many)
CREATE TABLE IF NOT EXISTS food_ingredients (
    food_id INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    quantity_or_note TEXT,
    is_primary INTEGER DEFAULT 0 CHECK(is_primary IN (0, 1)),
    PRIMARY KEY (food_id, ingredient_id),
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT
);

-- 8. FOOD_SEASONS JUNCTION TABLE (Many-to-Many)
CREATE TABLE IF NOT EXISTS food_seasons (
    food_id INTEGER NOT NULL,
    season_id INTEGER NOT NULL,
    PRIMARY KEY (food_id, season_id),
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE RESTRICT
);

-- 9. REFERENCES TABLE
CREATE TABLE IF NOT EXISTS references_tbl (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT,
    publisher TEXT,
    publication_year INTEGER,
    source_type TEXT NOT NULL,
    url TEXT,
    notes TEXT
);

-- 10. FOOD_REFERENCES JUNCTION TABLE (Many-to-Many)
CREATE TABLE IF NOT EXISTS food_references (
    food_id INTEGER NOT NULL,
    reference_id INTEGER NOT NULL,
    PRIMARY KEY (food_id, reference_id),
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    FOREIGN KEY (reference_id) REFERENCES references_tbl(id) ON DELETE CASCADE
);

-- 11. ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_foods_state ON foods(state_id);
CREATE INDEX IF NOT EXISTS idx_foods_region ON foods(region_id);
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category_id);
CREATE INDEX IF NOT EXISTS idx_foods_slug ON foods(slug);
CREATE INDEX IF NOT EXISTS idx_foods_featured ON foods(featured);
CREATE INDEX IF NOT EXISTS idx_foods_veg_type ON foods(veg_type);
CREATE INDEX IF NOT EXISTS idx_food_ingredients_food ON food_ingredients(food_id);
CREATE INDEX IF NOT EXISTS idx_food_ingredients_ing ON food_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_food_seasons_food ON food_seasons(food_id);
CREATE INDEX IF NOT EXISTS idx_food_seasons_season ON food_seasons(season_id);
