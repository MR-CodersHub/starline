document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = parseInt(urlParams.get('id'));

    if (!propertyId || typeof AdminState === 'undefined') {
        initMap(null);
        return;
    }

    const properties = AdminState.getProperties();
    const property = properties.find(p => p.id === propertyId);

    if (property) {
        // Update Title
        const titleEl = document.getElementById('prop-title') || document.querySelector('main h1');
        if (titleEl) titleEl.textContent = property.name;

        // Update Location
        const locationEl = document.getElementById('prop-location');
        if (locationEl) locationEl.textContent = property.location;

        // Update Price
        const priceEl = document.getElementById('prop-price');
        if (priceEl) priceEl.textContent = `$${property.price.toLocaleString()}`;

        // Update Mortgage estimate (~0.5% of price per month)
        const mortgageEl = document.getElementById('prop-mortgage');
        if (mortgageEl) {
            const estMortgage = Math.round(property.price * 0.005);
            mortgageEl.textContent = `EST. MORTGAGE $${estMortgage.toLocaleString()}/MO`;
        }

        // Update Gallery
        const galleryImgs = document.querySelectorAll('.gallery-grid img');
        if (galleryImgs.length >= 3) {
            const imgList = property.images || [
                property.image,
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
                'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800'
            ];
            const resolveImg = (url) => typeof getCorrectImagePath === 'function' ? getCorrectImagePath(url) : url;
            galleryImgs[0].src = resolveImg(imgList[0] || property.image);
            galleryImgs[1].src = resolveImg(imgList[1] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800');
            galleryImgs[2].src = resolveImg(imgList[2] || 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800');
        }

        // Update Description
        const descHeading = Array.from(document.querySelectorAll('main h2'))
            .find(h2 => h2.textContent.toLowerCase().includes('about this property'));
        if (descHeading) {
            let nextSibling = descHeading.nextElementSibling;
            while (nextSibling && nextSibling.tagName === 'P') {
                const toRemove = nextSibling;
                nextSibling = nextSibling.nextElementSibling;
                toRemove.remove();
            }
            const descText = property.description || "Experience luxury redefined in this masterfully crafted residence.";
            const paragraphs = Array.isArray(descText) ? descText : [descText];
            let lastInserted = descHeading;
            paragraphs.forEach(text => {
                const p = document.createElement('p');
                p.style.color = 'var(--text-muted)';
                p.style.marginBottom = '24px';
                p.textContent = text;
                lastInserted.after(p);
                lastInserted = p;
            });
        }

        // Update Amenities/Details
        const amenitiesGrid = document.querySelector('.amenities-grid');
        if (amenitiesGrid) {
            amenitiesGrid.innerHTML = '';
            const beds = property.beds || 0;
            const baths = property.baths || 0;
            const sqft = property.sqft ? `${property.sqft.toLocaleString()} sqft` : '';
            const items = [];
            if (beds) items.push(`${beds} Bedrooms`);
            if (baths) items.push(`${baths} Bathrooms`);
            if (sqft) items.push(sqft);
            if (property.features && Array.isArray(property.features)) {
                items.push(...property.features);
            }
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'amenity-item';
                div.innerHTML = `<span>✓</span> ${item}`;
                amenitiesGrid.appendChild(div);
            });
        }

        // Initialize interactive map
        initMap(property);
    } else {
        initMap(null);
    }

    // Inquiry Form Logic
    const inquiryForm = document.getElementById('contactForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(inquiryForm);
            const inquiry = {
                user: formData.get('name'),
                email: formData.get('email'),
                subject: `Inquiry: ${property ? property.name : 'General'}`,
                message: formData.get('message')
            };
            AdminState.addInquiry(inquiry);
            if (typeof UIUtils !== 'undefined') {
                UIUtils.showToast('Inquiry sent successfully!');
                inquiryForm.reset();
            }
        });
    }
});

