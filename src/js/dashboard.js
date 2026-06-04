/**
 * Starline Dashboard - Unified State & Logic
 * Consolidation of AdminState and Dashboard Logic
 */

const STORAGE_KEYS = {
    PROPERTIES: 'starline_properties',
    INQUIRIES: 'starline_inquiries',
    USERS: 'starline_users',
    ACTIVITY: 'starline_activity',
    SAVED: 'starline_saved_items'
};

const AdminState = {
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
            localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify([
                { id: 1, name: "The Glass House", location: "Malibu, CA", price: 4500000, status: "Available", created: "2026-02-10" },
                { id: 2, name: "Zen Garden Estate", location: "Kyoto, Japan", price: 1200000, status: "Available", created: "2026-02-12" }
            ]));
        }
    },
    getProperties() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES)) || []; },
    getInquiries() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES)) || []; },
    getActivity() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY)) || []; },
    getSavedProperties(userId) {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED)) || {};
        return saved[userId] || [];
    },
    getDashboardStats() {
        const props = this.getProperties();
        return {
            totalProperties: props.length,
            availableProperties: props.filter(p => p.status === 'Available').length,
            totalValue: props.reduce((sum, p) => sum + p.price, 0)
        };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AdminState.init();

    const getSessionUser = () => {
        if (typeof getAuthUser === 'function') return getAuthUser();
        if (typeof getCurrentUser === 'function') return getCurrentUser();
        const stored = localStorage.getItem('starline_auth_token') || localStorage.getItem('starline_user');
        return stored ? JSON.parse(stored) : null;
    };
    const user = getSessionUser();


    if (user) {
        // Welcome logic
        const welcomeName = document.getElementById('welcome-name');
        if (welcomeName) welcomeName.textContent = user.name;

        // Render stats if containers exist
        const totalPropEl = document.getElementById('total-properties-stat');
        if (totalPropEl) {
            const stats = AdminState.getDashboardStats();
            totalPropEl.textContent = stats.totalProperties;
        }
    }
});
