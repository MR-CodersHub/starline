/**
 * User Dashboard Unified Logic
 * Handles Profile, Saved Properties, and Activity History
 */

document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

function initPage() {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : (JSON.parse(localStorage.getItem('starline_auth_token')) || JSON.parse(localStorage.getItem('starline_user')));

    // Update Global Headers/Dates
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName) welcomeName.textContent = user ? user.name : 'Guest';

    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    }

    // Set Active Menu Link correctly (for cross-page consistency)
    const currentPath = window.location.pathname;
    document.querySelectorAll('.menu-link').forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Page Specific Logic
    if (window.location.pathname.includes('profile.html')) initProfile(user);
    if (window.location.pathname.includes('saved-properties.html')) initSavedProperties(user);
    if (window.location.pathname.includes('activity.html')) initActivity(user);
    if (window.location.pathname.includes('index.html')) initDashboard(user);
}

function initDashboard(user) {
    const stats = AdminState.getDashboardStats();
    const savedCount = document.getElementById('saved-count');
    if (savedCount) {
        const userSaved = AdminState.getSavedProperties(user ? user.id : null);
        savedCount.textContent = userSaved.length;
    }

    const activitySummary = document.getElementById('activity-summary');
    if (activitySummary) {
        const logs = user ? AdminState.getActivity().filter(l => l.userEmail === user.email) : [];
        if (logs.length > 0) {
            const lastLog = logs[0];
            activitySummary.innerHTML = `
                <div style="font-weight: 600; color: #0f172a;">${lastLog.action}</div>
                <div style="font-size: 0.85rem; margin-top: 5px; color: #64748b;">${new Date(lastLog.timestamp).toLocaleString()}</div>
            `;
        }
    }
}

function initProfile(user) {
    const nameInp = document.getElementById('profile-name');
    const emailInp = document.getElementById('profile-email');
    if (nameInp) nameInp.value = user ? user.name : '';
    if (emailInp) emailInp.value = user ? user.email : '';

    const editBtn = document.querySelector('button.menu-link.active'); // The "Edit Profile" button
    if (editBtn && user) {
        editBtn.addEventListener('click', () => {
            const newName = prompt('Enter your new name:', user.name);
            if (newName && newName !== user.name) {
                AdminState.updateUser(user.id, { name: newName });
                location.reload();
            }
        });
    }
}

function initSavedProperties(user) {
    const grid = document.getElementById('saved-grid');
    if (!grid) return;

    const savedIds = AdminState.getSavedProperties(user ? user.id : null);
    const allProps = AdminState.getProperties();
    // Also check dashboard-core properties since they might be different
    const coreProps = typeof getProperties === 'function' ? getProperties() : [];

    // Merge properties for display (prefer coreProps for details if title/image match)
    const myProps = [...allProps, ...coreProps].filter(p => savedIds.includes(p.id));

    // Deduplicate by ID
    const uniqueProps = Array.from(new Map(myProps.map(item => [item.id, item])).values());

    if (uniqueProps.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1;">
                <p style="color: #64748b; font-size: 1.1rem;">You haven't saved any properties yet.</p>
                <a href="../../public/pages/listings.html" class="menu-link active" style="display: inline-block; margin-top: 20px; text-decoration: none;">Explore Listings</a>
            </div>
        `;
        return;
    }

    grid.innerHTML = uniqueProps.map(prop => `
        <div class="stat-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div style="height: 160px; position: relative;">
                <img src="${typeof getCorrectImagePath === 'function' ? getCorrectImagePath(prop.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800') : (prop.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800')}" 
                     style="width: 100%; height: 100%; object-fit: cover;" 
                     onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'">
                <div style="position: absolute; top: 12px; right: 12px;">
                    <span class="status-badge" style="background: rgba(255,255,255,0.9); color: #000; font-size: 0.7rem; font-weight: 700;">${prop.status || 'Available'}</span>
                </div>
            </div>
            <div style="padding: 20px;">
                <h4 style="font-size: 1.1rem; margin-bottom: 5px; color: #0f172a;">${prop.name || prop.title}</h4>
                <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 12px;">${prop.location}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: 700; font-size: 1.25rem; color: #0f172a;">$${prop.price.toLocaleString()}</div>
                    <button onclick="handleRemoveSaved(${prop.id})" style="background: none; border: none; color: #ff7675; cursor: pointer; font-size: 0.8rem; font-weight: 600;">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

function handleRemoveSaved(propertyId) {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : (JSON.parse(localStorage.getItem('starline_auth_token')) || JSON.parse(localStorage.getItem('starline_user')));
    if (!user) return;

    toggleSaveProperty(user.id, propertyId);
    if (typeof UIUtils !== 'undefined') {
        UIUtils.showToast('Property removed from your dashboard.', 'success');
    }
    initSavedProperties(user);

    // Update dashboard count if element exists
    const savedCount = document.getElementById('saved-count');
    if (savedCount) {
        const userSaved = AdminState.getSavedProperties(user.id);
        savedCount.textContent = userSaved.length;
    }
}

function initActivity(user) {
    const container = document.querySelector('.table-container');
    if (!container) return;

    const logs = user ? AdminState.getActivity().filter(l => l.userEmail === user.email) : [];
    if (logs.length === 0) return;

    container.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="text-align: left; border-bottom: 1px solid #f1f5f9;">
                    <th style="padding: 15px;">Action</th>
                    <th style="padding: 15px;">Date & Time</th>
                    <th style="padding: 15px;">Status</th>
                </tr>
            </thead>
            <tbody>
                ${logs.map(log => `
                    <tr style="border-bottom: 1px solid #f8fafc;">
                        <td style="padding: 15px; font-weight: 600;">${log.action}</td>
                        <td style="padding: 15px; color: #64748b;">${new Date(log.timestamp).toLocaleString()}</td>
                        <td style="padding: 15px;"><span class="status-badge" style="background: #f0fdf4; color: #166534;">Success</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
