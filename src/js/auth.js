/**
 * Starline - Secure Authentication & Session Management
 * Production-ready Vanilla JS implementation
 */

const AUTH_CONFIG = {
    ADMIN_EMAIL: 'admin@starline.com',
    ADMIN_PASS: 'Starline123',
    STORAGE_KEY: 'starline_auth_token'
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Check for logout request in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('logout')) {
        handleLogout();
    }
});

/**
 * Handle Login Submission
 */
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');

    // Reset error
    if (errorMsg) errorMsg.style.display = 'none';

    if (email === AUTH_CONFIG.ADMIN_EMAIL && password === AUTH_CONFIG.ADMIN_PASS) {
        // Create an "auth token" (simulation)
        const userData = {
            email: email,
            name: 'Starline Admin',
            role: 'admin',
            loginTime: Date.now()
        };

        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(userData));

        // Success redirect
        const redirectPath = userData.role === 'admin' ? 'auth/admin-dashboard/index.html' : 'auth/user-dashboard/index.html';
        window.location.href = getRootPath() + redirectPath;
    } else {
        showError('Invalid credentials. Please use admin@starline.com.', errorMsg);
    }
}

/**
 * Security: Check if user is logged in (to be called in dashboard head)
 */
function checkAuth() {
    const user = getAuthUser();
    if (!user) {
        window.location.replace(getRootPath() + 'login.html');
        return false;
    }
    return true;
}

/**
 * Get current authenticated user
 */
function getAuthUser() {
    const data = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

/**
 * Handle Logout
 */
function handleLogout() {
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
    window.location.href = getRootPath() + 'login.html';
}

function showError(msg, element) {
    if (element) {
        element.textContent = msg;
        element.style.display = 'block';
    } else {
        alert(msg);
    }
}

function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.type = field.type === 'password' ? 'text' : 'password';
    }
}

function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

function showError(msg, element) {
    if (element) {
        element.textContent = msg;
        element.style.display = 'block';
        element.style.color = '#ff7675';
    } else {
        alert(msg);
    }
}

/**
 * Utility: Show Welcome Popup (Centered Professional Modal)
 */
