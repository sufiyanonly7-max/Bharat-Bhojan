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

const seasonalContexts = {
    'Summer': {
        weather: 'Intense dry heat and high temperatures across the Indo-Gangetic plains and peninsular plateaus.',
        harvest: 'Spring pulses, watermelons, raw mangoes, barley, sattu (roasted gram), and mint.',
        festivals: 'Baisakhi harvest festivals, Poila Boishakh, and regional summer temple fairs.',
        tradition: 'Hydrating sattu drinks, light fish broths with elephant apple, cooling buttermilk, and sun-dried lentil crisps.'
    },
    'Monsoon': {
        weather: 'Heavy rainfall, high humidity, and damp soil conditions across river basins and coastal belts.',
        harvest: 'Tender fresh corn (bhutta), monsoon gourds (torai, lauki), wild seasonal greens, and ginger.',
        festivals: 'Teej, Raksha Bandhan, and Krishna Janmashtami observances.',
        tradition: 'Hot steamed corn delicacies (bhutte ka kees), warming digestive spices (ajwain, hing), and comforting kadhi.'
    },
    'Autumn': {
        weather: 'Clear post-monsoon skies, moderate humidity, and pleasant daytime temperatures (Sharad Ritu).',
        harvest: 'Newly harvested paddy, fresh sugarcane jaggery (gur), lotus seeds (makhana), and coconut.',
        festivals: 'Navratri, Durga Puja, Dussehra, and the ancient sun-worship festival of Chhath Puja.',
        tradition: 'Festive sacred sweets (thekua, peda), coconut-chhena confections, kheer offerings, and ceremonial dalma.'
    },
    'Winter': {
        weather: 'Cold crisp temperatures, morning fog across northern plains, and frosty Himalayan breezes.',
        harvest: 'Winter brassicas (sarson, bathua, palak), radish, sesame seeds (til), and freshly pressed mustard oil.',
        festivals: 'Makar Sankranti, Pongal, Lohri, and Magh Bihu agricultural celebrations.',
        tradition: 'Slow-cooked mustard greens with corn flatbreads, cow-dung baked litti chokha, jaggery-sesame tilkut, and steaming thukpa.'
    },
    'Spring': {
        weather: 'Mild warming temperatures, golden mustard blooms, and gentle transitional breezes (Vasant Ritu).',
        harvest: 'Tender green chickpeas (chholia), spring wheat, cardamom, and fresh saffron.',
        festivals: 'Vasant Panchami and the vibrant spring festival of Holi.',
        tradition: 'Cardamom-scented puran poli, festive malpua immersed in saffron syrup, and refreshing thandai.'
    },
    'Year-round': {
        weather: 'Perennial staples enjoyed across all agro-climatic conditions throughout the year.',
        harvest: 'Aged rice varieties, dried pulses (toor, chana, urad), wheat flour, and whole pantry spices.',
        festivals: 'Daily household sustenance, community langars, and celebratory wedding feasts.',
        tradition: 'Fermented batters (dosa, idli, dhokla), slow-simmered lentil stews, and regional flatbreads.'
    }
};

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
    const ctx = seasonalContexts[seasonName] || seasonalContexts['Year-round'];

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

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-color);">
                <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <strong style="font-size: 0.85rem; text-transform: uppercase; color: var(--primary); display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                        🌦️ Weather & Climate
                    </strong>
                    <p style="font-size: 0.9rem; color: var(--medium-slate); line-height: 1.5;">${escapeHtml(ctx.weather)}</p>
                </div>
                <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <strong style="font-size: 0.85rem; text-transform: uppercase; color: var(--primary); display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                        🌾 Crop Availability
                    </strong>
                    <p style="font-size: 0.9rem; color: var(--medium-slate); line-height: 1.5;">${escapeHtml(ctx.harvest)}</p>
                </div>
                <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <strong style="font-size: 0.85rem; text-transform: uppercase; color: var(--primary); display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                        🪔 Festivals & Rituals
                    </strong>
                    <p style="font-size: 0.9rem; color: var(--medium-slate); line-height: 1.5;">${escapeHtml(ctx.festivals)}</p>
                </div>
                <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <strong style="font-size: 0.85rem; text-transform: uppercase; color: var(--primary); display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                        🍲 Regional Traditions
                    </strong>
                    <p style="font-size: 0.9rem; color: var(--medium-slate); line-height: 1.5;">${escapeHtml(ctx.tradition)}</p>
                </div>
            </div>

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
