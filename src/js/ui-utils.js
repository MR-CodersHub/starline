/**
 * UI Utilities - Toast Notifications & Common Helpers
 */

// Utility Functions and UI Helpers
function getRootPath() {
    const path = window.location.pathname;
    if (path.includes('/auth/admin-dashboard/') || path.includes('/auth/user-dashboard/')) return '../../';
    if (path.includes('/auth/')) return '../';
    if (path.includes('/public/pages/')) return '../../';
    return '';
}

function getCorrectImagePath(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    const root = getRootPath();
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    return root + cleanUrl;
}

window.getCorrectImagePath = getCorrectImagePath;

const UIUtils = {
    /**
     * Show a premium toast notification
     * @param {string} message 
     * @param {'success'|'error'|'info'} type 
     */
    showToast(message, type = 'success') {
        const id = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.id = id;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: white;
            color: #0f172a;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            border-left: 4px solid ${type === 'success' ? '#2dd4bf' : type === 'error' ? '#ff7675' : '#3b82f6'};
        `;

        const icon = type === 'success' ?
            `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>` :
            `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

        toast.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: #f8fafc; border-radius: 50%;">${icon}</div>
            <div style="font-size: 0.95rem; font-weight: 600;">${message}</div>
        `;

        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    },

    initCommonUI() {
        // Newsletter Handler
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = form.querySelector('input[type="email"]');
                if (emailInput && emailInput.value) {
                    this.showToast('Subscribed! Check your inbox soon.');
                    form.reset();
                }
            });
        });

        // Global Dashboard Link sync
        const userStr = localStorage.getItem('starline_auth_token');
        const dashboardLink = document.getElementById('dashboard-link');
        if (dashboardLink) {
            const root = typeof getRootPath === 'function' ? getRootPath() : '';
            const userMenuContainer = document.createElement('div');
            userMenuContainer.className = 'user-menu-container';
            userMenuContainer.style.position = 'relative';
            
            if (userStr) {
                const user = JSON.parse(userStr);
                userMenuContainer.innerHTML = `
                    <button class="user-profile-btn" id="userMenuBtn" style="background: #000; color: #fff; border: 1px solid rgba(255,255,255,0.1); width: 42px; height: 42px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); position: relative;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <div class="dropdown-header">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                                <span class="name" style="margin: 0; font-weight: 700; color: #000;">${user.name}</span>
                                <div style="display: flex; align-items: center; gap: 6px; background: rgba(45, 212, 191, 0.1); padding: 4px 10px; border-radius: 20px;">
                                    <span class="live-indicator" style="margin: 0;"></span>
                                    <span style="font-size: 0.65rem; color: #2dd4bf; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Live</span>
                                </div>
                            </div>
                            <span class="email" style="font-size: 0.8rem; color: var(--text-muted);">${user.email}</span>
                        </div>
                        <a href="${root}auth/${user.role}-dashboard/index.html" class="dropdown-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                            Dashboard
                        </a>
                        <a href="${root}auth/user-dashboard/profile.html" class="dropdown-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            Profile Settings
                        </a>
                        <a href="#" class="dropdown-item logout" id="logoutBtn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            Sign Out
                        </a>
                    </div>
                `;
            } else {
                userMenuContainer.innerHTML = `
                    <button class="nav-cta" id="userMenuBtn" style="cursor: pointer; display: inline-flex; align-items: center; justify-content: center; border: 1px solid transparent; background: var(--text-main); color: #fff; width: 40px; height: 40px; padding: 0; border-radius: 50%; text-decoration: none;" title="Account">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="${root}login.html" class="dropdown-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                            Login/Signup
                        </a>
                        <a href="${root}auth/admin-dashboard/index.html" class="dropdown-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="9" y1="9" x2="21" y2="9"/><line x1="9" y1="15" x2="21" y2="15"/></svg>
                            Admin Dashboard
                        </a>
                        <a href="${root}auth/user-dashboard/index.html" class="dropdown-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            User Dashboard
                        </a>
                    </div>
                `;
            }
            
            dashboardLink.replaceWith(userMenuContainer);

            // Toggle logic for dropdown
            const btn = userMenuContainer.querySelector('#userMenuBtn');
            const dropdown = userMenuContainer.querySelector('#userDropdown');
            if (btn && dropdown) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                });

                // Close dropdown on click outside
                document.addEventListener('click', () => {
                    dropdown.classList.remove('active');
                });
            }

            // Logout logic
            const logoutBtn = userMenuContainer.querySelector('#logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('starline_auth_token');
                    window.location.href = root + 'login.html';
                });
            }
        }
    }
};

window.UIUtils = UIUtils;

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => {
    UIUtils.initCommonUI();
});
