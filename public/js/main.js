/**
 * Bharat Bhojan - Main Client JavaScript
 * Global utilities, mobile navigation toggle, and homepage metrics loader.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initGlobalImageFallbacks();
    loadHomeStats();
});

/**
 * Mobile Navigation Hamburger Menu & Active Link Highlighting
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.innerHTML = isOpen ? '✕' : '☰';
        });
    }

    // Highlight current page in navbar
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath === href || (href !== '/' && href !== 'index.html' && currentPath.endsWith(href))) {
            link.classList.add('active');
        }
    });
}

/**
 * Automatic fallback for broken or missing images across all views
 */
function initGlobalImageFallbacks() {
    window.handleImageError = function(imgElement) {
        if (!imgElement) return;
        imgElement.onerror = null;
        imgElement.src = '/assets/images/placeholder.svg';
    };
}

/**
 * Fetch and animate platform statistics for landing page counters
 */
async function loadHomeStats() {
    const statsContainer = document.getElementById('statsGrid');
    if (!statsContainer) return;

    try {
        const response = await fetch('/api/stats');
        const json = await response.json();

        if (json.success && json.data) {
            const d = json.data;
            const foodsEl = document.getElementById('statFoods');
            const statesEl = document.getElementById('statStates');
            const regionsEl = document.getElementById('statRegions');
            const refsEl = document.getElementById('statRefs');

            if (foodsEl) foodsEl.textContent = d.total_foods || '35+';
            if (statesEl) statesEl.textContent = d.represented_states || '20+';
            if (regionsEl) regionsEl.textContent = d.represented_regions || '6';
            if (refsEl) refsEl.textContent = d.total_references || '10+';
        }
    } catch (err) {
        console.warn('Could not load live statistics:', err.message);
    }
}

/**
 * Helper to render an individual food card HTML string
 * Used across explore, home, regions, and seasonal pages
 */
function createFoodCardHtml(food) {
    const dietClass = food.veg_type === 'Vegetarian' ? 'veg' : 'non-veg';
    const dietTitle = food.veg_type;

    const seasonsHtml = (food.seasons || [])
        .map(s => `<span class="season-badge">${escapeHtml(s)}</span>`)
        .join('');

    return `
        <article class="food-card" data-id="${food.id}">
            <div class="food-card-image-wrap">
                <img
                    src="${escapeHtml(food.image_url || '/assets/images/placeholder.svg')}"
                    alt="${escapeHtml(food.name)}"
                    class="food-card-img"
                    loading="lazy"
                    onerror="handleImageError(this)"
                />
                <span class="diet-indicator ${dietClass}" title="${dietTitle}">
                    <span class="diet-indicator-dot"></span>
                </span>
                <span class="food-card-category-tag">${escapeHtml(food.category_name || '')}</span>
            </div>
            <div class="food-card-body">
                <div class="food-card-meta">
                    <span>${escapeHtml(food.state_name || '')}</span>
                    <span class="food-card-meta-dot">•</span>
                    <span>${escapeHtml(food.region_name || '')}</span>
                </div>
                <h3 class="food-card-title">${escapeHtml(food.name)}</h3>
                ${food.local_name ? `<p class="food-card-native-name">${escapeHtml(food.local_name)}</p>` : ''}
                <p class="food-card-desc">${escapeHtml(food.short_description || '')}</p>
                <div class="food-card-seasons">
                    ${seasonsHtml}
                </div>
                <div class="food-card-footer">
                    <span class="detail-badge ${dietClass}" style="font-size: 0.75rem;">${escapeHtml(food.veg_type)}</span>
                    <a href="/food.html?slug=${encodeURIComponent(food.slug)}" class="btn btn-primary btn-sm">
                        View Details →
                    </a>
                </div>
            </div>
        </article>
    `;
}

/**
 * Basic XSS safety utility to escape dynamic strings
 */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
