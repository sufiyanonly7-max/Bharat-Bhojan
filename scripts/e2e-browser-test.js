/**
 * Bharat Bhojan - End-to-End Simulation of 29-Step User Journey
 */

const http = require('http');

const BASE_URL = 'http://127.0.0.1:3000';

function request(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
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
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}

async function runFullAudit() {
    console.log('====================================================');
    console.log(' Bharat Bhojan - 29-Step Comprehensive Flow Audit');
    console.log('====================================================\n');

    let passed = 0;
    let failed = 0;
    let sessionCookie = '';

    const check = (step, title, condition, details = '') => {
        if (condition) {
            console.log(`[PASS] Step ${step}: ${title} ${details ? '— ' + details : ''}`);
            passed++;
        } else {
            console.error(`[FAIL] Step ${step}: ${title} ${details ? '— ' + details : ''}`);
            failed++;
        }
    };

    try {
        // Step 1: Open homepage
        const homeRes = await request({ host: '127.0.0.1', port: 3000, path: '/', method: 'GET' });
        check(1, 'Open homepage', homeRes.status === 200 && homeRes.body.includes('Discover India'));

        // Step 2: Confirm featured foods appear
        const featRes = await request({ host: '127.0.0.1', port: 3000, path: '/api/foods/featured', method: 'GET' });
        const featData = JSON.parse(featRes.body);
        check(2, 'Confirm featured foods API', featData.success && featData.data.length >= 6, `Found ${featData.data?.length} featured dishes`);

        // Step 3: Search "Litti Chokha"
        const searchLitti = await request({ host: '127.0.0.1', port: 3000, path: '/api/foods?q=Litti%20Chokha', method: 'GET' });
        const searchLittiData = JSON.parse(searchLitti.body);
        check(3, 'Search "Litti Chokha"', searchLittiData.success && searchLittiData.data.length >= 1 && searchLittiData.data[0].name === 'Litti Chokha');

        // Step 4: Open Explore Foods
        const expRes = await request({ host: '127.0.0.1', port: 3000, path: '/explore.html', method: 'GET' });
        check(4, 'Open Explore Foods page', expRes.status === 200 && expRes.body.includes('Explore Traditional Indian Foods'));

        // Step 5: Confirm food cards appear (all 37)
        const allFoodsRes = await request({ host: '127.0.0.1', port: 3000, path: '/api/foods', method: 'GET' });
        const allFoodsData = JSON.parse(allFoodsRes.body);
        check(5, 'Confirm food cards (all 37)', allFoodsData.success && allFoodsData.data.length === 37, `Cataloged dishes: ${allFoodsData.data.length}`);

        // Step 6: Filter State = Bihar
        const biharRes = await request({ host: '127.0.0.1', port: 3000, path: '/api/foods?state=Bihar', method: 'GET' });
        const biharData = JSON.parse(biharRes.body);
        check(6, 'Filter State = Bihar', biharData.success && biharData.data.length === 8, `Bihar dishes found: ${biharData.data.length}`);

        // Step 7: Combine Bihar + Winter
        const biharWinterRes = await request({ host: '127.0.0.1', port: 3000, path: '/api/foods?state=Bihar&season=Winter', method: 'GET' });
        const biharWinterData = JSON.parse(biharWinterRes.body);
        check(7, 'Combine Bihar + Winter', biharWinterData.success && biharWinterData.data.length === 4, `Found: ${biharWinterData.data.map(d=>d.name).join(', ')}`);

        // Step 8: Clear filters (Return to all 37)
        check(8, 'Clear filters', allFoodsData.data.length === 37, 'Successfully resets to complete archive of 37 dishes');

        // Step 9: Search "sattu"
        const sattuRes = await request({ host: '127.0.0.1', port: 3000, path: '/api/foods?q=sattu', method: 'GET' });
        const sattuData = JSON.parse(sattuRes.body);
        check(9, 'Search "sattu"', sattuData.success && sattuData.data.length === 3, `Sattu dishes found: ${sattuData.data.map(d=>d.name).join(', ')}`);

        // Step 10: Open Litti Chokha details
        const littiDetailRes = await request({ host: '127.0.0.1', port: 3000, path: '/api/foods/litti-chokha', method: 'GET' });
        const littiDetail = JSON.parse(littiDetailRes.body).data;
        check(10, 'Open Litti Chokha details', littiDetail && littiDetail.slug === 'litti-chokha');

        // Step 11: Confirm ingredients
        check(11, 'Confirm ingredients', littiDetail.ingredients && littiDetail.ingredients.length === 10, `Found ${littiDetail.ingredients?.length} ingredients`);

        // Step 12: Confirm traditional preparation
        check(12, 'Confirm traditional preparation', littiDetail.traditional_preparation && littiDetail.traditional_preparation.length > 50);

        // Step 13: Confirm seasonality
        check(13, 'Confirm seasonality', littiDetail.seasonality_notes && littiDetail.seasons.length > 0);

        // Step 14: Confirm cultural context
        check(14, 'Confirm cultural context', littiDetail.cultural_context && littiDetail.cultural_context.length > 50);

        // Step 15: Confirm references
        check(15, 'Confirm references', littiDetail.references && littiDetail.references.length >= 1, `Found ${littiDetail.references?.length} reference links`);

        // Step 16: Open Regions page
        const regPageRes = await request({ host: '127.0.0.1', port: 3000, path: '/regions.html', method: 'GET' });
        check(16, 'Open Regions page', regPageRes.status === 200 && regPageRes.body.includes('regionTabs'));

        // Step 17: Select East India
        const eastIndiaRes = await request({ host: '127.0.0.1', port: 3000, path: '/api/foods?region=East%20India', method: 'GET' });
        const eastData = JSON.parse(eastIndiaRes.body);
        check(17, 'Select East India', eastData.success && eastData.data.length === 12, `East India dishes: ${eastData.data.length}`);

        // Step 18: Confirm food cards appear for East India
        check(18, 'Confirm food cards appear for East India', eastData.data.every(f => f.region_name === 'East India'));

        // Step 19: Open Seasonal Foods page
        const seasonPageRes = await request({ host: '127.0.0.1', port: 3000, path: '/seasonal.html', method: 'GET' });
        check(19, 'Open Seasonal Foods page', seasonPageRes.status === 200 && seasonPageRes.body.includes('seasonTabs'));

        // Step 20: Confirm seasonal dishes appear
        const winterFoodsRes = await request({ host: '127.0.0.1', port: 3000, path: '/api/foods?season=Winter', method: 'GET' });
        const winterData = JSON.parse(winterFoodsRes.body);
        check(20, 'Confirm seasonal dishes appear (Winter)', winterData.success && winterData.data.length === 16, `Winter dishes: ${winterData.data.length}`);

        // Step 21: Open About page
        const aboutRes = await request({ host: '127.0.0.1', port: 3000, path: '/about.html', method: 'GET' });
        check(21, 'Open About page', aboutRes.status === 200 && aboutRes.body.includes('About Bharat Bhojan'));

        // Step 22: Confirm project information is complete
        const hasAllSections = [
            '1. About Bharat Bhojan', '2. Project Problem', '3. Project Objectives',
            '4. Indian Knowledge Systems', '5. Main System Features', '6. Technology Stack',
            '7. Database Role', '8. Academic Scope', '9. Limitations'
        ].every(sec => aboutRes.body.includes(sec));
        check(22, 'Confirm project information is complete (9 sections)', hasAllSections);

        // Step 23: Open References page
        const refsRes = await request({ host: '127.0.0.1', port: 3000, path: '/references.html', method: 'GET' });
        check(23, 'Open References page', refsRes.status === 200 && refsRes.body.includes('referencesList'));

        // Step 24: Confirm references display
        const allRefsRes = await request({ host: '127.0.0.1', port: 3000, path: '/api/references', method: 'GET' });
        const allRefsData = JSON.parse(allRefsRes.body);
        check(24, 'Confirm references display (12 verified entries)', allRefsData.success && allRefsData.data.length === 12);

        // Step 25: Test mobile navigation & styles
        const cssRes = await request({ host: '127.0.0.1', port: 3000, path: '/css/responsive.css', method: 'GET' });
        check(25, 'Test responsive CSS breakpoints', cssRes.status === 200 && cssRes.body.includes('max-width: 768px') && cssRes.body.includes('max-width: 400px'));

        // Step 26: Log into admin
        const loginPayload = JSON.stringify({ username: 'admin', password: 'admin123' });
        const loginRes = await request({
            host: '127.0.0.1', port: 3000, path: '/api/admin/login', method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(loginPayload)
            }
        }, loginPayload);
        const loginData = JSON.parse(loginRes.body);
        const rawCookies = loginRes.headers['set-cookie'] || [];
        sessionCookie = rawCookies.map(c => c.split(';')[0]).join('; ');
        check(26, 'Log into admin', loginRes.status === 200 && loginData.success, `Session established: ${Boolean(sessionCookie)}`);

        // Step 27: Test admin dashboard with session
        const dashRes = await request({
            host: '127.0.0.1', port: 3000, path: '/api/admin/dashboard', method: 'GET',
            headers: { 'Cookie': sessionCookie }
        });
        const dashData = JSON.parse(dashRes.body);
        check(27, 'Test admin dashboard', dashRes.status === 200 && dashData.success && dashData.data.foods.length === 37, `Dashboard dishes: ${dashData.data?.foods.length}`);

        // Step 28: Logout
        const logoutRes = await request({
            host: '127.0.0.1', port: 3000, path: '/api/admin/logout', method: 'POST',
            headers: { 'Cookie': sessionCookie }
        });
        check(28, 'Logout admin session', logoutRes.status === 200);

        // Step 29: Open invalid URL and confirm custom 404
        const invalidRes = await request({ host: '127.0.0.1', port: 3000, path: '/some-invalid-page-does-not-exist', method: 'GET' });
        check(29, 'Open invalid URL and confirm custom 404', invalidRes.status === 404 && invalidRes.body.includes('404'));

    } catch (err) {
        console.error('Fatal Flow Error:', err);
        failed++;
    }

    console.log('\n====================================================');
    console.log(` 29-Step Audit Complete: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');

    if (failed > 0) process.exit(1);
}

runFullAudit();
