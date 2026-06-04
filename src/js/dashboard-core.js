/**
 * Dashboard Core - Data Persistence & Management
 * Starline - Dashboard Logic & Data Persistence
 * Uses localStorage to simulate a database for properties, inquiries, and user actions.
 */

const STORAGE_KEYS = {
    PROPERTIES: 'starline_properties',
    INQUIRIES: 'starline_inquiries',
    SAVED: 'starline_saved_items'
};

const DEFAULT_PROPERTIES = [
    {
        id: 1,
        title: "The Glass House",
        location: "Malibu, CA",
        price: 4500000,
        type: "Villa",
        beds: 5,
        baths: 4,
        sqft: 4200,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200",
        dateAdded: '2026-02-10'
    },
    {
        id: 2,
        title: "Modern Minimalist Loft",
        location: "SoHo, New York",
        price: 2800000,
        type: "Apartment",
        beds: 3,
        baths: 2,
        sqft: 2100,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200",
        dateAdded: '2026-02-12'
    },
    {
        id: 3,
        title: "Zen Garden Estate",
        location: "Kizu, Kyoto",
        price: 1200000,
        type: "House",
        beds: 4,
        baths: 3,
        sqft: 3500,
        image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1200",
        dateAdded: '2026-02-14'
    }
];

// --- Property Management ---

function getProperties() {
    const stored = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(DEFAULT_PROPERTIES));
        return DEFAULT_PROPERTIES;
    }
    return JSON.parse(stored);
}

function addProperty(property) {
    const properties = getProperties();
    const newProperty = {
        ...property,
        id: Date.now(),
        dateAdded: new Date().toISOString().split('T')[0]
    };
    properties.unshift(newProperty);
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    return newProperty;
}

// --- Inquiry Management ---

function getInquiries() {
    const stored = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    return stored ? JSON.parse(stored) : [];
}

function addInquiry(inquiry) {
    const inquiries = getInquiries();
    const newInquiry = {
        ...inquiry,
        id: Date.now(),
        date: new Date().toLocaleString(),
        status: 'New'
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    return newInquiry;
}

// --- User Interactions (Saved Properties) ---

function getSavedItems(userId) {
    const stored = localStorage.getItem(STORAGE_KEYS.SAVED);
    const allSaved = stored ? JSON.parse(stored) : {};
    return allSaved[userId] || [];
}

function toggleSaveProperty(userId, propertyId) {
    const stored = localStorage.getItem(STORAGE_KEYS.SAVED);
    const allSaved = stored ? JSON.parse(stored) : {};

    if (!allSaved[userId]) allSaved[userId] = [];

    const index = allSaved[userId].indexOf(propertyId);
    if (index === -1) {
        allSaved[userId].push(propertyId);
    } else {
        allSaved[userId].splice(index, 1);
    }

    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(allSaved));
    return allSaved[userId];
}

function isPropertySaved(userId, propertyId) {
    const saved = getSavedItems(userId);
    return saved.includes(propertyId);
}

// Format price with currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
}
// --- Stat Simulation ---

function getDashboardStats() {
    // Generate slightly dynamic stats for a "live" feel
    const hourSeed = new Date().getHours();
    const daySeed = new Date().getDate();

    return {
        totalSales: formatCurrency(12400000 + (daySeed * 50000) + (hourSeed * 2000)),
        activeUsers: (1200 + (daySeed * 10) + (hourSeed)).toLocaleString(),
        newInquiries: getInquiries().length,
        totalProperties: getProperties().length
    };
}
