// Core Auth Config (Used by Login/Dashboards)
const AUTH_CONFIG = {
    ADMIN_EMAIL: 'admin@starline.com',
    ADMIN_PASS: 'Starline123',
    STORAGE_KEY: 'starline_auth_token'
};



// Authentication Logic
function getAuthUser() {
    const data = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

function handleLogout() {
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
    window.location.href = getRootPath() + 'login.html';
}

function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.type = field.type === 'password' ? 'text' : 'password';
    }
}

// Initialize Navbar and User UI
document.addEventListener('DOMContentLoaded', () => {
    // Navbar Toggle
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (email === AUTH_CONFIG.ADMIN_EMAIL && password === AUTH_CONFIG.ADMIN_PASS) {
                const userData = { email, name: 'Starline Admin', role: 'admin', loginTime: Date.now() };
                localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(userData));
                window.location.href = getRootPath() + 'auth/admin-dashboard/index.html';
            } else {
                const errorMsg = document.getElementById('error-message');
                if (errorMsg) {
                    errorMsg.textContent = 'Invalid credentials. Use admin@starline.com';
                    errorMsg.style.display = 'block';
                }
            }
        });
    }

    // Init User Header (Handled globally by ui-utils.js)

    // Property Rendering & Pagination
    if (document.querySelector('.property-grid')) {
        const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('home.html');
        let visibleCount = isHomePage ? 3 : 4;
        const getProps = () => {
            let props = typeof AdminState !== 'undefined' ? AdminState.getProperties() : [];
            const urlParams = new URLSearchParams(window.location.search);
            const searchTerm = urlParams.get('search');
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                props = props.filter(p =>
                    p.name.toLowerCase().includes(term) ||
                    p.location.toLowerCase().includes(term)
                );
            }
            return props;
        };
        let properties = getProps();
        const grid = document.querySelector('.property-grid');
        const loadMoreBtn = document.querySelector('button.btn-outline[style*="border-color: var(--border-strong)"]');

        function renderProperties() {
            properties = getProps();
            console.log('Starline: Rendering ' + properties.length + ' properties. Current visible: ' + visibleCount);

            if (properties.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No properties found. Please refresh to reset data.</p>';
                return;
            }

            grid.innerHTML = '';
            const toShow = properties.slice(0, visibleCount);

            toShow.forEach(prop => {
                console.log('Starline: Rendering property: ' + prop.name + ' - Image: ' + (prop.image ? 'Yes' : 'No'));
                const card = document.createElement('div');
                card.className = 'property-card';

                // Ensure placeholder if image is null
                const rawImg = prop.image && prop.image.trim() !== '' ? prop.image : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800';
                const imageUrl = typeof getCorrectImagePath === 'function' ? getCorrectImagePath(rawImg) : rawImg;

                card.innerHTML = `
                    <div class="property-image-container" style="position: relative; overflow: hidden; height: 260px; background: #eee;">
                        <img src="${imageUrl}" 
                             alt="${prop.name}" 
                             class="property-thumb" 
                             style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease;"
                             onerror="this.src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800'; console.error('Image load failed for: ' + this.src)">
                        <div class="status-badge" style="position: absolute; top: 15px; right: 15px; background: ${prop.status === 'Available' ? '#ecfdf5' : '#fef2f2'}; color: ${prop.status === 'Available' ? '#059669' : '#ef4444'}; padding: 6px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase;">${prop.status}</div>
                        <button class="favorite-btn" data-id="${prop.id}" style="position: absolute; top: 15px; left: 15px; width: 36px; height: 36px; border-radius: 50%; border: none; background: rgba(255,255,255,0.9); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; z-index: 10;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="heart-icon">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="property-content">
                        <div style="margin-bottom: 8px;">
                            <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted);">${prop.location}</span>
                        </div>
                        <h3 style="margin-bottom: 12px; font-size: 1.2rem; font-weight: 700;">${prop.name}</h3>
                        <p style="font-weight: 800; color: var(--text-main); font-size: 1.1rem; letter-spacing: -0.5px;">$${Number(prop.price).toLocaleString()}</p>
                    </div>
                `;
                card.onclick = () => window.location.href = getRootPath() + `public/pages/property.html?id=${prop.id}`;
                grid.appendChild(card);

                // Favorite Toggle Logic
                const favBtn = card.querySelector('.favorite-btn');
                const heartIcon = favBtn.querySelector('.heart-icon');

                // Check if already saved
                const currentUser = getAuthUser();
                if (currentUser && typeof AdminState !== 'undefined') {
                    const savedItems = AdminState.getSavedProperties(currentUser.email);
                    if (savedItems.includes(prop.id)) {
                        heartIcon.setAttribute('fill', '#ef4444');
                        heartIcon.setAttribute('stroke', '#ef4444');
                    }
                }

                favBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!currentUser) {
                        if (typeof UIUtils !== 'undefined') UIUtils.showToast('Please login to save properties', 'error');
                        else alert('Please login to save properties');
                        return;
                    }

                    const isAdded = AdminState.toggleSavedProperty(currentUser.email, prop.id);
                    if (isAdded) {
                        heartIcon.setAttribute('fill', '#ef4444');
                        heartIcon.setAttribute('stroke', '#ef4444');
                        if (typeof UIUtils !== 'undefined') UIUtils.showToast('Added to favorites');
                    } else {
                        heartIcon.setAttribute('fill', 'none');
                        heartIcon.setAttribute('stroke', 'currentColor');
                        if (typeof UIUtils !== 'undefined') UIUtils.showToast('Removed from favorites', 'info');
                    }
                });
            });

            if (visibleCount >= properties.length) {
                if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            }
        }

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                visibleCount += 2;
                renderProperties();
            });
        }

        renderProperties();
    }
});