function showWelcomePopup(user) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'welcome-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.4s ease;
    `;

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 60px;
        border-radius: 24px;
        width: 90%;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 20px rgba(45, 212, 191, 0.2);
        transform: scale(0.9) translateY(20px);
        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        border: 1px solid rgba(0,0,0,0.05);
        overflow: hidden;
    `;

    // Add light effect (glowing streak)
    const lightEffect = document.createElement('div');
    lightEffect.style.cssText = `
        position: absolute;
        top: -150%;
        left: -150%;
        width: 300%;
        height: 300%;
        background: linear-gradient(45deg, transparent, rgba(45, 212, 191, 0.05), transparent);
        transform: rotate(45deg);
        animation: lightStreak 4s infinite linear;
        pointer-events: none;
    `;

    // Add keyframes if not exist
    if (!document.getElementById('modal-animations')) {
        const style = document.createElement('style');
        style.id = 'modal-animations';
        style.textContent = `
            @keyframes lightStreak {
                0% { transform: translate(-10%, -10%) rotate(45deg); }
                100% { transform: translate(10%, 10%) rotate(45deg); }
            }
        `;
        document.head.appendChild(style);
    }
    modal.appendChild(lightEffect);

    modal.innerHTML += `
        <div style="width: 80px; height: 80px; background: #f8fafc; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; border: 1px solid #f1f5f9; position: relative; z-index: 1;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        </div>
        <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 12px; letter-spacing: -1px; color: #0f172a;">Welcome, ${user.name}</h2>
        <p style="color: #64748b; font-size: 1.1rem; line-height: 1.6; margin-bottom: 40px;">Professional access granted to ${user.role === 'admin' ? 'Starline Management' : 'your Starline portfolio'}. Experience the global standard in luxury curation.</p>
        <button id="close-welcome-btn" class="nav-cta" style="width: 100%; padding: 18px; border-radius: 12px; margin: 0; font-weight: 700; font-size: 1rem; cursor: pointer;">Enter Workspace</button>
        <p style="margin-top: 24px; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Managed by MrCodersHub</p>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Trigger animation
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1) translateY(0)';
    });

    const closeModal = () => {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.9) translateY(20px)';
        setTimeout(() => overlay.remove(), 400);
    };

    // Close on button click
    modal.querySelector('#close-welcome-btn').addEventListener('click', closeModal);

    // Close on escape key
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

/**
 * Header & Profile Dropdown Logic
 */
function initUserHeader() {
    const user = getCurrentUser();
    const navLinks = document.querySelector('.nav-links');
    const dashboardLink = document.getElementById('dashboard-link');

    if (user && navLinks && dashboardLink) {
        // Replace "Dashboard" button with User Menu
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu-container';

        userMenu.innerHTML = `
            <button class="user-profile-btn" id="userMenuBtn" style="background: #000; color: #fff; border: 1px solid rgba(255,255,255,0.1); width: 42px; height: 42px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); position: relative;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </button>
            <div class="user-dropdown" id="userDropdown">
                <div class="dropdown-header">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                        <span class="name" style="margin: 0;">${user.name}</span>
                        <div style="display: flex; align-items: center; gap: 6px; background: rgba(45, 212, 191, 0.1); padding: 4px 10px; border-radius: 20px;">
                            <span class="live-indicator" style="margin: 0;"></span>
                            <span style="font-size: 0.65rem; color: #2dd4bf; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Live</span>
                        </div>
                    </div>
                    <span class="email">${user.email}</span>
                </div>
                <a href="${getRootPath()}auth/${user.role}-dashboard/index.html" class="dropdown-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    Dashboard
                </a>
                <a href="${getRootPath()}auth/user-dashboard/profile.html" class="dropdown-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Profile Settings
                </a>
                <a href="#" class="dropdown-item logout" id="logoutBtn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                </a>
            </div>
        `;

        dashboardLink.replaceWith(userMenu);

        // Dropdown toggle
        const btn = document.getElementById('userMenuBtn');
        const dropdown = document.getElementById('userDropdown');
        if (btn && dropdown) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });

            // Close on click outside
            document.addEventListener('click', () => {
                dropdown.classList.remove('active');
            });
        }

        // Logout listener
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleLogout();
            });
        }
    } else if (dashboardLink) {
        dashboardLink.style.display = 'inline-flex';
        const root = typeof getRootPath === 'function' ? getRootPath() : '';
        dashboardLink.href = root + 'login.html';
        // Logged out: Add interactive tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'nav-tooltip';
        tooltip.textContent = 'Login to access your personalized dashboard';
        tooltip.style.cssText = `
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: #000;
            color: #fff;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.75rem;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            font-weight: 500;
        `;

        // Ensure nav-links or dashboardLink parent has relative position
        dashboardLink.style.position = 'relative';
        dashboardLink.appendChild(tooltip);

        dashboardLink.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateX(-50%) translateY(15px)';
        });

        dashboardLink.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateX(-50%) translateY(10px)';
        });
    }
}

function getCurrentUser() {
    const user = localStorage.getItem('starline_auth_token'); // Keep consistent with STORAGE_KEY
    return user ? JSON.parse(user) : null;
}

/**
 * Path Resolution Helper
 * Determines relative distance to root
 */
function getRootPath() {
    const depth = window.location.pathname.split('/').filter(p => p).length;
    // Since this project structure has:
    // root/
    // root/auth/
    // root/auth/user-dashboard/
    // We can count segments to determine how many levels deep we are.
    // However, on a local machine, pathname might include the workspace name.

    const path = window.location.pathname;
    if (path.includes('/auth/admin-dashboard/') || path.includes('/auth/user-dashboard/')) {
        return '../../';
    } else if (path.includes('/auth/')) {
        return '../';
    } else if (path.includes('/public/pages/')) {
        return '../../';
    }
    return '';
}
