/**
 * Bharat Bhojan - Administrator Controller
 * Handles administrative authentication, dashboard metrics, and full CRUD operations.
 */

const bcrypt = require('bcryptjs');
const { queryOne, queryAll, execute, transaction, getDb } = require('../config/database');

/**
 * Generate a URL-friendly slug from food name
 */
function generateSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

/**
 * Admin Login Handler
 * POST /api/admin/login
 */
function login(req, res, next) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Both username and password are required.'
            });
        }

        const admin = queryOne('SELECT * FROM admins WHERE username = ?', [username.trim()]);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password.'
            });
        }

        const isMatch = bcrypt.compareSync(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password.'
            });
        }

        // Establish session
        req.session.adminUser = {
            id: admin.id,
            username: admin.username
        };

        res.json({
            success: true,
            message: 'Authentication successful. Welcome to Admin Portal.',
            user: {
                id: admin.id,
                username: admin.username
            }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Admin Logout Handler
 * POST /api/admin/logout
 */
function logout(req, res, next) {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid');
        res.json({
            success: true,
            message: 'Logged out successfully.'
        });
    });
}

/**
 * Verify Session Status
 * GET /api/admin/check-auth
 */
function checkAuth(req, res) {
    if (req.session && req.session.adminUser) {
        return res.json({
            authenticated: true,
            user: req.session.adminUser
        });
    }
    res.json({
        authenticated: false
    });
}

/**
 * Admin Dashboard Statistics & Foods Management Table
 * GET /api/admin/dashboard
 */
