/**
 * Bharat Bhojan - Regions Page JavaScript
 * Organizes traditional foods across Indian geographical zones:
 * East India, North India, South India, West India, Central India, North-East India.
 */

let allRegions = [];
let allStates = [];
let currentRegion = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadInitialData();
});

async function loadInitialData() {
    try {
        const [regionsRes, statesRes] = await Promise.all([
            fetch('/api/regions').then(r => r.json()),
            fetch('/api/states').then(r => r.json())
        ]);

        if (regionsRes.success) allRegions = regionsRes.data;
        if (statesRes.success) allStates = statesRes.data;

        renderRegionTabs();

        // Check URL parameter for preselected region
        const params = new URLSearchParams(window.location.search);
        const urlRegion = params.get('region');

        if (urlRegion && allRegions.some(r => r.name.toLowerCase() === urlRegion.toLowerCase())) {
            selectRegion(allRegions.find(r => r.name.toLowerCase() === urlRegion.toLowerCase()));
        } else if (allRegions.length > 0) {
            selectRegion(allRegions[0]); // Default to first region
        }

    } catch (err) {
        console.error('Failed to initialize regions page:', err);
    }
}

function renderRegionTabs() {
    const tabsContainer = document.getElementById('regionTabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = allRegions.map(r => `
        <button class="region-tab-btn" data-id="${r.id}" onclick="handleTabClick(${r.id})">
            ${escapeHtml(r.name)} (${r.food_count || 0})
        </button>
    `).join('');
}

window.handleTabClick = function(regionId) {
    const selected = allRegions.find(r => r.id === regionId);
    if (selected) {
        selectRegion(selected);
    }
};

async function selectRegion(region) {
    currentRegion = region;

    // Update active tab styles
    document.querySelectorAll('.region-tab-btn').forEach(btn => {
        btn.classList.toggle('active', Number(btn.getAttribute('data-id')) === region.id);
    });

    // Update URL without page reload
    const newUrl = `${window.location.pathname}?region=${encodeURIComponent(region.name)}`;
    window.history.replaceState({ region: region.name }, '', newUrl);

    // Update Region Info Banner
    const infoContainer = document.getElementById('regionDetailBox');
    const regionStates = allStates.filter(s => s.region_id === region.id);

    if (infoContainer) {
        infoContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <span class="section-badge">Regional Geographical Zone</span>
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--primary-dark); margin: 0.25rem 0 0.5rem;">
                        ${escapeHtml(region.name)}
                    </h2>
                </div>
                <div style="background-color: var(--primary-light); padding: 0.5rem 1rem; border-radius: var(--radius-md); font-weight: 600; color: var(--primary);">
                    ${region.food_count} Documented Dishes
                </div>
            </div>
            <p style="font-size: 1.05rem; color: var(--medium-slate); margin-top: 0.75rem; line-height: 1.6;">
                ${escapeHtml(region.description)}
            </p>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <strong style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--light-slate);">
                    States & Territories Represented:
                </strong>
                <div class="region-states-list">
                    ${regionStates.map(s => `
                        <span class="state-chip">${escapeHtml(s.name)} ${s.food_count ? `(${s.food_count})` : ''}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Load Foods for this region
    await loadFoodsForRegion(region.name);
}

async function loadFoodsForRegion(regionName) {
    const grid = document.getElementById('regionFoodsGrid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="state-container" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
            <h3 class="state-title">Loading Dishes for ${escapeHtml(regionName)}...</h3>
        </div>
    `;

    try {
        const response = await fetch(`/api/foods?region=${encodeURIComponent(regionName)}`);
        const json = await response.json();

        if (!response.ok || !json.success) {
            throw new Error(json.message || 'Failed to load foods.');
        }

        const foods = json.data || [];

        if (foods.length === 0) {
            grid.innerHTML = `
                <div class="state-container" style="grid-column: 1 / -1;">
                    <div class="state-icon">🍲</div>
                    <h3 class="state-title">No Dishes Archived Yet</h3>
                    <p class="state-desc">Records for this region are being cataloged in upcoming updates.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = foods.map(f => createFoodCardHtml(f)).join('');

    } catch (err) {
        grid.innerHTML = `
            <div class="state-container" style="grid-column: 1 / -1;">
                <div class="state-icon">⚠️</div>
                <h3 class="state-title">Error Loading Foods</h3>
                <p class="state-desc">${escapeHtml(err.message)}</p>
            </div>
        `;
    }
}
