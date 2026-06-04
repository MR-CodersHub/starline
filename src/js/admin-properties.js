/**
 * Starline Admin - Properties Management
 */

document.addEventListener('DOMContentLoaded', () => {
    initPropertiesPage();
});

function initPropertiesPage() {
    renderPropertiesTable();

    // Add Property Form Handler
    const form = document.getElementById('add-property-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const newProperty = {
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

            AdminState.addProperty(newProperty);
            renderPropertiesTable();
            form.reset();
            if (typeof window.showToast === 'function') {
                window.showToast('Property added successfully!');
            } else {
                alert('Property added successfully!');
            }
        });
    }
}

function renderPropertiesTable() {
    const tableBody = document.getElementById('properties-tbody');
    if (!tableBody) return;

    const properties = AdminState.getProperties();
    tableBody.innerHTML = properties.map(prop => `
        <tr id="prop-row-${prop.id}">
            <td><div style="font-weight: 600;">${prop.name}</div></td>
            <td>${prop.location}</td>
            <td><strong>$${prop.price.toLocaleString()}</strong></td>
            <td>
                <span class="status-badge status-${prop.status.toLowerCase()}">${prop.status}</span>
            </td>
            <td>
                <div style="display: flex; gap: 10px;">
                    <button onclick="editProperty(${prop.id})" class="action-btn edit-btn" title="Edit">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onclick="deleteProperty(${prop.id})" class="action-btn delete-btn" title="Delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

window.deleteProperty = (id) => {
    if (confirm('Are you sure you want to delete this property?')) {
        AdminState.deleteProperty(id);
        renderPropertiesTable();
    }
};

window.editProperty = (id) => {
    window.location.href = 'edit-property.html?id=' + id;
};