function getDashboard(req, res, next) {
    try {
        // Summary Counts
        const totalFoods = queryOne('SELECT COUNT(*) AS c FROM foods').c;
        const totalStates = queryOne('SELECT COUNT(DISTINCT state_id) AS c FROM foods').c;
        const totalRegions = queryOne('SELECT COUNT(DISTINCT region_id) AS c FROM foods').c;
        const totalCategories = queryOne('SELECT COUNT(*) AS c FROM categories').c;
        const totalReferences = queryOne('SELECT COUNT(*) AS c FROM references_tbl').c;
        const totalVegetarian = queryOne("SELECT COUNT(*) AS c FROM foods WHERE veg_type = 'Vegetarian'").c;
        const totalNonVegetarian = queryOne("SELECT COUNT(*) AS c FROM foods WHERE veg_type = 'Non-Vegetarian'").c;

        // All foods list for administrative data table
        const foodsSql = `
            SELECT
                f.id, f.name, f.local_name, f.slug, f.veg_type, f.featured, f.image_url,
                s.name AS state_name,
                r.name AS region_name,
                c.name AS category_name,
                f.created_at, f.updated_at
            FROM foods f
            JOIN states s ON f.state_id = s.id
            JOIN regions r ON f.region_id = r.id
            JOIN categories c ON f.category_id = c.id
            ORDER BY f.id DESC
        `;
        const foods = queryAll(foodsSql);

        res.json({
            success: true,
            data: {
                stats: {
                    total_foods: totalFoods,
                    total_states: totalStates,
                    total_regions: totalRegions,
                    total_categories: totalCategories,
                    total_references: totalReferences,
                    vegetarian_foods: totalVegetarian,
                    non_vegetarian_foods: totalNonVegetarian
                },
                foods: foods
            }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get single food by ID (for administrative edit form)
 * GET /api/admin/foods/:id
 */
function getFoodById(req, res, next) {
    try {
        const { id } = req.params;
        const food = queryOne('SELECT * FROM foods WHERE id = ?', [id]);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: `Food record #${id} not found.`
            });
        }

        // Get ingredients
        const ingredients = queryAll(`
            SELECT i.id, i.name, fi.quantity_or_note, fi.is_primary
            FROM food_ingredients fi
            JOIN ingredients i ON fi.ingredient_id = i.id
            WHERE fi.food_id = ?
        `, [id]);

        // Get seasons (IDs and names)
        const seasons = queryAll(`
            SELECT s.id, s.name
            FROM food_seasons fs
            JOIN seasons s ON fs.season_id = s.id
            WHERE fs.food_id = ?
        `, [id]);

        // Get references (IDs and titles)
        const references = queryAll(`
            SELECT r.id, r.title
            FROM food_references fr
            JOIN references_tbl r ON fr.reference_id = r.id
            WHERE fr.food_id = ?
        `, [id]);

        res.json({
            success: true,
            data: {
                ...food,
                ingredients,
                seasons: seasons.map(s => s.id),
                references: references.map(r => r.id)
            }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Create a new traditional food record
 * POST /api/admin/foods
 */
function createFood(req, res, next) {
    try {
        const {
            name, local_name, state_id, category_id,
            short_description, cultural_context, traditional_preparation,
            seasonality_notes, festival_context, serving_tradition,
            veg_type, image_url, featured,
            ingredients, seasons, references
        } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Food name is required.' });
        }
        if (!state_id) {
            return res.status(400).json({ success: false, message: 'State selection is required.' });
        }
        if (!category_id) {
            return res.status(400).json({ success: false, message: 'Category selection is required.' });
        }
        if (!short_description || !short_description.trim()) {
            return res.status(400).json({ success: false, message: 'Short description is required.' });
        }
        if (!cultural_context || !cultural_context.trim()) {
            return res.status(400).json({ success: false, message: 'Cultural context is required.' });
        }
        if (!traditional_preparation || !traditional_preparation.trim()) {
            return res.status(400).json({ success: false, message: 'Traditional preparation method is required.' });
        }
        if (!seasonality_notes || !seasonality_notes.trim()) {
            return res.status(400).json({ success: false, message: 'Seasonality notes are required.' });
        }
        if (!['Vegetarian', 'Non-Vegetarian'].includes(veg_type)) {
            return res.status(400).json({ success: false, message: 'Valid dietary classification (Vegetarian or Non-Vegetarian) is required.' });
        }

        // Determine Region from State
        const stateRecord = queryOne('SELECT region_id FROM states WHERE id = ?', [state_id]);
        if (!stateRecord) {
            return res.status(400).json({ success: false, message: 'Selected state does not exist.' });
        }
        const region_id = stateRecord.region_id;

        // Generate unique slug
        let baseSlug = generateSlug(name);
        let slug = baseSlug;
        let counter = 1;
        while (queryOne('SELECT id FROM foods WHERE slug = ?', [slug])) {
            slug = `${baseSlug}-${counter++}`;
        }

        const foodResult = transaction(() => {
            // Insert food record
            const insertFoodSql = `
                INSERT INTO foods (
                    name, local_name, slug, state_id, region_id, category_id,
                    short_description, cultural_context, traditional_preparation,
                    seasonality_notes, festival_context, serving_tradition,
                    veg_type, image_url, featured
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const result = execute(insertFoodSql, [
                name.trim(),
                (local_name || '').trim(),
                slug,
                Number(state_id),
                Number(region_id),
                Number(category_id),
                short_description.trim(),
                cultural_context.trim(),
                traditional_preparation.trim(),
                seasonality_notes.trim(),
                (festival_context || '').trim(),
                (serving_tradition || '').trim(),
                veg_type,
                (image_url || '/assets/images/placeholder.svg').trim(),
                featured ? 1 : 0
            ]);

            const foodId = result.lastInsertRowid;

            // Handle ingredients
            if (ingredients && Array.isArray(ingredients)) {
                const insertIngStmt = getDb().prepare('INSERT OR IGNORE INTO ingredients (name) VALUES (?)');
                const getIngStmt = getDb().prepare('SELECT id FROM ingredients WHERE name = ?');
                const linkIngStmt = getDb().prepare(`
                    INSERT OR IGNORE INTO food_ingredients (food_id, ingredient_id, quantity_or_note, is_primary)
                    VALUES (?, ?, ?, ?)
                `);

                ingredients.forEach(ing => {
                    const ingName = typeof ing === 'string' ? ing.trim() : (ing.name || '').trim();
                    if (ingName) {
                        insertIngStmt.run(ingName);
                        const ingRow = getIngStmt.get(ingName);
                        if (ingRow) {
                            const qty = typeof ing === 'object' ? (ing.quantity_or_note || ing.quantity || '') : '';
                            const isPrimary = typeof ing === 'object' && ing.is_primary ? 1 : 0;
                            linkIngStmt.run(foodId, ingRow.id, qty, isPrimary);
                        }
                    }
                });
            }

            // Handle seasons
            if (seasons && Array.isArray(seasons)) {
                const linkSeasonStmt = getDb().prepare(`
                    INSERT OR IGNORE INTO food_seasons (food_id, season_id)
                    VALUES (?, ?)
                `);
                seasons.forEach(seasonId => {
                    if (seasonId) linkSeasonStmt.run(foodId, Number(seasonId));
                });
            }

            // Handle references
            if (references && Array.isArray(references)) {
                const linkRefStmt = getDb().prepare(`
                    INSERT OR IGNORE INTO food_references (food_id, reference_id)
                    VALUES (?, ?)
                `);
                references.forEach(refId => {
                    if (refId) linkRefStmt.run(foodId, Number(refId));
                });
            }

            return { id: foodId, slug: slug };
        });

        res.status(201).json({
            success: true,
            message: `Food record "${name}" created successfully.`,
            data: foodResult
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update an existing food record
 * PUT /api/admin/foods/:id
 */
function updateFood(req, res, next) {
    try {
        const { id } = req.params;
        const existing = queryOne('SELECT * FROM foods WHERE id = ?', [id]);

        if (!existing) {
            return res.status(404).json({ success: false, message: `Food record #${id} not found.` });
        }

        const {
            name, local_name, state_id, category_id,
            short_description, cultural_context, traditional_preparation,
            seasonality_notes, festival_context, serving_tradition,
            veg_type, image_url, featured,
            ingredients, seasons, references
        } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Food name is required.' });
        }
        if (!state_id) {
            return res.status(400).json({ success: false, message: 'State selection is required.' });
        }
        if (!category_id) {
            return res.status(400).json({ success: false, message: 'Category selection is required.' });
        }
        if (!['Vegetarian', 'Non-Vegetarian'].includes(veg_type)) {
            return res.status(400).json({ success: false, message: 'Valid dietary classification is required.' });
        }

        const stateRecord = queryOne('SELECT region_id FROM states WHERE id = ?', [state_id]);
        if (!stateRecord) {
            return res.status(400).json({ success: false, message: 'Selected state does not exist.' });
        }
        const region_id = stateRecord.region_id;

        transaction(() => {
            // Update main table
            const updateSql = `
                UPDATE foods SET
                    name = ?, local_name = ?, state_id = ?, region_id = ?, category_id = ?,
                    short_description = ?, cultural_context = ?, traditional_preparation = ?,
                    seasonality_notes = ?, festival_context = ?, serving_tradition = ?,
                    veg_type = ?, image_url = ?, featured = ?,
                    updated_at = datetime('now')
                WHERE id = ?
            `;

            execute(updateSql, [
                name.trim(),
                (local_name || '').trim(),
                Number(state_id),
                Number(region_id),
                Number(category_id),
                (short_description || existing.short_description).trim(),
                (cultural_context || existing.cultural_context).trim(),
                (traditional_preparation || existing.traditional_preparation).trim(),
                (seasonality_notes || existing.seasonality_notes).trim(),
                (festival_context || '').trim(),
                (serving_tradition || '').trim(),
                veg_type,
                (image_url || existing.image_url || '/assets/images/placeholder.svg').trim(),
                featured ? 1 : 0,
                id
            ]);

            // Sync ingredients if provided
            if (ingredients && Array.isArray(ingredients)) {
                execute('DELETE FROM food_ingredients WHERE food_id = ?', [id]);
                const insertIngStmt = getDb().prepare('INSERT OR IGNORE INTO ingredients (name) VALUES (?)');
                const getIngStmt = getDb().prepare('SELECT id FROM ingredients WHERE name = ?');
                const linkIngStmt = getDb().prepare(`
                    INSERT OR IGNORE INTO food_ingredients (food_id, ingredient_id, quantity_or_note, is_primary)
                    VALUES (?, ?, ?, ?)
                `);

                ingredients.forEach(ing => {
                    const ingName = typeof ing === 'string' ? ing.trim() : (ing.name || '').trim();
                    if (ingName) {
                        insertIngStmt.run(ingName);
                        const ingRow = getIngStmt.get(ingName);
                        if (ingRow) {
                            const qty = typeof ing === 'object' ? (ing.quantity_or_note || ing.quantity || '') : '';
                            const isPrimary = typeof ing === 'object' && ing.is_primary ? 1 : 0;
                            linkIngStmt.run(id, ingRow.id, qty, isPrimary);
                        }
                    }
                });
            }

            // Sync seasons if provided
            if (seasons && Array.isArray(seasons)) {
                execute('DELETE FROM food_seasons WHERE food_id = ?', [id]);
                const linkSeasonStmt = getDb().prepare('INSERT OR IGNORE INTO food_seasons (food_id, season_id) VALUES (?, ?)');
                seasons.forEach(seasonId => {
                    if (seasonId) linkSeasonStmt.run(id, Number(seasonId));
                });
            }

            // Sync references if provided
            if (references && Array.isArray(references)) {
                execute('DELETE FROM food_references WHERE food_id = ?', [id]);
                const linkRefStmt = getDb().prepare('INSERT OR IGNORE INTO food_references (food_id, reference_id) VALUES (?, ?)');
                references.forEach(refId => {
                    if (refId) linkRefStmt.run(id, Number(refId));
                });
            }
        });

        res.json({
            success: true,
            message: `Food record #${id} ("${name}") updated successfully.`
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete a food record
 * DELETE /api/admin/foods/:id
 */
function deleteFood(req, res, next) {
    try {
        const { id } = req.params;
        const food = queryOne('SELECT name FROM foods WHERE id = ?', [id]);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: `Food record #${id} not found.`
            });
        }

        // Deleting from foods cascades to food_ingredients, food_seasons, and food_references
        execute('DELETE FROM foods WHERE id = ?', [id]);

        res.json({
            success: true,
            message: `Food record "${food.name}" (ID #${id}) was permanently deleted.`
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    login,
    logout,
    checkAuth,
    getDashboard,
    getFoodById,
    createFood,
    updateFood,
    deleteFood
};
