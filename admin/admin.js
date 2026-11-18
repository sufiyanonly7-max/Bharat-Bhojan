/**
 * Bharat Bhojan - Administrator Client Logic
 * Handles session verification, dashboard population, CRUD operations, and form validation.
 */

// Global state
let currentAdminUser = null;

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('login.html')) {
        initLoginPage();
    } else if (path.includes('dashboard.html')) {
        verifyAuth(() => initDashboardPage());
    } else if (path.includes('food-form.html')) {
        verifyAuth(() => initFoodFormPage());
    }
});

/**
 * Verify active admin session
 */
async function verifyAuth(onSuccess) {
    try {
        const response = await fetch('/api/admin/check-auth');
        const json = await response.json();

        if (json.authenticated) {
            currentAdminUser = json.user;
            const userDisplay = document.getElementById('adminUsernameDisplay');
            if (userDisplay) userDisplay.textContent = json.user.username;
            if (onSuccess) onSuccess();
        } else {
            window.location.href = '/admin/login.html';
        }
    } catch (err) {
        console.error('Auth verification error:', err);
        window.location.href = '/admin/login.html';
    }
}

/**
 * Global Admin Logout Handler
 */
window.handleLogout = async function() {
    try {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = '/admin/login.html';
    } catch (err) {
        console.error('Logout error:', err);
        window.location.href = '/admin/login.html';
    }
};

/**
 * ====================================================
 * LOGIN PAGE LOGIC
 * ====================================================
 */
