/**
 * Bharat Bhojan - Automated Site Health Check Script
 * Verifies all major public HTML pages, API endpoints, and all 37 individual food detail endpoints.
 */

const http = require('http');

const BASE_URL = 'http://127.0.0.1:3000';

function fetchUrl(path) {
    return new Promise((resolve, reject) => {
        const url = `${BASE_URL}${path}`;
        const req = http.get(url, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: body
                });
            });
        });
        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timed out'));
        });
    });
}

async function runHealthCheck() {
    console.log('====================================================');
    console.log(' Bharat Bhojan - Comprehensive Site Health Check');
    console.log(` Target Server: ${BASE_URL}`);
    console.log('====================================================\n');

    let passCount = 0;
    let failCount = 0;

    const testEndpoint = async (name, path, validator) => {
        try {
            const res = await fetchUrl(path);
            const valid = validator(res);
            if (valid.pass) {
                console.log(`[PASS] ${name} (${path}) -> Status ${res.status}`);
                passCount++;
            } else {
                console.error(`[FAIL] ${name} (${path}) -> ${valid.reason}`);
                failCount++;
            }
        } catch (err) {
            console.error(`[FAIL] ${name} (${path}) -> Error: ${err.message}`);
            failCount++;
        }
    };

    // 1. Core Public HTML Pages
    await testEndpoint('Home Page', '/', res => ({
        pass: res.status === 200 && res.body.includes('Bharat Bhojan'),
        reason: `Status ${res.status} or missing title`
    }));

    await testEndpoint('Explore Foods Page', '/explore.html', res => ({
        pass: res.status === 200 && res.body.includes('Explore Traditional Indian Foods'),
        reason: `Status ${res.status} or missing heading`
    }));

    await testEndpoint('Food Detail Page (Litti Chokha)', '/food.html?slug=litti-chokha', res => ({
        pass: res.status === 200 && res.body.includes('foodDetailContent'),
        reason: `Status ${res.status}`
    }));

    await testEndpoint('Regions Page', '/regions.html', res => ({
        pass: res.status === 200 && res.body.includes('regionTabs'),
        reason: `Status ${res.status}`
    }));

    await testEndpoint('Seasonal Page', '/seasonal.html', res => ({
        pass: res.status === 200 && res.body.includes('seasonTabs'),
        reason: `Status ${res.status}`
    }));

    await testEndpoint('About Page', '/about.html', res => ({
        pass: res.status === 200 && res.body.includes('About Bharat Bhojan'),
        reason: `Status ${res.status}`
    }));

    await testEndpoint('References Page', '/references.html', res => ({
        pass: res.status === 200 && res.body.includes('referencesList'),
        reason: `Status ${res.status}`
    }));

    await testEndpoint('Admin Login Page', '/admin/login.html', res => ({
        pass: res.status === 200 && res.body.includes('adminLoginForm'),
        reason: `Status ${res.status}`
    }));

    await testEndpoint('Custom 404 Page', '/non-existent-page-xyz-123', res => ({
        pass: res.status === 404 && res.body.includes('404'),
        reason: `Status ${res.status} expected 404`
    }));

    // 2. Core API Endpoints
    await testEndpoint('API: Platform Statistics', '/api/stats', res => {
        try {
            const data = JSON.parse(res.body);
            return {
                pass: res.status === 200 && data.success && data.data.total_foods >= 35,
                reason: `Invalid JSON or total_foods < 35`
            };
        } catch (e) {
            return { pass: false, reason: e.message };
        }
    });

    await testEndpoint('API: All Foods List', '/api/foods', res => {
        try {
            const data = JSON.parse(res.body);
            return {
                pass: res.status === 200 && data.success && data.data.length >= 35,
                reason: `Invalid JSON or food count < 35`
            };
        } catch (e) {
            return { pass: false, reason: e.message };
        }
    });

    await testEndpoint('API: Search Foods (litti)', '/api/foods/search?q=litti', res => {
        try {
            const data = JSON.parse(res.body);
            return {
                pass: res.status === 200 && data.success && data.data.length >= 1,
                reason: `No search results for "litti"`
            };
        } catch (e) {
            return { pass: false, reason: e.message };
        }
    });

    await testEndpoint('API: Food Details (litti-chokha)', '/api/foods/litti-chokha', res => {
        try {
            const data = JSON.parse(res.body);
            return {
                pass: res.status === 200 && data.success && data.data.slug === 'litti-chokha' && data.data.ingredients.length > 0,
                reason: `Invalid food detail payload`
            };
        } catch (e) {
            return { pass: false, reason: e.message };
        }
    });

    await testEndpoint('API: Geographical Regions', '/api/regions', res => {
        try {
            const data = JSON.parse(res.body);
            return {
                pass: res.status === 200 && data.success && data.data.length === 6,
                reason: `Expected 6 regions, got ${data.data?.length}`
            };
        } catch (e) {
            return { pass: false, reason: e.message };
        }
    });

    await testEndpoint('API: Seasons', '/api/seasons', res => {
        try {
            const data = JSON.parse(res.body);
            return {
                pass: res.status === 200 && data.success && data.data.length >= 5,
                reason: `Expected at least 5 seasons`
            };
        } catch (e) {
            return { pass: false, reason: e.message };
        }
    });

    await testEndpoint('API: States', '/api/states', res => {
        try {
            const data = JSON.parse(res.body);
            return {
                pass: res.status === 200 && data.success && data.data.length >= 20,
                reason: `Expected states list`
            };
        } catch (e) {
            return { pass: false, reason: e.message };
        }
    });

    await testEndpoint('API: Food Categories', '/api/categories', res => {
        try {
            const data = JSON.parse(res.body);
            return {
                pass: res.status === 200 && data.success && data.data.length >= 4,
                reason: `Expected categories list`
            };
        } catch (e) {
            return { pass: false, reason: e.message };
        }
    });

    await testEndpoint('API: References Bibliography', '/api/references', res => {
        try {
            const data = JSON.parse(res.body);
            return {
                pass: res.status === 200 && data.success && data.data.length >= 10,
                reason: `Expected references list >= 10`
            };
        } catch (e) {
            return { pass: false, reason: e.message };
        }
    });

    // 3. Programmatic Check of All 37 Food Slugs
    console.log('\n--- Checking All 37 Food Detail Endpoints (/api/foods/:slug) ---');
    try {
        const foodsRes = await fetchUrl('/api/foods');
        const foodsData = JSON.parse(foodsRes.body);
        const foods = foodsData.data || [];

        let allSlugsPass = true;
        for (const food of foods) {
            try {
                const detailRes = await fetchUrl(`/api/foods/${encodeURIComponent(food.slug)}`);
                const detailData = JSON.parse(detailRes.body);
                if (detailRes.status !== 200 || !detailData.success || !detailData.data) {
                    console.error(`[FAIL] Slug: ${food.slug} returned status ${detailRes.status}`);
                    allSlugsPass = false;
                    failCount++;
                } else if (!detailData.data.ingredients || detailData.data.ingredients.length === 0) {
                    console.error(`[FAIL] Slug: ${food.slug} has no ingredients`);
                    allSlugsPass = false;
                    failCount++;
                }
            } catch (err) {
                console.error(`[FAIL] Slug: ${food.slug} error: ${err.message}`);
                allSlugsPass = false;
                failCount++;
            }
        }
        if (allSlugsPass) {
            console.log(`[PASS] All ${foods.length} food detail endpoints loaded successfully with ingredients and metadata!`);
            passCount++;
        }
    } catch (err) {
        console.error(`[FAIL] Failed to iterate foods: ${err.message}`);
        failCount++;
    }

    console.log('\n====================================================');
    console.log(` Health Check Summary: ${passCount} Passed, ${failCount} Failed`);
    console.log('====================================================');

    if (failCount > 0) {
        process.exit(1);
    }
}

runHealthCheck();
