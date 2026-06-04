/**
 * Starline Admin - Core Layout & Dashboard Stats
 */

document.addEventListener('DOMContentLoaded', () => {
    initAdminLayout();
    if (document.getElementById('total-properties')) {
        renderDashboardStats();
    }
});

function initAdminLayout() {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : (JSON.parse(localStorage.getItem('starline_auth_token')) || JSON.parse(localStorage.getItem('starline_user')));

    // Update Name & Date
    const adminName = document.getElementById('admin-name');
    if (adminName) adminName.textContent = user ? user.name : 'Admin';

    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    }

    // Set active link
    const currentPath = window.location.pathname;
    document.querySelectorAll('.menu-link').forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function renderDashboardStats() {
    const stats = AdminState.getDashboardStats();

    const elements = {
        'total-projects': stats.totalProjects,
        'total-properties': stats.totalProperties,
        'new-inquiries': stats.newInquiries,
        'total-value': `$${(stats.totalValue / 1000000).toFixed(1)}M`
    };

    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // Render Recent Inquiries Table
    const tableBody = document.getElementById('inquiries-tbody');
    if (tableBody) {
        const inquiries = AdminState.getInquiries().slice(0, 5);
        tableBody.innerHTML = inquiries.map(inq => `
            <tr>
                <td>
                    <div style="font-weight: 600;">${inq.user}</div>
                    <div style="font-size: 0.8rem; color: var(--admin-text-muted);">${inq.email}</div>
                </td>
                <td>${inq.subject}</td>
                <td>${inq.date}</td>
                <td>
                    <span class="status-badge status-${inq.status.toLowerCase()}">${inq.status}</span>
                </td>
            </tr>
        `).join('');
    }
}
