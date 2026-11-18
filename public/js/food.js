/**
 * Bharat Bhojan - Food Details Page JavaScript
 * Fetches and displays comprehensive cultural, culinary, and botanical details for a single dish.
 */

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!slug) {
        showError('No food slug specified in request URL.');
        return;
    }

    loadFoodDetail(slug);
});

async function loadFoodDetail(slug) {
    const mainContainer = document.getElementById('foodDetailContent');
    if (!mainContainer) return;

    try {
        const response = await fetch(`/api/foods/${encodeURIComponent(slug)}`);
        const json = await response.json();

        if (!response.ok || !json.success || !json.data) {
            showNotFound(slug);
            return;
        }

        const food = json.data;
        renderFoodDetail(food);

    } catch (err) {
        console.error('Error loading food details:', err);
        showError('Failed to communicate with database server.');
    }
}

function renderFoodDetail(food) {
    // Update document title
    document.title = `${food.name} | Bharat Bhojan – Traditional Indian Food Knowledge`;

    const mainContainer = document.getElementById('foodDetailContent');
    const dietClass = food.veg_type === 'Vegetarian' ? 'veg' : 'non-veg';

    // Format seasons badges
    const seasonsBadges = (food.seasons || [])
        .map(s => `<span class="detail-badge tag">📅 ${escapeHtml(s.name || s)}</span>`)
        .join('');

    // Format ingredients list items
    const ingredientsHtml = (food.ingredients || []).map(ing => `
        <li class="ingredient-item">
            <span class="ingredient-name">
                ${escapeHtml(ing.name)}
                ${ing.is_primary ? `<span class="ingredient-primary-badge">Key</span>` : ''}
            </span>
            <span class="ingredient-note">${escapeHtml(ing.quantity_or_note || 'To taste')}</span>
        </li>
    `).join('');

    // Format references items
    const referencesHtml = (food.references && food.references.length > 0)
        ? food.references.map(r => `
            <div class="reference-card">
                <span class="reference-type-badge">${escapeHtml(r.source_type || 'Scholarly Source')}</span>
                <h4 class="reference-title">${escapeHtml(r.title)}</h4>
                <p class="reference-authors">${escapeHtml(r.author || '')} ${r.publication_year ? `(${r.publication_year})` : ''}</p>
                <p class="reference-notes">${escapeHtml(r.notes || r.publisher || '')}</p>
                ${r.url ? `<a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary" style="margin-top: 0.5rem;">View Source Link ↗</a>` : ''}
            </div>
        `).join('')
        : `<p style="color: var(--medium-slate); font-style: italic;">Reference records are currently being archived for this entry.</p>`;

    // Format related dishes
    const relatedHtml = (food.related_dishes && food.related_dishes.length > 0)
        ? `
            <section class="section" style="padding-top: 1rem;">
                <div class="section-header" style="text-align: left; margin-bottom: 1.5rem;">
                    <span class="section-badge">Culinary Exploration</span>
                    <h3 class="section-title" style="font-size: 1.75rem;">Related Regional Foods</h3>
                </div>
                <div class="foods-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
                    ${food.related_dishes.map(r => `
                        <article class="food-card" style="margin-bottom: 0;">
                            <div class="food-card-image-wrap" style="aspect-ratio: 16 / 9;">
                                <img src="${escapeHtml(r.image_url || '/assets/images/placeholder.svg')}"
                                     alt="${escapeHtml(r.name)}"
                                     class="food-card-img"
                                     onerror="handleImageError(this)"/>
                                <span class="diet-indicator ${r.veg_type === 'Vegetarian' ? 'veg' : 'non-veg'}">
                                    <span class="diet-indicator-dot"></span>
                                </span>
                            </div>
                            <div class="food-card-body" style="padding: 1rem;">
                                <div class="food-card-meta"><span>${escapeHtml(r.state_name)}</span></div>
                                <h4 class="food-card-title" style="font-size: 1.15rem;">${escapeHtml(r.name)}</h4>
                                ${r.local_name ? `<p class="food-card-native-name">${escapeHtml(r.local_name)}</p>` : ''}
                                <a href="/food.html?slug=${encodeURIComponent(r.slug)}" class="btn btn-secondary btn-sm" style="margin-top: 0.75rem;">
                                    View Dish Details →
                                </a>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </section>
        `
        : '';

    mainContainer.innerHTML = `
        <!-- Top Header & Hero Showcase -->
        <header class="food-detail-header">
            <div class="container">
                <nav style="margin-bottom: 1.5rem;">
                    <a href="/explore.html" style="color: var(--primary); font-weight: 600;">← Back to Explore Foods</a>
                </nav>
                <div class="food-detail-grid">
                    <div class="food-detail-img-box">
                        <img
                            src="${escapeHtml(food.image_url || '/assets/images/placeholder.svg')}"
                            alt="${escapeHtml(food.name)}"
                            class="food-detail-img"
                            onerror="handleImageError(this)"
                        />
                        <span class="diet-indicator ${dietClass}" style="top: 16px; right: 16px; width: 28px; height: 28px;">
                            <span class="diet-indicator-dot" style="width: 14px; height: 14px;"></span>
                        </span>
                    </div>

                    <div class="food-detail-intro">
                        <div class="detail-badge-group">
                            <span class="detail-badge ${dietClass}">${escapeHtml(food.veg_type)}</span>
                            <span class="detail-badge tag">🏷️ ${escapeHtml(food.category_name)}</span>
                            ${seasonsBadges}
                        </div>

                        <h1 class="food-detail-title">${escapeHtml(food.name)}</h1>
                        ${food.local_name ? `<p class="food-detail-native">${escapeHtml(food.local_name)}</p>` : ''}
                        <p class="food-detail-lead">${escapeHtml(food.short_description)}</p>

                        <div class="meta-key-value-grid">
                            <div>
                                <span class="meta-item-label">State of Origin</span>
                                <p class="meta-item-value">${escapeHtml(food.state_name)}</p>
                            </div>
                            <div>
                                <span class="meta-item-label">Geographical Region</span>
                                <p class="meta-item-value">${escapeHtml(food.region_name)}</p>
                            </div>
                            <div>
                                <span class="meta-item-label">Category</span>
                                <p class="meta-item-value">${escapeHtml(food.category_name)}</p>
                            </div>
                            <div>
                                <span class="meta-item-label">Occasion / Festival</span>
                                <p class="meta-item-value">${escapeHtml(food.festival_context || 'General Culinary Heritage')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Detailed Body Section -->
        <main class="detail-body-section">
            <div class="container">
                <div class="detail-columns">
                    <!-- Left Primary Column: Cultural & Preparation Narrative -->
                    <div class="detail-narrative">

                        <!-- Cultural Context Block -->
                        <div class="content-block">
                            <h2 class="content-block-title">
                                <span>🏛️</span> Cultural & Historical Significance
                            </h2>
                            <p class="content-block-text">${escapeHtml(food.cultural_context)}</p>

                            <!-- Academic Callout: Variations Note -->
                            <div class="academic-callout">
                                <strong>Academic Context & Household Variations:</strong>
                                Preparation techniques, spice balances, and accompanying condiments naturally vary across specific communities, villages, and households. Bharat Bhojan documents verified cultural baselines without claiming a single exclusive recipe.
                            </div>
                        </div>

                        <!-- Traditional Preparation Block -->
                        <div class="content-block">
                            <h2 class="content-block-title">
                                <span>🔥</span> Traditional Preparation Traditions
                            </h2>
                            <p class="content-block-text">${escapeHtml(food.traditional_preparation)}</p>
                        </div>

                        <!-- Seasonality Context Block -->
                        <div class="content-block">
                            <h2 class="content-block-title">
                                <span>🌾</span> Seasonality & Ritu Associations
                            </h2>
                            <p class="content-block-text">${escapeHtml(food.seasonality_notes)}</p>
                            ${food.festival_context && food.festival_context.trim() ? `
                                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                                    <strong style="color: var(--primary);">Festival & Ceremonial Role:</strong>
                                    <p style="margin-top: 0.25rem;">${escapeHtml(food.festival_context)}</p>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Serving Traditions -->
                        ${food.serving_tradition && food.serving_tradition.trim() ? `
                            <div class="content-block">
                                <h2 class="content-block-title">
                                    <span>🍃</span> Serving Customs & Accompaniments
                                </h2>
                                <p class="content-block-text">${escapeHtml(food.serving_tradition)}</p>
                            </div>
                        ` : ''}

                        <!-- Scholarly & Institutional References -->
                        <div class="content-block">
                            <h2 class="content-block-title">
                                <span>📚</span> Credible Sources & References
                            </h2>
                            <p style="font-size: 0.9rem; color: var(--medium-slate); margin-bottom: 1.25rem;">
                                Sourced from government cultural departments, university publications, and authoritative culinary history archives.
                            </p>
                            ${referencesHtml}
                        </div>
                    </div>

                    <!-- Right Sticky Column: Ingredients -->
                    <aside class="detail-sidebar">
                        <div class="ingredients-card">
                            <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--primary); margin-bottom: 0.25rem;">
                                Key Ingredients
                            </h3>
                            <p style="font-size: 0.85rem; color: var(--light-slate); margin-bottom: 1rem;">
                                Traditional agrarian ingredients and native spices
                            </p>
                            <ul class="ingredients-list">
                                ${ingredientsHtml}
                            </ul>
                        </div>
                    </aside>
                </div>

                <!-- Related Regional Dishes -->
                ${relatedHtml}
            </div>
        </main>
    `;
}

function showNotFound(slug) {
    const mainContainer = document.getElementById('foodDetailContent');
    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <div class="container" style="padding: 4rem 1.5rem;">
            <div class="state-container">
                <div class="state-icon">🔍</div>
                <h2 class="state-title">Dish Record Not Found</h2>
                <p class="state-desc">
                    No culinary archive found for identifier: <strong>"${escapeHtml(slug)}"</strong>.
                    It may have been renamed, removed, or yet to be cataloged.
                </p>
                <a href="/explore.html" class="btn btn-primary">Browse All Traditional Foods</a>
            </div>
        </div>
    `;
}

function showError(message) {
    const mainContainer = document.getElementById('foodDetailContent');
    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <div class="container" style="padding: 4rem 1.5rem;">
            <div class="state-container">
                <div class="state-icon">⚠️</div>
                <h2 class="state-title">An Error Occurred</h2>
                <p class="state-desc">${escapeHtml(message)}</p>
                <a href="/explore.html" class="btn btn-secondary">Return to Exploration</a>
            </div>
        </div>
    `;
}
