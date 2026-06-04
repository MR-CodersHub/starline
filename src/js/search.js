/**
 * Search JS - Filtering and Interaction
 */

function buildListingsUrl(query, minInvestment, type) {
    const root = typeof getRootPath === 'function' ? getRootPath() : '';
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (minInvestment) params.set('min', minInvestment);
    if (type && type !== 'buy') params.set('type', type);
    const qs = params.toString();
    return root + 'public/pages/listings.html' + (qs ? '?' + qs : '');
}

document.addEventListener('DOMContentLoaded', () => {

    // ── Hero search block ──────────────────────────────────
    const heroSearchBtn = document.querySelector('.hero-search-glass .search-btn');
    const heroInputs = document.querySelectorAll('.hero-search-glass input');
    const heroSelect = document.querySelector('.hero-search-glass select');

    if (heroSearchBtn && heroInputs.length) {
        const doHeroSearch = () => {
            const query = heroInputs[0]?.value.trim();
            const minInvest = heroInputs[1]?.value.trim();
            const type = heroSelect?.value || 'buy';
            if (query || minInvest) {
                window.location.href = buildListingsUrl(query, minInvest, type);
            }
        };
        heroSearchBtn.addEventListener('click', doHeroSearch);
        heroInputs.forEach(inp => {
            inp.addEventListener('keypress', (e) => { if (e.key === 'Enter') doHeroSearch(); });
        });
    }

    // ── Navbar search block ────────────────────────────────
    const navSearchBtn = document.getElementById('nav-search-btn');
    const navQueryInput = document.getElementById('nav-search-query');
    const navInvestInput = document.getElementById('nav-search-investment');
    const navTypeSelect = document.getElementById('nav-search-type');

    if (navSearchBtn && navQueryInput) {
        const doNavSearch = () => {
            const query = navQueryInput.value.trim();
            const minInvest = navInvestInput?.value.trim();
            const type = navTypeSelect?.value || 'buy';
            window.location.href = buildListingsUrl(query, minInvest, type);
        };
        navSearchBtn.addEventListener('click', doNavSearch);
        [navQueryInput, navInvestInput].forEach(inp => {
            if (inp) inp.addEventListener('keypress', (e) => { if (e.key === 'Enter') doNavSearch(); });
        });
    }

    // ── Legacy search bar (listings sidebar etc.) ──────────
    const searchBtn = document.querySelector('.search-bar .search-btn');
    const searchInput = document.querySelector('.search-bar input, .sidebar-widget input');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = buildListingsUrl(query, '', 'buy');
            }
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchBtn.click();
        });
    }

    // ── Header scroll effect ───────────────────────────────
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                header.style.boxShadow = 'var(--shadow-soft)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }
});
