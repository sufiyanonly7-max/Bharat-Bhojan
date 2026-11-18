-- Bharat Bhojan Database Schema (MySQL 8.0+ Compatible)
-- Academic Project #25: Traditional Indian Food Knowledge Information System
-- Note: Created for viva demonstration and optional migration to MySQL/MariaDB.

CREATE DATABASE IF NOT EXISTS bharat_bhojan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bharat_bhojan;

SET foreign_key_checks = 1;

-- 1. REGIONS TABLE
CREATE TABLE IF NOT EXISTS regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. STATES TABLE
CREATE TABLE IF NOT EXISTS states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    region_id INT NOT NULL,
    CONSTRAINT fk_states_region FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. SEASONS TABLE
CREATE TABLE IF NOT EXISTS seasons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. FOODS TABLE
CREATE TABLE IF NOT EXISTS foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    local_name VARCHAR(150),
    slug VARCHAR(180) NOT NULL UNIQUE,
    state_id INT NOT NULL,
    region_id INT NOT NULL,
    category_id INT NOT NULL,
    short_description TEXT NOT NULL,
    cultural_context TEXT NOT NULL,
    traditional_preparation TEXT NOT NULL,
    seasonality_notes TEXT NOT NULL,
    festival_context TEXT,
    serving_tradition TEXT,
    veg_type ENUM('Vegetarian', 'Non-Vegetarian') NOT NULL,
    image_url VARCHAR(255),
    featured TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_foods_state FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE RESTRICT,
    CONSTRAINT fk_foods_region FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE RESTRICT,
    CONSTRAINT fk_foods_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. INGREDIENTS TABLE
CREATE TABLE IF NOT EXISTS ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. FOOD_INGREDIENTS JUNCTION TABLE (Many-to-Many)
CREATE TABLE IF NOT EXISTS food_ingredients (
    food_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity_or_note VARCHAR(150),
    is_primary TINYINT(1) DEFAULT 0,
    PRIMARY KEY (food_id, ingredient_id),
    CONSTRAINT fk_fi_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    CONSTRAINT fk_fi_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. FOOD_SEASONS JUNCTION TABLE (Many-to-Many)
CREATE TABLE IF NOT EXISTS food_seasons (
    food_id INT NOT NULL,
    season_id INT NOT NULL,
    PRIMARY KEY (food_id, season_id),
    CONSTRAINT fk_fs_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    CONSTRAINT fk_fs_season FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. REFERENCES TABLE
CREATE TABLE IF NOT EXISTS references_tbl (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(200),
    publisher VARCHAR(200),
    publication_year INT,
    source_type VARCHAR(100) NOT NULL,
    url VARCHAR(500),
    notes TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. FOOD_REFERENCES JUNCTION TABLE (Many-to-Many)
CREATE TABLE IF NOT EXISTS food_references (
    food_id INT NOT NULL,
    reference_id INT NOT NULL,
    PRIMARY KEY (food_id, reference_id),
    CONSTRAINT fk_fr_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    CONSTRAINT fk_fr_reference FOREIGN KEY (reference_id) REFERENCES references_tbl(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INDEXES
CREATE INDEX idx_foods_state ON foods(state_id);
CREATE INDEX idx_foods_region ON foods(region_id);
CREATE INDEX idx_foods_category ON foods(category_id);
CREATE INDEX idx_foods_slug ON foods(slug);
CREATE INDEX idx_foods_featured ON foods(featured);
CREATE INDEX idx_foods_veg_type ON foods(veg_type);
CREATE INDEX idx_food_ingredients_food ON food_ingredients(food_id);
CREATE INDEX idx_food_ingredients_ing ON food_ingredients(ingredient_id);
CREATE INDEX idx_food_seasons_food ON food_seasons(food_id);
CREATE INDEX idx_food_seasons_season ON food_seasons(season_id);
