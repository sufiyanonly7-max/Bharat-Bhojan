/**
 * Bharat Bhojan - Explore Foods Page JavaScript
 * Handles real-time search, multi-filter combinations, sorting, debouncing, and DOM updates.
 */

let allStates = [];
let allRegions = [];
let allCategories = [];
let allSeasons = [];
let debounceTimer = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadFilterDropdowns();
    readUrlParams();
    attachEventListeners();
    fetchAndRenderFoods();
});

/**
 * Fetch filter dropdown data from backend metadata endpoints
 */
async function loadFilterDropdowns() {
    try {
        const [statesRes, regionsRes, catsRes, seasonsRes] = await Promise.all([
            fetch('/api/states').then(r => r.json()),
            fetch('/api/regions').then(r => r.json()),
            fetch('/api/categories').then(r => r.json()),
            fetch('/api/seasons').then(r => r.json())
        ]);

        if (regionsRes.success) {
            allRegions = regionsRes.data;
            const regionSelect = document.getElementById('filterRegion');
            if (regionSelect) {
                allRegions.forEach(r => {
                    const opt = document.createElement('option');
                    opt.value = r.name;
                    opt.textContent = `${r.name} (${r.food_count || 0})`;
                    regionSelect.appendChild(opt);
                });
            }
        }

        if (statesRes.success) {
            allStates = statesRes.data;
            const stateSelect = document.getElementById('filterState');
            if (stateSelect) {
                allStates.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = s.name;
                    opt.textContent = `${s.name} (${s.food_count || 0})`;
                    stateSelect.appendChild(opt);
                });
            }
        }

        if (catsRes.success) {
            allCategories = catsRes.data;
            const catSelect = document.getElementById('filterCategory');
            if (catSelect) {
                allCategories.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.name;
                    opt.textContent = `${c.name} (${c.food_count || 0})`;
                    catSelect.appendChild(opt);
                });
            }
        }

        if (seasonsRes.success) {
            allSeasons = seasonsRes.data;
            const seasonSelect = document.getElementById('filterSeason');
            if (seasonSelect) {
                allSeasons.forEach(sn => {
                    const opt = document.createElement('option');
                    opt.value = sn.name;
                    opt.textContent = `${sn.name} (${sn.food_count || 0})`;
                    seasonSelect.appendChild(opt);
                });
            }
        }
    } catch (err) {
        console.error('Failed to load filter metadata:', err);
    }
}

/**
 * Read query parameters from URL to pre-fill filters
 */
function readUrlParams() {
    const params = new URLSearchParams(window.location.search);

    const searchVal = params.get('search') || params.get('q');
    const stateVal = params.get('state');
    const regionVal = params.get('region');
    const seasonVal = params.get('season');
    const catVal = params.get('category');
    const vegVal = params.get('veg_type') || params.get('diet');
    const sortVal = params.get('sort');

    if (searchVal && document.getElementById('searchInput')) document.getElementById('searchInput').value = searchVal;
    if (stateVal && document.getElementById('filterState')) document.getElementById('filterState').value = stateVal;
    if (regionVal && document.getElementById('filterRegion')) document.getElementById('filterRegion').value = regionVal;
    if (seasonVal && document.getElementById('filterSeason')) document.getElementById('filterSeason').value = seasonVal;
    if (catVal && document.getElementById('filterCategory')) document.getElementById('filterCategory').value = catVal;
    if (vegVal && document.getElementById('filterDiet')) document.getElementById('filterDiet').value = vegVal;
    if (sortVal && document.getElementById('sortSelect')) document.getElementById('sortSelect').value = sortVal;
}

/**
 * Attach UI event listeners
 */
function attachEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const filterState = document.getElementById('filterState');
    const filterRegion = document.getElementById('filterRegion');
    const filterSeason = document.getElementById('filterSeason');
    const filterCategory = document.getElementById('filterCategory');
    const filterDiet = document.getElementById('filterDiet');
    const sortSelect = document.getElementById('sortSelect');
    const resetBtn = document.getElementById('resetFiltersBtn');

    // Debounced search input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                fetchAndRenderFoods();
            }, 300);
        });
    }

    // Direct filter triggers
    [filterState, filterRegion, filterSeason, filterCategory, filterDiet, sortSelect].forEach(el => {
        if (el) {
            el.addEventListener('change', () => {
                fetchAndRenderFoods();
            });
        }
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetAllFilters();
        });
    }
}

function resetAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterState').value = '';
    document.getElementById('filterRegion').value = '';
    document.getElementById('filterSeason').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterDiet').value = '';
    document.getElementById('sortSelect').value = 'a-z';
    window.history.replaceState({}, '', window.location.pathname);
    fetchAndRenderFoods();
}

/**
 * Fetch foods based on active search and filter criteria
 */
async function fetchAndRenderFoods() {
    const grid = document.getElementById('foodsGrid');
    const resultsCountEl = document.getElementById('resultsCount');

    if (!grid) return;

    // Show loading spinner state
    grid.innerHTML = `
        <div class="state-container" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
            <h3 class="state-title">Loading Traditional Foods...</h3>
            <p class="state-desc">Retrieving verified culinary records from the database.</p>
        </div>
    `;

    const searchQuery = (document.getElementById('searchInput')?.value || '').trim();
    const stateVal = document.getElementById('filterState')?.value || '';
    const regionVal = document.getElementById('filterRegion')?.value || '';
    const seasonVal = document.getElementById('filterSeason')?.value || '';
    const catVal = document.getElementById('filterCategory')?.value || '';
    const vegVal = document.getElementById('filterDiet')?.value || '';
    const sortVal = document.getElementById('sortSelect')?.value || 'a-z';

    try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (stateVal) params.append('state', stateVal);
        if (regionVal) params.append('region', regionVal);
        if (seasonVal) params.append('season', seasonVal);
        if (catVal) params.append('category', catVal);
        if (vegVal) params.append('veg_type', vegVal);
        if (sortVal) params.append('sort', sortVal);

        const url = `/api/foods?${params.toString()}`;

        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to retrieve food records.');
        }

        let foods = result.data || [];

        // Update results counter
        if (resultsCountEl) {
            resultsCountEl.innerHTML = `Showing <strong>${foods.length}</strong> traditional dishes`;
        }

        // Render Empty State
        if (foods.length === 0) {
            grid.innerHTML = `
                <div class="state-container" style="grid-column: 1 / -1;">
                    <div class="state-icon">🍲</div>
                    <h3 class="state-title">No Matching Traditional Foods</h3>
                    <p class="state-desc">
                        No dishes found matching your current filter criteria. Try clearing some filters or searching for another regional delicacy.
                    </p>
                    <button class="btn btn-primary" onclick="resetAllFilters()">Reset All Filters</button>
                </div>
            `;
            return;
        }

        // Render Food Cards
        grid.innerHTML = foods.map(f => createFoodCardHtml(f)).join('');

    } catch (error) {
        console.error('Fetch error:', error);
        grid.innerHTML = `
            <div class="state-container" style="grid-column: 1 / -1;">
                <div class="state-icon">⚠️</div>
                <h3 class="state-title">Unable to Load Food Knowledge</h3>
                <p class="state-desc">${escapeHtml(error.message)}</p>
                <button class="btn btn-secondary" onclick="fetchAndRenderFoods()">Try Again</button>
            </div>
        `;
    }
}
