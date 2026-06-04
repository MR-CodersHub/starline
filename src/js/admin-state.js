/**
 * Starline Admin State Management
 * Handles persistence and CRUD for Properties, Inquiries, and Users
 */

const STORAGE_KEYS = {
    PROPERTIES: 'starline_properties',
    INQUIRIES: 'starline_inquiries',
    USERS: 'starline_users',
    STATS: 'starline_admin_stats',
    ACTIVITY: 'starline_activity'
};

// Default Initial Data
const DEFAULT_DATA = {
    properties: [
        {
            id: 1,
            name: "The Glass Pavilion",
            location: "Beverly Hills, California",
            price: 12400000,
            status: "Available",
            created: "2026-02-10",
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
            beds: 6,
            baths: 8,
            sqft: 8500,
            description: "The Glass Pavilion is a groundbreaking architectural achievement located in the heart of Beverly Hills. Featuring steel and glass construction that blends seamlessly with the surrounding environment, it represents the absolute pinnacle of luxury living. With floor-to-ceiling glass walls, a world-class wine room, custom gallery space for up to 10 vehicles, and an infinity pool wrapping around the living wing, it is a structure without equal.",
            features: ["Infinity Pool", "Smart Home", "Wine Cellar", "10-Car Gallery", "Home Theater"],
            images: [
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
                "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800"
            ]
        },
        {
            id: 2,
            name: "Skyline Observatory",
            location: "Tribeca, New York",
            price: 8950000,
            status: "Available",
            created: "2026-02-12",
            image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
            beds: 4,
            baths: 5,
            sqft: 5200,
            description: "Perched high above the historic streets of Tribeca, the Skyline Observatory offers breathtaking 360-degree views of the Manhattan skyline and the Hudson River. This duplex penthouse features double-height ceilings and a private wrap-around terrace. Crafted with hand-selected European materials, the loft boasts an expansive chef's kitchen, custom basalt steel details, and automated glass panels that invite the city inside.",
            features: ["Private Terrace", "Duplex Layout", "360 Skyline Views", "24/7 Concierge", "Chef Kitchen"],
            images: [
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800"
            ]
        },
        {
            id: 3,
            name: "Ethereal Heights",
            location: "Swiss Alps, Zurich",
            price: 15200000,
            status: "Available",
            created: "2026-01-15",
            image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800",
            beds: 7,
            baths: 9,
            sqft: 11000,
            description: "Nestled in the serene peaks of the Swiss Alps overlooking Zurich, Ethereal Heights is a chalet of unparalleled grandeur. Combining local natural stone with warm white oak, the structure is designed to reflect the snow-dusted mountains around it. Features include a private ski-in/ski-out lodge, an indoor heated wellness spa, a traditional Finnish sauna, and a glass-enclosed wine grotto.",
            features: ["Ski-In/Ski-Out", "Indoor Wellness Spa", "Finnish Sauna", "Heated Pool", "Mountain Views"],
            images: [
                "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200",
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800",
                "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800"
            ]
        },
        {
            id: 4,
            name: "Monolith Estate",
            location: "Austin, Texas",
            price: 6700000,
            status: "Available",
            created: "2026-02-14",
            image: "assets/monolith_estate.png",
            beds: 5,
            baths: 6,
            sqft: 7200,
            description: "Rising out of the lush Texas landscape, the Monolith Estate is a masterclass in clean geometric lines and raw textures. Solid raw concrete forms the structure, offset by warm teak wood detailing. Enjoy high ceilings, an integrated smart home system, a custom infinity pool that merges with the horizon, and a private guest house.",
            features: ["Raw Concrete Design", "Teak Detailing", "Infinity Pool", "Guest House", "Smart Automation"],
            images: [
                "assets/monolith_estate.png",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
                "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800"
            ]
        },
        {
            id: 5,
            name: "Oceanic Serenity",
            location: "Malibu, California",
            price: 21000000,
            status: "Available",
            created: "2026-02-16",
            image: "assets/oceanic_serenity.png",
            beds: 8,
            baths: 11,
            sqft: 14500,
            description: "Positioned on a private cliffside overlooking the Pacific Ocean in Malibu, Oceanic Serenity is the ultimate coastal compound. Offering gated privacy, this architectural masterpiece features massive open-plan entertaining areas. Enjoy a private path directly to a secluded beach, an outdoor kitchen, an expansive pooldeck, and state-of-the-art security.",
            features: ["Private Beach Access", "Cliffside Views", "Gated Security", "Outdoor Kitchen", "Pooldeck Lounge"],
            images: [
                "assets/oceanic_serenity.png",
                "https://images.unsplash.com/photo-1512914890251-2f96a9b0bbe2?q=80&w=800",
                "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800"
            ]
        },
        {
            id: 6,
            name: "Ironwood Sanctuary",
            location: "Aspen, Colorado",
            price: 4500000,
            status: "Available",
            created: "2026-02-17",
            image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
            beds: 4,
            baths: 4,
            sqft: 4800,
            description: "Tucked away in the aspen forests of Colorado, the Ironwood Sanctuary is a warm, modern retreat. The design incorporates blackened steel structural elements and reclaimed timber wood panels. Large glass windows allow panoramic views of the forest, while the indoor spa, stone hearth fireplaces, and double-height living areas offer warmth and comfort after a day on the slopes.",
            features: ["Reclaimed Timber", "Blackened Steel", "Stone Fireplaces", "Indoor Spa", "Forest Views"],
            images: [
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200",
                "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800",
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800"
            ]
        },
        {
            id: 7,
            name: "The Glass House",
            location: "Malibu, California",
            price: 4500000,
            status: "Available",
            created: "2026-02-18",
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800",
            beds: 5,
            baths: 4,
            sqft: 4200,
            description: "Experience unparalleled luxury in this masterfully designed 5-bedroom villa. Nestled in the heart of Malibu, the Glass House offers panoramic ocean views and a seamless indoor-outdoor living experience. Every detail has been curated with the finest materials, from Italian marble floors to custom smart home integration.",
            features: ["Infinity Pool", "Smart Home", "3-Car Garage", "Italian Marble Floors", "Ocean Views"],
            images: [
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
                "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800"
            ]
        },
        {
            id: 8,
            name: "Modern Minimalist Loft",
            location: "SoHo, New York",
            price: 2800000,
            status: "Available",
            created: "2026-02-19",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800",
            beds: 3,
            baths: 2,
            sqft: 2100,
            description: "A stunning example of urban minimalist architecture located in the historic core of SoHo. This loft space features high ceilings, custom-engineered steel fixtures, and clean, white gallery-style walls. Equipped with modern top-of-the-line appliances and open-plan kitchen and living areas, it represents the epitome of New York luxury loft living.",
            features: ["SoHo Loft Space", "Gallery Walls", "Steel Fixtures", "Top-tier Appliances", "High Ceilings"],
            images: [
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800"
            ]
        },
        {
            id: 9,
            name: "Zen Garden Estate",
            location: "Kizu, Kyoto",
            price: 1200000,
            status: "Available",
            created: "2026-02-20",
            image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=800",
            beds: 4,
            baths: 3,
            sqft: 3500,
            description: "A peaceful retreat combining classic Japanese architecture with modern minimalist principles. The Zen Garden Estate features open tatami rooms, custom bamboo accents, and a private stone and sand rock garden. Sliding shoji doors open directly to a beautifully maintained koi pond and outdoor cedar hot tub, providing an atmosphere of absolute tranquil reflection.",
            features: ["Rock Garden", "Cedar Hot Tub", "Shoji Doors", "Tatami Rooms", "Koi Pond"],
            images: [
                "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1200",
                "https://images.unsplash.com/photo-1512914890251-2f96a9b0bbe2?q=80&w=800",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800"
            ]
        }
    ],
    inquiries: [
        { id: 101, user: "James Wilson", email: "james@example.com", subject: "Glass House Viewing", date: "2026-02-18", status: "New" },
        { id: 102, user: "Sarah Chen", email: "sarah@tech.co", subject: "Estate Investment", date: "2026-02-17", status: "Responded" }
    ],
    users: [
        { id: 1, name: "Admin User", email: "admin@starline.com", role: "admin", joined: "2026-01-01" },
        { id: 2, name: "Guest User", email: "guest@starline.com", role: "user", joined: "2026-02-15" }
    ]
};

