/**
 * Starline Admin - Edit Property Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initEditPage();
});

function initEditPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = parseInt(urlParams.get('id'));

    if (!propertyId) {
        alert('No property ID specified.');
        window.location.href = 'add-property.html';
        return;
    }

    const properties = AdminState.getProperties();
    const property = properties.find(p => p.id === propertyId);

    if (!property) {
        alert('Property not found.');
        window.location.href = 'add-property.html';
        return;
    }

    // Pre-fill form fields
    const form = document.getElementById('edit-property-form');
    if (form) {
        form.querySelector('[name="name"]').value = property.name || '';
        form.querySelector('[name="location"]').value = property.location || '';
        form.querySelector('[name="price"]').value = property.price || '';
        form.querySelector('[name="status"]').value = property.status || 'Available';
        form.querySelector('[name="image"]').value = property.image || '';
        form.querySelector('[name="beds"]').value = property.beds || '';
        form.querySelector('[name="baths"]').value = property.baths || '';
        form.querySelector('[name="sqft"]').value = property.sqft || '';
        form.querySelector('[name="description"]').value = property.description || '';

        // Form Submit Handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const updatedProperty = {
                name: formData.get('name'),
                location: formData.get('location'),
                price: parseFloat(formData.get('price')),
                status: formData.get('status'),
                image: formData.get('image'),
                beds: parseInt(formData.get('beds')) || 0,
                baths: parseInt(formData.get('baths')) || 0,
                sqft: parseInt(formData.get('sqft')) || 0,
                description: formData.get('description')
            };

            AdminState.updateProperty(propertyId, updatedProperty);
            
            if (typeof window.showToast === 'function') {
                window.showToast('Property updated successfully!');
            } else {
                alert('Property updated successfully!');
            }

            setTimeout(() => {
                window.location.href = 'add-property.html';
            }, 800);
        });
    }

    // Cancel Button Handler
    const cancelBtn = document.getElementById('cancel-edit-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'add-property.html';
        });
    }
}
