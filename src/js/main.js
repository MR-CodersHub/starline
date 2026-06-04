/* Starline Luxury Navigation & Interactions */

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Effects
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.height = '70px';
            nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
        } else {
            nav.style.height = '90px';
            nav.style.boxShadow = 'none';
        }

        revealOnScroll();
    });

    // Reveal animations
    const revealOnScroll = () => {
        const reveals = document.querySelectorAll('.fade-in');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('visible');
            }
        });
    };

    revealOnScroll(); // Trigger initial check

    // "More Properties" Reveal on Home Page
    const loadMoreBtn = document.getElementById('load-more-btn');
    const extraProperties = document.getElementById('extra-properties');

    if (loadMoreBtn && extraProperties) {
        loadMoreBtn.addEventListener('click', () => {
            extraProperties.style.display = 'grid';
            extraProperties.classList.add('visible');
            loadMoreBtn.style.display = 'none';

            // Re-run reveal to catch new elements
            setTimeout(revealOnScroll, 100);
        });
    }

    // Mobile Menu Toggle (Simplified)
    const mobileBtn = document.querySelector('.mobile-toggle');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            alert('Mobile menu navigation placeholder');
            // Real implementation would toggle a class on nav-links
        });
    }
});