function initLoginPage() {
    const form = document.getElementById('adminLoginForm');
    const alertBox = document.getElementById('loginAlert');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        alertBox.className = 'admin-alert';
        alertBox.style.display = 'none';

        const username = document.getElementById('username')?.value.trim();
        const password = document.getElementById('password')?.value;

        if (!username || !password) {
            showLoginAlert('Please enter both username and password.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying Credentials...';

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const json = await response.json();

            if (response.ok && json.success) {
                showLoginAlert('Login successful! Redirecting to Dashboard...', 'success');
                setTimeout(() => {
                    window.location.href = '/admin/dashboard.html';
                }, 600);
            } else {
                showLoginAlert(json.message || 'Invalid administrator credentials.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In to Portal';
            }
        } catch (err) {
            console.error('Login error:', err);
            showLoginAlert('Failed to connect to authentication server.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In to Portal';
        }
    });
}

function showLoginAlert(msg, type) {
    const alertBox = document.getElementById('loginAlert');
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `admin-alert ${type}`;
    alertBox.style.display = 'block';
}

/**
 * ====================================================
 * DASHBOARD PAGE LOGIC
 * ====================================================
 */
async function initDashboardPage() {
    loadDashboardData();

    // Table search filter
    const searchInput = document.getElementById('tableSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#adminFoodsTableBody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }
}

async function loadDashboardData() {
    const tbody = document.getElementById('adminFoodsTableBody');
    if (!tbody) return;

    try {
        const response = await fetch('/api/admin/dashboard');
        const json = await response.json();

        if (!json.success || !json.data) {
            throw new Error(json.message || 'Failed to load dashboard.');
        }

        const { stats, foods } = json.data;

        // Populate Stat Cards
        document.getElementById('statTotalFoods').textContent = stats.total_foods || 0;
        document.getElementById('statTotalStates').textContent = stats.total_states || 0;
        document.getElementById('statTotalRegions').textContent = stats.total_regions || 0;
        document.getElementById('statTotalRefs').textContent = stats.total_references || 0;
        document.getElementById('statVegRatio').textContent = `${stats.vegetarian_foods} Veg / ${stats.non_vegetarian_foods} Non-Veg`;

        // Populate Table
        if (foods.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem;">No foods cataloged yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = foods.map(f => {
            const dietBadge = f.veg_type === 'Vegetarian'
                ? '<span style="color: #2E7D32; font-weight: 700;">🟢 Veg</span>'
                : '<span style="color: #C62828; font-weight: 700;">🔴 Non-Veg</span>';

            return `
                <tr data-id="${f.id}">
                    <td><strong>#${f.id}</strong></td>
                    <td>
                        <img src="${escapeHtml(f.image_url || '/assets/images/placeholder.svg')}"
                             alt="${escapeHtml(f.name)}"
                             class="table-thumb"
                             onerror="this.src='/assets/images/placeholder.svg'" />
                    </td>
                    <td>
                        <div style="font-weight: 700; color: var(--admin-text);">${escapeHtml(f.name)}</div>
                        ${f.local_name ? `<div style="font-size: 0.8rem; color: var(--admin-muted);">${escapeHtml(f.local_name)}</div>` : ''}
                    </td>
                    <td>${escapeHtml(f.state_name)} <span style="font-size: 0.8rem; color: var(--admin-muted);">(${escapeHtml(f.region_name)})</span></td>
                    <td>${escapeHtml(f.category_name)}</td>
                    <td>${dietBadge}</td>
                    <td>
                        <div class="action-btn-group">
                            <a href="/food.html?slug=${encodeURIComponent(f.slug)}" target="_blank" class="btn-action-edit" title="Preview public view">
                                View
                            </a>
                            <a href="/admin/food-form.html?id=${f.id}" class="btn-action-edit" title="Edit food record">
                                ✏️ Edit
                            </a>
                            <button type="button" class="btn-action-del" onclick="handleDeleteFood(${f.id}, '${escapeHtml(f.name)}')" title="Delete food record">
                                🗑️ Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (err) {
        console.error('Failed to load dashboard:', err);
        tbody.innerHTML = `<tr><td colspan="7" style="color: red; text-align: center; padding: 2rem;">Error: ${escapeHtml(err.message)}</td></tr>`;
    }
}

/**
 * Handle Food Record Deletion
 */
window.handleDeleteFood = async function(id, foodName) {
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${foodName}" (ID #${id})?\n\nThis will remove the food record and its associations with ingredients and seasons from the database.`);

    if (!confirmed) return;

    try {
        const response = await fetch(`/api/admin/foods/${id}`, {
            method: 'DELETE'
        });

        const json = await response.json();

        if (response.ok && json.success) {
            alert(`✓ Success: ${json.message}`);
            // Reload dashboard metrics and table
            loadDashboardData();
        } else {
            alert(`Error: ${json.message || 'Failed to delete food record.'}`);
        }
    } catch (err) {
        console.error('Delete error:', err);
        alert('Network or server error while deleting food record.');
    }
};

/**
 * ====================================================
 * ADD / EDIT FOOD FORM LOGIC
 * ====================================================
 */
let isEditMode = false;
let editingFoodId = null;

async function initFoodFormPage() {
    const params = new URLSearchParams(window.location.search);
    editingFoodId = params.get('id');
    isEditMode = Boolean(editingFoodId);

    // Update Form Title
    const titleEl = document.getElementById('formTitle');
    const submitBtn = document.getElementById('formSubmitBtn');

    if (isEditMode) {
        if (titleEl) titleEl.textContent = `Edit Food Record #${editingFoodId}`;
        if (submitBtn) submitBtn.textContent = 'Save Changes';
    } else {
        if (titleEl) titleEl.textContent = 'Add New Traditional Food Record';
        if (submitBtn) submitBtn.textContent = 'Create Food Record';
    }

    // Load Dropdown Options (States, Categories, Seasons, References)
    await loadFormMetadata();

    // Setup Dynamic Ingredient Add Button
    const addIngBtn = document.getElementById('addIngredientRowBtn');
    if (addIngBtn) {
        addIngBtn.addEventListener('click', () => addIngredientRow());
    }

    // If Edit Mode, load existing food record
    if (isEditMode) {
        await loadExistingFoodData(editingFoodId);
    } else {
        // Add 3 initial ingredient rows for convenient entry
        addIngredientRow('Whole Wheat Flour / Sattu', '2 cups', true);
        addIngredientRow('Mustard Oil / Desi Ghee', '2 tbsp', true);
        addIngredientRow('Ajwain / Spices', '1 tsp', false);
    }

    // Attach form submit handler
    const form = document.getElementById('foodForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

async function loadFormMetadata() {
    try {
        const [statesRes, catsRes, seasonsRes, refsRes] = await Promise.all([
            fetch('/api/states').then(r => r.json()),
            fetch('/api/categories').then(r => r.json()),
            fetch('/api/seasons').then(r => r.json()),
            fetch('/api/references').then(r => r.json())
        ]);

        // Populate States Dropdown
        const stateSelect = document.getElementById('state_id');
        if (stateSelect && statesRes.success) {
            statesRes.data.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = `${s.name} (${s.region_name})`;
                stateSelect.appendChild(opt);
            });
        }

        // Populate Categories Dropdown
        const catSelect = document.getElementById('category_id');
        if (catSelect && catsRes.success) {
            catsRes.data.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = c.name;
                catSelect.appendChild(opt);
            });
        }

        // Populate Seasons Checkboxes
        const seasonsBox = document.getElementById('seasonsCheckboxContainer');
        if (seasonsBox && seasonsRes.success) {
            seasonsBox.innerHTML = seasonsRes.data.map(sn => `
                <label style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; cursor: pointer; margin-right: 1rem;">
                    <input type="checkbox" name="seasons" value="${sn.id}">
                    ${escapeHtml(sn.name)}
                </label>
            `).join('');
        }

        // Populate References Checkboxes
        const refsBox = document.getElementById('refsCheckboxContainer');
        if (refsBox && refsRes.success) {
            refsBox.innerHTML = refsRes.data.map(r => `
                <label style="display: block; font-size: 0.85rem; cursor: pointer; margin-bottom: 0.5rem; line-height: 1.4;">
                    <input type="checkbox" name="references" value="${r.id}">
                    <strong>${escapeHtml(r.title)}</strong> (${escapeHtml(r.author || r.publisher || '')})
                </label>
            `).join('');
        }

    } catch (err) {
        console.error('Failed to load form metadata:', err);
    }
}

function addIngredientRow(name = '', qty = '', isPrimary = false) {
    const container = document.getElementById('ingredientsContainer');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'ingredient-row';
    row.innerHTML = `
        <input type="text" class="admin-input ing-name" placeholder="Ingredient name (e.g. Sattu)" value="${escapeHtml(name)}" required />
        <input type="text" class="admin-input ing-qty" placeholder="Quantity or note (e.g. 2 cups)" value="${escapeHtml(qty)}" />
        <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem; cursor: pointer;">
            <input type="checkbox" class="ing-primary" ${isPrimary ? 'checked' : ''} /> Key
        </label>
        <button type="button" class="btn-action-del" onclick="this.closest('.ingredient-row').remove()">✕</button>
    `;
    container.appendChild(row);
}

async function loadExistingFoodData(foodId) {
    try {
        const response = await fetch(`/api/admin/foods/${foodId}`);
        const json = await response.json();

        if (!response.ok || !json.success || !json.data) {
            alert('Could not find existing food record.');
            window.location.href = '/admin/dashboard.html';
            return;
        }

        const food = json.data;

        // Fill scalar inputs
        document.getElementById('name').value = food.name || '';
        document.getElementById('local_name').value = food.local_name || '';
        document.getElementById('state_id').value = food.state_id || '';
        document.getElementById('category_id').value = food.category_id || '';
        document.getElementById('veg_type').value = food.veg_type || 'Vegetarian';
        document.getElementById('featured').checked = Boolean(food.featured);
        document.getElementById('image_url').value = food.image_url || '';
        document.getElementById('short_description').value = food.short_description || '';
        document.getElementById('cultural_context').value = food.cultural_context || '';
        document.getElementById('traditional_preparation').value = food.traditional_preparation || '';
        document.getElementById('seasonality_notes').value = food.seasonality_notes || '';
        document.getElementById('festival_context').value = food.festival_context || '';
        document.getElementById('serving_tradition').value = food.serving_tradition || '';

        // Check seasons
        const seasonIds = food.seasons || [];
        document.querySelectorAll('input[name="seasons"]').forEach(chk => {
            chk.checked = seasonIds.includes(Number(chk.value));
        });

        // Check references
        const refIds = food.references || [];
        document.querySelectorAll('input[name="references"]').forEach(chk => {
            chk.checked = refIds.includes(Number(chk.value));
        });

        // Populate Ingredients
        const container = document.getElementById('ingredientsContainer');
        container.innerHTML = '';
        if (food.ingredients && food.ingredients.length > 0) {
            food.ingredients.forEach(ing => {
                addIngredientRow(ing.name, ing.quantity_or_note, ing.is_primary);
            });
        } else {
            addIngredientRow();
        }

    } catch (err) {
        console.error('Error fetching food data:', err);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const alertBox = document.getElementById('formAlert');
    alertBox.className = 'admin-alert';
    alertBox.style.display = 'none';

    // Gather Ingredients
    const ingredientRows = document.querySelectorAll('.ingredient-row');
    const ingredients = [];
    ingredientRows.forEach(row => {
        const name = row.querySelector('.ing-name')?.value.trim();
        const qty = row.querySelector('.ing-qty')?.value.trim();
        const isPrimary = row.querySelector('.ing-primary')?.checked;
        if (name) {
            ingredients.push({
                name: name,
                quantity: qty,
                is_primary: isPrimary ? 1 : 0
            });
        }
    });

    // Gather Seasons
    const selectedSeasons = [];
    document.querySelectorAll('input[name="seasons"]:checked').forEach(chk => {
        selectedSeasons.push(Number(chk.value));
    });

    // Gather References
    const selectedRefs = [];
    document.querySelectorAll('input[name="references"]:checked').forEach(chk => {
        selectedRefs.push(Number(chk.value));
    });

    const payload = {
        name: document.getElementById('name').value.trim(),
        local_name: document.getElementById('local_name').value.trim(),
        state_id: Number(document.getElementById('state_id').value),
        category_id: Number(document.getElementById('category_id').value),
        veg_type: document.getElementById('veg_type').value,
        featured: document.getElementById('featured').checked ? 1 : 0,
        image_url: document.getElementById('image_url').value.trim(),
        short_description: document.getElementById('short_description').value.trim(),
        cultural_context: document.getElementById('cultural_context').value.trim(),
        traditional_preparation: document.getElementById('traditional_preparation').value.trim(),
        seasonality_notes: document.getElementById('seasonality_notes').value.trim(),
        festival_context: document.getElementById('festival_context').value.trim(),
        serving_tradition: document.getElementById('serving_tradition').value.trim(),
        ingredients: ingredients,
        seasons: selectedSeasons,
        references: selectedRefs
    };

    const submitBtn = document.getElementById('formSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving Record to Database...';

    const url = isEditMode ? `/api/admin/foods/${editingFoodId}` : '/api/admin/foods';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const json = await response.json();

        if (response.ok && json.success) {
            alertBox.textContent = `✓ Success: ${json.message}`;
            alertBox.className = 'admin-alert success';
            alertBox.style.display = 'block';

            // Scroll to alert
            alertBox.scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                window.location.href = '/admin/dashboard.html';
            }, 1200);
        } else {
            alertBox.textContent = `Error: ${json.message || 'Operation failed.'}`;
            alertBox.className = 'admin-alert error';
            alertBox.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = isEditMode ? 'Save Changes' : 'Create Food Record';
        }
    } catch (err) {
        console.error('Submit error:', err);
        alertBox.textContent = 'Failed to communicate with database server.';
        alertBox.className = 'admin-alert error';
        alertBox.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = isEditMode ? 'Save Changes' : 'Create Food Record';
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