const AdminState = {
    init() {
        const propsRaw = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
        const currentProps = propsRaw ? JSON.parse(propsRaw) : [];

        // Aggressive Reset: If count < 9 OR missing details OR has outdated image URL, reset to default
        const missingDetails = currentProps.some(p => !p.image || !p.beds || !p.description);
        const hasOutdatedImg = currentProps.some(p => 
            (p.id === 5 && p.images && p.images[2] && p.images[2].includes('photo-1541971875076')) ||
            (p.id === 6 && p.images && p.images[1] && p.images[1].includes('photo-1600607687940-c52af096999a')) ||
            (p.images && p.images.some(img => img && img.includes('photo-1613977255092-34842a0b8643')))
        );
        if (currentProps.length < 9 || missingDetails || hasOutdatedImg) {
            localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(DEFAULT_DATA.properties));
            console.log('Starline: Resetting properties to ensure 9 items with details and correct images.');
        } else {
            console.log('Starline: AdminState initialized with ' + currentProps.length + ' properties.');
        }

        if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
            localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(DEFAULT_DATA.inquiries));
        }
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_DATA.users));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY)) {
            localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify([]));
        }
    },

    // Getters
    getProperties() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES)) || [];
    },
    getInquiries() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES)) || [];
    },
    getUsers() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    },
    getActivity() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY)) || [];
    },

    // Mutations - Properties
    addProperty(property) {
        const props = this.getProperties();
        const newProp = { ...property, id: Date.now(), created: new Date().toISOString().split('T')[0] };
        props.unshift(newProp);
        localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(props));
        return newProp;
    },
    deleteProperty(id) {
        const props = this.getProperties().filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(props));
    },
    updateProperty(id, updates) {
        const props = this.getProperties().map(p => p.id === id ? { ...p, ...updates } : p);
        localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(props));
    },

    // Mutations - Inquiries
    addInquiry(inquiry) {
        const inqs = this.getInquiries();
        const newInq = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            ...inquiry,
            status: 'New'
        };
        inqs.unshift(newInq);
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inqs));

        // Log activity
        this.logActivity({
            action: 'New Inquiry Received',
            details: `From ${inquiry.user} (${inquiry.email})`,
            type: 'inquiry'
        });

        return newInq;
    },

    // Mutations - Inquiries
    updateInquiryStatus(id, status) {
        const inqs = this.getInquiries().map(i => i.id === id ? { ...i, status } : i);
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inqs));

        // Log status change
        this.logActivity({
            action: 'Inquiry Status Updated',
            details: `Inquiry #${id} set to ${status}`,
            type: 'inquiry'
        });
    },

    // Mutations - Activity Logging
    logActivity(activity) {
        const logs = this.getActivity();
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            user: activity.userName || (typeof getCurrentUser === 'function' && getCurrentUser() ? getCurrentUser().name : 'System'),
            userEmail: activity.userEmail || (typeof getCurrentUser === 'function' && getCurrentUser() ? getCurrentUser().email : 'system'),
            ...activity
        };
        logs.unshift(newLog);
        localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(logs.slice(0, 50))); // Keep last 50
        return newLog;
    },

    // Mutations - Users
    updateUser(id, updates) {
        const users = this.getUsers().map(u => u.id === id ? { ...u, ...updates } : u);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

        // If current user is updated, sync session
        const currentUser = JSON.parse(localStorage.getItem('starline_auth_token')) || JSON.parse(localStorage.getItem('starline_user'));
        if (currentUser && currentUser.id === id) {
            const updatedUser = { ...currentUser, ...updates };
            if (localStorage.getItem('starline_auth_token')) {
                localStorage.setItem('starline_auth_token', JSON.stringify(updatedUser));
            }
            if (localStorage.getItem('starline_user')) {
                localStorage.setItem('starline_user', JSON.stringify(updatedUser));
            }
        }

        this.logActivity({
            action: 'Profile Updated',
            details: `User #${id} updated their profile info`,
            type: 'user'
        });
    },

    // Stats Calculation
    getDashboardStats() {
        const props = this.getProperties();
        const inqs = this.getInquiries();
        const users = this.getUsers();

        return {
            totalProjects: Math.ceil(props.length / 2) + 2,
            totalProperties: props.length,
            availableProperties: props.filter(p => p.status === 'Available').length,
            totalInquiries: inqs.length,
            newInquiries: inqs.filter(i => i.status === 'New').length,
            totalUsers: users.length,
            totalValue: props.reduce((sum, p) => sum + p.price, 0)
        };
    },

    // Saved Items (User Specific)
    getSavedProperties(userId) {
        const saved = JSON.parse(localStorage.getItem('starline_saved_items')) || {};
        return saved[userId] || [];
    },
    toggleSavedProperty(userId, propertyId) {
        const saved = JSON.parse(localStorage.getItem('starline_saved_items')) || {};
        if (!saved[userId]) saved[userId] = [];

        const index = saved[userId].indexOf(propertyId);
        if (index > -1) {
            saved[userId].splice(index, 1);
        } else {
            saved[userId].push(propertyId);
        }

        localStorage.setItem('starline_saved_items', JSON.stringify(saved));
        return index === -1; // returns true if added, false if removed
    }
};

// Initialize on load
AdminState.init();
window.AdminState = AdminState;

// Global Session Getters
function getCurrentUser() {
    const user = localStorage.getItem('starline_auth_token') || localStorage.getItem('starline_user');
    return user ? JSON.parse(user) : null;
}
window.getCurrentUser = getCurrentUser;

function getAuthUser() {
    return getCurrentUser();
}
window.getAuthUser = getAuthUser;
