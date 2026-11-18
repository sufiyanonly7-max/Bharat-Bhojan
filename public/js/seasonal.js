/**
 * Bharat Bhojan - Seasonal Foods Page JavaScript
 * Maps traditional regional dishes to the Indian seasonal calendar (Shad-Ritu & Agro-climatic cycles):
 * Summer (Grishma), Monsoon (Varsha), Autumn (Sharad), Winter (Shishir/Hemant), Spring (Vasant), Year-round.
 */

let allSeasons = [];
let activeSeason = 'Winter'; // Popular default

document.addEventListener('DOMContentLoaded', async () => {
    await loadSeasons();
});

async function loadSeasons() {
    try {
        const response = await fetch('/api/seasons');
        const json = await response.json();

        if (json.success && json.data) {
            allSeasons = json.data;
            renderSeasonTabs();

            // Check URL param
            const params = new URLSearchParams(window.location.search);
            const urlSeason = params.get('season');

            if (urlSeason && allSeasons.some(s => s.name.toLowerCase() === urlSeason.toLowerCase())) {
                const found = allSeasons.find(s => s.name.toLowerCase() === urlSeason.toLowerCase());
                selectSeason(found.name);
            } else {
                selectSeason('Winter');
            }
        }
    } catch (err) {
        console.error('Failed to load seasons:', err);
    }
}

function renderSeasonTabs() {
    const tabsContainer = document.getElementById('seasonTabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = allSeasons.map(s => `
        <button class="region-tab-btn" data-season="${s.name}" onclick="selectSeason('${s.name}')">
            ${escapeHtml(s.name)} (${s.food_count || 0})
        </button>
    `).join('');
}

window.selectSeason = async function(seasonName) {
    activeSeason = seasonName;

    // Highlight button
    document.querySelectorAll('#seasonTabs .region-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-season') === seasonName);
    });

    // Update URL
    const newUrl = `${window.location.pathname}?season=${encodeURIComponent(seasonName)}`;
    window.history.replaceState({ season: seasonName }, '', newUrl);

    // Update seasonal explanatory banner
    const seasonMeta = allSeasons.find(s => s.name.toLowerCase() === seasonName.toLowerCase());
    const banner = document.getElementById('seasonDetailBox');

    if (banner && seasonMeta) {
        banner.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <span class="section-badge">Indian Seasonal Tradition (Ritu-Charya)</span>
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--primary-dark); margin: 0.25rem 0 0.5rem;">
                        ${escapeHtml(seasonMeta.name)} Foods
                    </h2>
                </div>
                <div style="background-color: var(--accent-gold-light); padding: 0.5rem 1rem; border-radius: var(--radius-md); font-weight: 600; color: var(--accent-gold);">
                    ${seasonMeta.food_count} Associated Dishes
                </div>
            </div>
            <p style="font-size: 1.05rem; color: var(--medium-slate); margin-top: 0.75rem; line-height: 1.6;">
                ${escapeHtml(seasonMeta.description)}
            </p>
            <div class="academic-callout" style="margin-top: 1.25rem; margin-bottom: 0;">
                <strong>Geographical Variation Note:</strong>
                Because India spans multiple climate zones—from the sub-zero Himalayas to tropical peninsular coasts—seasonal associations reflect broad regional agro-climatic rhythms rather than uniform calendar rules.
            </div>
        `;
    }

    // Load dishes for this season
    await loadFoodsForSeason(seasonName);
};

async function loadFoodsForSeason(seasonName) {
    const grid = document.getElementById('seasonFoodsGrid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="state-container" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
            <h3 class="state-title">Loading ${escapeHtml(seasonName)} Dishes...</h3>
        </div>
    `;

    try {
        const response = await fetch(`/api/foods?season=${encodeURIComponent(seasonName)}`);
        const json = await response.json();

        if (!response.ok || !json.success) {
            throw new Error(json.message || 'Failed to fetch seasonal foods.');
        }

        const foods = json.data || [];

        if (foods.length === 0) {
            grid.innerHTML = `
                <div class="state-container" style="grid-column: 1 / -1;">
                    <div class="state-icon">🌾</div>
                    <h3 class="state-title">No Dishes Archived</h3>
                    <p class="state-desc">No specific seasonal dishes cataloged yet for ${escapeHtml(seasonName)}.</p>
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