/**
 * Initialize the Leaflet interactive map.
 * Uses a built-in coordinate table for all known property locations.
 * Falls back to OpenStreetMap Nominatim geocoding for unknown ones.
 */
function initMap(property) {
    const mapEl = document.getElementById('property-map');
    if (!mapEl || typeof L === 'undefined') return;

    // Coordinate table: location keyword → [lat, lng, zoom]
    const COORD_TABLE = {
        'beverly hills':        [34.0736, -118.4004, 14],
        'tribeca':              [40.7195,  -74.0089, 15],
        'swiss alps':           [46.8182,    8.2275, 10],
        'zurich':               [47.3769,    8.5417, 13],
        'austin':               [30.2672,  -97.7431, 13],
        'malibu':               [34.0259, -118.7798, 13],
        'aspen':                [39.1911, -106.8175, 13],
        'soho':                 [40.7230,  -74.0030, 15],
        'kizu':                 [34.7667,  135.6667, 13],
        'kyoto':                [35.0116,  135.7681, 13],
        'new york':             [40.7128,  -74.0060, 13],
        'california':           [36.7783, -119.4179, 7],
        'colorado':             [39.5501,  -105.7821, 7],
        'texas':                [31.9686,  -99.9018, 6],
    };

    const DEFAULT = [20, 0, 2];

    // Premium star-pin icon (black, white star inside)
    const pinIcon = L.divIcon({
        className: '',
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="46" viewBox="0 0 34 46">
  <defs>
    <filter id="shadow" x="-30%" y="-10%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.35)"/>
    </filter>
  </defs>
  <path d="M17 0C8.163 0 1 7.163 1 16c0 11 14.5 30 16 30s16-19 16-30C33 7.163 25.837 0 17 0z"
        fill="#0f172a" filter="url(#shadow)"/>
  <circle cx="17" cy="16" r="8.5" fill="white"/>
  <polygon points="17,9.5 18.8,13.8 23.5,14.3 20.1,17.4 21.1,22 17,19.5 12.9,22 13.9,17.4 10.5,14.3 15.2,13.8"
           fill="#0f172a"/>
</svg>`,
        iconSize: [34, 46],
        iconAnchor: [17, 46],
        popupAnchor: [0, -48],
    });

    function renderMap(lat, lng, zoom, prop) {
        const map = L.map(mapEl, {
            center: [lat, lng],
            zoom: zoom,
            zoomControl: true,
            scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        // Force Leaflet to recalculate tile layout after DOM settles
        setTimeout(() => map.invalidateSize(), 150);

        if (prop) {
            const price = `$${Number(prop.price).toLocaleString()}`;
            const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
            marker.bindPopup(`
                <div class="map-popup-title">${prop.name}</div>
                <div class="map-popup-location">${prop.location}</div>
                <div class="map-popup-price">${price}</div>
            `, { maxWidth: 220 }).openPopup();
        }
    }


    if (!property) {
        renderMap(DEFAULT[0], DEFAULT[1], DEFAULT[2], null);
        return;
    }

    // Try coordinate table match
    const locLower = property.location.toLowerCase();
    let matched = null;

    for (const [key, coords] of Object.entries(COORD_TABLE)) {
        if (locLower.includes(key)) {
            matched = coords;
            break;
        }
    }

    if (matched) {
        renderMap(matched[0], matched[1], matched[2], property);
    } else {
        // Fallback: geocode via Nominatim
        const query = encodeURIComponent(property.location);
        fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
            .then(r => r.json())
            .then(results => {
                if (results && results.length > 0) {
                    renderMap(parseFloat(results[0].lat), parseFloat(results[0].lon), 13, property);
                } else {
                    renderMap(DEFAULT[0], DEFAULT[1], DEFAULT[2], property);
                }
            })
            .catch(() => renderMap(DEFAULT[0], DEFAULT[1], DEFAULT[2], property));
    }
}
