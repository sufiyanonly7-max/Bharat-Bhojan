/**
 * Bharat Bhojan - Metadata Controller
 * Supplies dropdown options and aggregate counts for states, regions, categories, seasons, and stats.
 */

const { queryAll, queryOne } = require('../config/database');

function getStates(req, res, next) {
    try {
        const sql = `
            SELECT s.id, s.name, s.region_id, r.name AS region_name,
                   (SELECT COUNT(*) FROM foods f WHERE f.state_id = s.id) AS food_count
            FROM states s
            JOIN regions r ON s.region_id = r.id
            ORDER BY s.name ASC
        `;
        const states = queryAll(sql);
        res.json({ success: true, count: states.length, data: states });
    } catch (error) {
        next(error);
    }
}

function getRegions(req, res, next) {
    try {
        const sql = `
            SELECT r.id, r.name, r.description,
                   (SELECT COUNT(*) FROM states s WHERE s.region_id = r.id) AS state_count,
                   (SELECT COUNT(*) FROM foods f WHERE f.region_id = r.id) AS food_count
            FROM regions r
            ORDER BY r.id ASC
        `;
        const regions = queryAll(sql);
        res.json({ success: true, count: regions.length, data: regions });
    } catch (error) {
        next(error);
    }
}

function getCategories(req, res, next) {
    try {
        const sql = `
            SELECT c.id, c.name, c.description,
                   (SELECT COUNT(*) FROM foods f WHERE f.category_id = c.id) AS food_count
            FROM categories c
            ORDER BY c.name ASC
        `;
        const categories = queryAll(sql);
        res.json({ success: true, count: categories.length, data: categories });
    } catch (error) {
        next(error);
    }
}

function getSeasons(req, res, next) {
    try {
        const sql = `
            SELECT s.id, s.name, s.description,
                   (SELECT COUNT(*) FROM food_seasons fs WHERE fs.season_id = s.id) AS food_count
            FROM seasons s
            ORDER BY s.id ASC
        `;
        const seasons = queryAll(sql);
        res.json({ success: true, count: seasons.length, data: seasons });
    } catch (error) {
        next(error);
    }
}

function getReferences(req, res, next) {
    try {
        const sql = `
            SELECT r.*,
                   (SELECT COUNT(*) FROM food_references fr WHERE fr.reference_id = r.id) AS food_count
            FROM references_tbl r
            ORDER BY r.source_type ASC, r.title ASC
        `;
        const references = queryAll(sql);
        res.json({ success: true, count: references.length, data: references });
    } catch (error) {
        next(error);
    }
}

function getStats(req, res, next) {
    try {
        const foodsCount = queryOne('SELECT COUNT(*) AS c FROM foods').c;
        const statesCount = queryOne('SELECT COUNT(DISTINCT state_id) AS c FROM foods').c;
        const regionsCount = queryOne('SELECT COUNT(DISTINCT region_id) AS c FROM foods').c;
        const categoriesCount = queryOne('SELECT COUNT(*) AS c FROM categories').c;
        const referencesCount = queryOne('SELECT COUNT(*) AS c FROM references_tbl').c;
        const vegCount = queryOne("SELECT COUNT(*) AS c FROM foods WHERE veg_type = 'Vegetarian'").c;
        const nonVegCount = queryOne("SELECT COUNT(*) AS c FROM foods WHERE veg_type = 'Non-Vegetarian'").c;

        res.json({
            success: true,
            data: {
                total_foods: foodsCount,
                represented_states: statesCount,
                represented_regions: regionsCount,
                total_categories: categoriesCount,
                total_references: referencesCount,
                vegetarian_foods: vegCount,
                non_vegetarian_foods: nonVegCount
            }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getStates,
    getRegions,
    getCategories,
    getSeasons,
    getReferences,
    getStats
};
