/**
 * Bharat Bhojan - End-to-End System Verification Suite
 * Executes comprehensive integration testing across public routes, APIs, search,
 * filters, detail views, session authentication, and transactional CRUD operations.
 */

const BASE_URL = 'http://127.0.0.1:3000';

async function runTests() {
    console.log('====================================================');
    console.log(' Starting End-to-End System Verification');
    console.log(` Target Server: ${BASE_URL}`);
    console.log('====================================================\n');

    let passed = 0;
    let failed = 0;

    function assert(condition, testName, details = '') {
        if (condition) {
            console.log(`[PASS] ${testName}`);
            passed++;
        } else {
            console.error(`[FAIL] ${testName} - ${details}`);
            failed++;
        }
    }

    try {
        // 1. Test Home Page HTML
        const homeRes = await fetch(`${BASE_URL}/`);
        const homeHtml = await homeRes.text();
        assert(homeRes.status === 200, 'Home Page (/) returns HTTP 200');
        assert(homeHtml.includes('Bharat Bhojan'), 'Home Page contains brand title');
        assert(homeHtml.includes('Discover India\'s Traditional Food Knowledge'), 'Home Page contains hero heading');

        // 2. Test Explore Foods HTML
        const exploreRes = await fetch(`${BASE_URL}/explore.html`);
        const exploreHtml = await exploreRes.text();
        assert(exploreRes.status === 200, 'Explore Page (/explore.html) returns HTTP 200');
        assert(exploreHtml.includes('searchInput'), 'Explore Page contains search input');
        assert(exploreHtml.includes('filterState'), 'Explore Page contains state filter');

        // 3. Test Detail View HTML
        const detailRes = await fetch(`${BASE_URL}/food.html?slug=litti-chokha`);
        assert(detailRes.status === 200, 'Food Detail Page (/food.html?slug=litti-chokha) returns HTTP 200');

        // 4. Test Regions & Seasonal HTML
        const regionsRes = await fetch(`${BASE_URL}/regions.html`);
        assert(regionsRes.status === 200, 'Regions Page (/regions.html) returns HTTP 200');

        const seasonalRes = await fetch(`${BASE_URL}/seasonal.html`);
        assert(seasonalRes.status === 200, 'Seasonal Page (/seasonal.html) returns HTTP 200');

        // 5. Test About & References HTML
        const aboutRes = await fetch(`${BASE_URL}/about.html`);
        assert(aboutRes.status === 200, 'About Page (/about.html) returns HTTP 200');

        const refRes = await fetch(`${BASE_URL}/references.html`);
        assert(refRes.status === 200, 'References Page (/references.html) returns HTTP 200');

        // 6. Test Stats API
        const statsRes = await fetch(`${BASE_URL}/api/stats`);
        const statsJson = await statsRes.json();
        assert(statsRes.status === 200 && statsJson.success, 'API: GET /api/stats returns success');
        assert(statsJson.data.total_foods >= 35, `Stats: Total foods >= 35 (found: ${statsJson.data.total_foods})`);
        assert(statsJson.data.represented_regions === 6, `Stats: 6 regions represented (found: ${statsJson.data.represented_regions})`);

        // 7. Test Featured Foods API
        const featRes = await fetch(`${BASE_URL}/api/foods/featured`);
        const featJson = await featRes.json();
        assert(featRes.status === 200 && featJson.count > 0, `API: GET /api/foods/featured returns ${featJson.count} featured dishes`);

        // 8. Test Search API with "Litti Chokha"
        const searchRes = await fetch(`${BASE_URL}/api/foods/search?q=Litti%20Chokha`);
        const searchJson = await searchRes.json();
        assert(searchJson.count >= 1, `Search "Litti Chokha" returned ${searchJson.count} results`);
        assert(searchJson.data[0]?.name === 'Litti Chokha', 'Search result matches Litti Chokha');

        // 9. Test Search API with ingredient "sattu"
        const sattuRes = await fetch(`${BASE_URL}/api/foods/search?q=sattu`);
        const sattuJson = await sattuRes.json();
        assert(sattuJson.count >= 2, `Search ingredient "sattu" returned ${sattuJson.count} results (Litti Chokha, Sattu Ghol)`);

        // 10. Test Search with zero results
        const emptyRes = await fetch(`${BASE_URL}/api/foods/search?q=PizzaBurgerRandomXYZ`);
        const emptyJson = await emptyRes.json();
        assert(emptyJson.count === 0, 'Search for non-existent term returns count 0');

        // 11. Test Multi-criteria Filtering (State: Bihar, Season: Winter)
        const filterRes = await fetch(`${BASE_URL}/api/foods?state=Bihar&season=Winter`);
        const filterJson = await filterRes.json();
        assert(filterJson.count === 4, `Multi-Filter (State=Bihar & Season=Winter) returned ${filterJson.count} dishes (Expected 4)`);

        // 12. Test Detail Slug Endpoint
        const littiDetailRes = await fetch(`${BASE_URL}/api/foods/litti-chokha`);
        const littiDetail = await littiDetailRes.json();
        assert(littiDetail.success, 'API: GET /api/foods/litti-chokha returns success');
        assert(littiDetail.data.local_name === 'लिट्टी चोखा', `Native script accurately returned: "${littiDetail.data.local_name}"`);
        assert(Array.isArray(littiDetail.data.ingredients) && littiDetail.data.ingredients.length > 0, `Ingredients array populated (${littiDetail.data.ingredients.length} items)`);
        assert(Array.isArray(littiDetail.data.seasons) && littiDetail.data.seasons.length > 0, `Seasons array populated (${littiDetail.data.seasons.length} items)`);
        assert(Array.isArray(littiDetail.data.references) && littiDetail.data.references.length > 0, `References array populated (${littiDetail.data.references.length} items)`);
        assert(Array.isArray(littiDetail.data.related_dishes), 'Related dishes populated');

        // 13. Test Nonexistent Slug returns 404
        const nonExistentRes = await fetch(`${BASE_URL}/api/foods/nonexistent-dish-slug-xyz`);
        assert(nonExistentRes.status === 404, 'API: GET nonexistent slug returns HTTP 404');

        // 14. Test Unauthorized access on protected route
        const unauthRes = await fetch(`${BASE_URL}/api/admin/dashboard`);
        assert(unauthRes.status === 401, 'Protected Route: GET /api/admin/dashboard without session returns HTTP 401 Unauthorized');

        // 15. Test Admin Login with invalid credentials
        const badLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
        });
        assert(badLoginRes.status === 401, 'Admin Login: Invalid password rejected with HTTP 401');

        // 16. Test Admin Login with valid credentials
        const goodLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        const goodLoginJson = await goodLoginRes.json();
        assert(goodLoginRes.status === 200 && goodLoginJson.success, 'Admin Login: Valid credentials returns HTTP 200 Success');

        // Extract session cookie from Set-Cookie header
        const rawCookies = goodLoginRes.headers.get('set-cookie');
        const sessionCookie = rawCookies ? rawCookies.split(';')[0] : '';
        assert(sessionCookie.length > 0, 'Admin Login: Session cookie established');

        // 17. Test Admin Dashboard with authenticated session cookie
        const authDashRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
            headers: { 'Cookie': sessionCookie }
        });
        const authDashJson = await authDashRes.json();
        assert(authDashRes.status === 200 && authDashJson.success, 'Admin Dashboard: Accessed successfully with session cookie');
        assert(authDashJson.data.foods.length >= 35, `Admin Dashboard: Contains management records (${authDashJson.data.foods.length} items)`);

        // 18. Test Admin CRUD: Create a new test food record
        const statesList = await (await fetch(`${BASE_URL}/api/states`)).json();
        const biharState = statesList.data.find(s => s.name === 'Bihar') || statesList.data[0];

        const catsList = await (await fetch(`${BASE_URL}/api/categories`)).json();
        const mainCat = catsList.data[0];

        const seasonsList = await (await fetch(`${BASE_URL}/api/seasons`)).json();
        const winterSeason = seasonsList.data.find(s => s.name === 'Winter') || seasonsList.data[0];

        const refsList = await (await fetch(`${BASE_URL}/api/references`)).json();
        const testRef = refsList.data[0];

        const createPayload = {
            name: "Mithila Bagiya Test",
            local_name: "मिथिला बगिया",
            state_id: biharState.id,
            category_id: mainCat.id,
            veg_type: "Vegetarian",
            featured: 0,
            image_url: "/assets/images/placeholder.svg",
            short_description: "A temporary test dish for verification.",
            cultural_context: "Traditional winter dumplings in Mithila.",
            traditional_preparation: "Steamed rice dumplings filled with spiced lentils.",
            seasonality_notes: "Prepared during winter harvest.",
            festival_context: "Paush Sankranti",
            serving_tradition: "Served with tomato chutney.",
            ingredients: [
                { name: "Rice Flour", quantity: "2 cups", is_primary: 1 },
                { name: "Chana Dal", quantity: "1 cup", is_primary: 1 }
            ],
            seasons: [winterSeason.id],
            references: [testRef.id]
        };

        const createRes = await fetch(`${BASE_URL}/api/admin/foods`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionCookie
            },
            body: JSON.stringify(createPayload)
        });
        const createJson = await createRes.json();
        if (createRes.status !== 201) {
            console.error('CREATE ERROR STATUS:', createRes.status, createJson);
        }
        assert(createRes.status === 201 && createJson.success, 'Admin CRUD: POST /api/admin/foods created record successfully');
        const newFoodId = createJson.data.id;
        const newFoodSlug = createJson.data.slug;
        assert(newFoodId > 0, `New record ID generated: #${newFoodId} (slug: ${newFoodSlug})`);

        // 19. Verify New Food is searchable and viewable on public endpoints
        const verifyPublicRes = await fetch(`${BASE_URL}/api/foods/${newFoodSlug}`);
        const verifyPublicJson = await verifyPublicRes.json();
        assert(verifyPublicRes.status === 200 && verifyPublicJson.data.name === 'Mithila Bagiya Test', 'Public API: Newly created food immediately accessible via slug');

        // 20. Test Admin CRUD: Update the newly created food record
        const updatePayload = {
            ...createPayload,
            short_description: "Updated description during automated verification."
        };

        const updateRes = await fetch(`${BASE_URL}/api/admin/foods/${newFoodId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionCookie
            },
            body: JSON.stringify(updatePayload)
        });
        const updateJson = await updateRes.json();
        assert(updateRes.status === 200 && updateJson.success, `Admin CRUD: PUT /api/admin/foods/${newFoodId} updated successfully`);

        // Verify update in database
        const verifyUpdateRes = await fetch(`${BASE_URL}/api/foods/${newFoodSlug}`);
        const verifyUpdateJson = await verifyUpdateRes.json();
        assert(verifyUpdateJson.data.short_description === 'Updated description during automated verification.', 'Database Persistence: Updated description verified');

        // 21. Test Admin CRUD: Delete the test food record
        const deleteRes = await fetch(`${BASE_URL}/api/admin/foods/${newFoodId}`, {
            method: 'DELETE',
            headers: { 'Cookie': sessionCookie }
        });
        const deleteJson = await deleteRes.json();
        assert(deleteRes.status === 200 && deleteJson.success, `Admin CRUD: DELETE /api/admin/foods/${newFoodId} deleted successfully`);

        // Verify deletion persists and cascades
        const verifyDeleteRes = await fetch(`${BASE_URL}/api/foods/${newFoodSlug}`);
        assert(verifyDeleteRes.status === 404, 'Database Cascading: Deleted food record returns 404 Not Found');

        // 22. Test Error Handlers
        const api404Res = await fetch(`${BASE_URL}/api/nonexistent-route-xyz`);
        const api404Json = await api404Res.json();
        assert(api404Res.status === 404 && !api404Json.success, 'Central Error Handler: Invalid API route returns structured 404 JSON');

        const web404Res = await fetch(`${BASE_URL}/nonexistent-page-xyz`);
        const web404Html = await web404Res.text();
        assert(web404Res.status === 404 && web404Html.includes('404'), 'Custom 404 Handler: Invalid HTML route returns 404 page');

        // 23. Test Admin Logout
        const logoutRes = await fetch(`${BASE_URL}/api/admin/logout`, {
            method: 'POST',
            headers: { 'Cookie': sessionCookie }
        });
        const logoutJson = await logoutRes.json();
        assert(logoutRes.status === 200 && logoutJson.success, 'Admin Logout: Session destroyed successfully');

    } catch (err) {
        console.error('Fatal Verification Error:', err);
        failed++;
    }

    console.log('\n====================================================');
    console.log(` Verification Summary: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');

    if (failed === 0) {
        console.log('✓ All 23 Automated Verification Tests Passed Successfully!');
        process.exit(0);
    } else {
        console.error('✗ Some tests failed. Please inspect logs above.');
        process.exit(1);
    }
}

runTests();
