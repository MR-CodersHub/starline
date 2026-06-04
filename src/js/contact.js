/**
 * Contact JS - Form Validation & Inquiries
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }

            if (typeof AdminState !== 'undefined' && typeof AdminState.addInquiry === 'function') {
                AdminState.addInquiry({
                    user: data.name,
                    email: data.email,
                    subject: data.message.substring(0, 30) + '...',
                    message: data.message,
                    status: 'New'
                });
            } else {
                console.log('Static submission:', data);
            }

            alert('Thank you for your inquiry. A representative will contact you shortly.');
            contactForm.reset();
        });
    }

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
