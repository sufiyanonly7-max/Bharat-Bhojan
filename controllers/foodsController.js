/**
 * Bharat Bhojan - Foods Controller
 * Handles food querying, multi-criteria filtering, search, and detail views.
 */

const { queryAll, queryOne, getDb } = require('../config/database');

// Helper to attach seasons to a list of food items
function attachSeasons(foods) {
    if (!foods || foods.length === 0) return foods;

    const foodIds = foods.map(f => f.id);
    const placeholders = foodIds.map(() => '?').join(',');

    const seasonsQuery = `
        SELECT fs.food_id, s.name as season_name
        FROM food_seasons fs
        JOIN seasons s ON fs.season_id = s.id
        WHERE fs.food_id IN (${placeholders})
    `;

    const seasonRows = queryAll(seasonsQuery, foodIds);
    const seasonMap = {};
    seasonRows.forEach(row => {
        if (!seasonMap[row.food_id]) seasonMap[row.food_id] = [];
        seasonMap[row.food_id].push(row.season_name);
    });

    return foods.map(food => ({
        ...food,
        seasons: seasonMap[food.id] || []
    }));
}

/**
 * Get all foods with optional filters and sorting
 * GET /api/foods
 */
function getAllFoods(req, res, next) {
    try {
        const { state, region, season, category, veg_type, sort, featured, q, search } = req.query;
        const searchQuery = (q || search || '').trim();

        let sql = `
            SELECT DISTINCT
                f.id, f.name, f.local_name, f.slug, f.short_description,
                f.veg_type, f.image_url, f.featured, f.created_at,
                s.name AS state_name,
                r.name AS region_name,
                c.name AS category_name
            FROM foods f
            JOIN states s ON f.state_id = s.id
            JOIN regions r ON f.region_id = r.id
            JOIN categories c ON f.category_id = c.id
        `;

        const conditions = [];
        const params = [];

        // Join ingredients if searching text
        if (searchQuery) {
            sql += `
                LEFT JOIN food_ingredients fi ON f.id = fi.food_id
                LEFT JOIN ingredients i ON fi.ingredient_id = i.id
            `;
            const searchPattern = `%${searchQuery}%`;
            conditions.push(`(
                f.name LIKE ?
                OR f.local_name LIKE ?
                OR s.name LIKE ?
                OR r.name LIKE ?
                OR c.name LIKE ?
                OR f.short_description LIKE ?
                OR f.cultural_context LIKE ?
                OR i.name LIKE ?
            )`);
            params.push(
                searchPattern, searchPattern, searchPattern, searchPattern,
                searchPattern, searchPattern, searchPattern, searchPattern
            );
        }

        // Join seasons junction table if filtering by season
        if (season && season.trim() !== '' && season.toLowerCase() !== 'all') {
            sql += `
                JOIN food_seasons fs ON f.id = fs.food_id
                JOIN seasons sn ON fs.season_id = sn.id
            `;
            conditions.push('LOWER(sn.name) = LOWER(?)');
            params.push(season.trim());
        }

        // State filter
        if (state && state.trim() !== '' && state.toLowerCase() !== 'all') {
            conditions.push('(LOWER(s.name) = LOWER(?) OR f.state_id = ?)');
            params.push(state.trim(), isNaN(state) ? 0 : Number(state));
        }

        // Region filter
        if (region && region.trim() !== '' && region.toLowerCase() !== 'all') {
            conditions.push('(LOWER(r.name) = LOWER(?) OR f.region_id = ?)');
            params.push(region.trim(), isNaN(region) ? 0 : Number(region));
        }

        // Category filter
        if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
            conditions.push('(LOWER(c.name) = LOWER(?) OR f.category_id = ?)');
            params.push(category.trim(), isNaN(category) ? 0 : Number(category));
        }

        // Vegetarian / Non-Vegetarian filter
        if (veg_type && veg_type.trim() !== '' && veg_type.toLowerCase() !== 'all') {
            conditions.push('LOWER(f.veg_type) = LOWER(?)');
            params.push(veg_type.trim());
        }

        // Featured flag filter
        if (featured !== undefined && featured !== '') {
            conditions.push('f.featured = ?');
            params.push(Number(featured));
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        // Sorting
        switch (sort) {
            case 'z-a':
                sql += ' ORDER BY f.name DESC';
                break;
            case 'state':
                sql += ' ORDER BY s.name ASC, f.name ASC';
                break;
            case 'newest':
                sql += ' ORDER BY f.id DESC';
                break;
            case 'a-z':
                sql += ' ORDER BY f.name ASC';
                break;
            default:
                if (searchQuery) {
                    sql += ` ORDER BY
                        CASE
                            WHEN LOWER(f.name) LIKE LOWER(?) THEN 1
                            WHEN LOWER(f.name) LIKE LOWER(?) THEN 2
                            WHEN LOWER(s.name) LIKE LOWER(?) THEN 3
                            ELSE 4
                        END,
                        f.name ASC`;
                    params.push(`${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
                } else {
                    sql += ' ORDER BY f.name ASC';
                }
                break;
        }

        const rawFoods = queryAll(sql, params);
        const foods = attachSeasons(rawFoods);

        res.json({
            success: true,
            count: foods.length,
            data: foods
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get featured traditional foods
 * GET /api/foods/featured
 */
function getFeaturedFoods(req, res, next) {
    try {
        const sql = `
            SELECT
                f.id, f.name, f.local_name, f.slug, f.short_description,
                f.veg_type, f.image_url, f.featured,
                s.name AS state_name,
                r.name AS region_name,
                c.name AS category_name
            FROM foods f
            JOIN states s ON f.state_id = s.id
            JOIN regions r ON f.region_id = r.id
            JOIN categories c ON f.category_id = c.id
            WHERE f.featured = 1
            ORDER BY f.name ASC
        `;

        const rawFoods = queryAll(sql);
        const foods = attachSeasons(rawFoods);

        res.json({
            success: true,
            count: foods.length,
            data: foods
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Search foods by query string across name, ingredients, state, region, cultural notes
 * GET /api/foods/search?q=
 */
function searchFoods(req, res, next) {
    try {
        const q = (req.query.q || '').trim();

        if (!q) {
            return res.json({
                success: true,
                query: '',
                count: 0,
                data: []
            });
        }

        const searchPattern = `%${q}%`;

        // Searches across multiple relevant textual fields + joined ingredients
        const sql = `
            SELECT DISTINCT
                f.id, f.name, f.local_name, f.slug, f.short_description,
                f.veg_type, f.image_url, f.featured,
                s.name AS state_name,
                r.name AS region_name,
                c.name AS category_name
            FROM foods f
            JOIN states s ON f.state_id = s.id
            JOIN regions r ON f.region_id = r.id
            JOIN categories c ON f.category_id = c.id
            LEFT JOIN food_ingredients fi ON f.id = fi.food_id
            LEFT JOIN ingredients i ON fi.ingredient_id = i.id
            WHERE
                f.name LIKE ?
                OR f.local_name LIKE ?
                OR s.name LIKE ?
                OR r.name LIKE ?
                OR c.name LIKE ?
                OR f.short_description LIKE ?
                OR f.cultural_context LIKE ?
                OR i.name LIKE ?
            ORDER BY
                CASE
                    WHEN LOWER(f.name) LIKE LOWER(?) THEN 1
                    WHEN LOWER(f.name) LIKE LOWER(?) THEN 2
                    WHEN LOWER(s.name) LIKE LOWER(?) THEN 3
                    ELSE 4
                END,
                f.name ASC
        `;

        const params = [
            searchPattern, searchPattern, searchPattern, searchPattern,
            searchPattern, searchPattern, searchPattern, searchPattern,
            `${q}%`, searchPattern, searchPattern
        ];

        const rawResults = queryAll(sql, params);
        const results = attachSeasons(rawResults);

        res.json({
            success: true,
            query: q,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get detailed food record by slug with ingredients, seasons, references & related dishes
 * GET /api/foods/:slug
 */
function getFoodBySlug(req, res, next) {
    try {
        const { slug } = req.params;

        const foodSql = `
            SELECT
                f.*,
                s.name AS state_name,
                r.name AS region_name,
                r.description AS region_description,
                c.name AS category_name
            FROM foods f
            JOIN states s ON f.state_id = s.id
            JOIN regions r ON f.region_id = r.id
            JOIN categories c ON f.category_id = c.id
            WHERE f.slug = ?
        `;

        const food = queryOne(foodSql, [slug]);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: `Traditional food record not found for: "${slug}"`
            });
        }

        // Fetch ingredients with quantity and primary flag
        const ingredientsSql = `
            SELECT i.id, i.name, fi.quantity_or_note, fi.is_primary
            FROM food_ingredients fi
            JOIN ingredients i ON fi.ingredient_id = i.id
            WHERE fi.food_id = ?
            ORDER BY fi.is_primary DESC, i.name ASC
        `;
        const ingredients = queryAll(ingredientsSql, [food.id]);

        // Fetch seasons
        const seasonsSql = `
            SELECT s.id, s.name, s.description
            FROM food_seasons fs
            JOIN seasons s ON fs.season_id = s.id
            WHERE fs.food_id = ?
            ORDER BY s.id ASC
        `;
        const seasons = queryAll(seasonsSql, [food.id]);

        // Fetch references
        const referencesSql = `
            SELECT r.id, r.title, r.author, r.publisher, r.publication_year, r.source_type, r.url, r.notes
            FROM food_references fr
            JOIN references_tbl r ON fr.reference_id = r.id
            WHERE fr.food_id = ?
            ORDER BY r.title ASC
        `;
        const references = queryAll(referencesSql, [food.id]);

        // Fetch related dishes (same category or region, excluding current food)
        const relatedSql = `
            SELECT
                f.id, f.name, f.local_name, f.slug, f.image_url, f.veg_type,
                s.name AS state_name,
                c.name AS category_name
            FROM foods f
            JOIN states s ON f.state_id = s.id
            JOIN categories c ON f.category_id = c.id
            WHERE (f.category_id = ? OR f.region_id = ?)
              AND f.id != ?
            ORDER BY RANDOM()
            LIMIT 3
        `;
        const relatedDishes = queryAll(relatedSql, [food.category_id, food.region_id, food.id]);

        res.json({
            success: true,
            data: {
                ...food,
                ingredients,
                seasons,
                references,
                related_dishes: relatedDishes
            }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllFoods,
    getFeaturedFoods,
    searchFoods,
    getFoodBySlug
};
