/**
 * Starline Admin - Users Management
 */

document.addEventListener('DOMContentLoaded', () => {
    renderUsers();
});

function renderUsers() {
    const tableBody = document.getElementById('users-tbody');
    if (!tableBody) return;

    const users = AdminState.getUsers();
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div style="font-weight: 600;">${user.name}</div>
                <div style="font-size: 0.8rem; color: var(--admin-text-muted);">${user.email}</div>
            </td>
            <td>
                <span class="status-badge" style="background: #f1f5f9; color: #475569;">${user.role.toUpperCase()}</span>
            </td>
            <td>${user.joined}</td>
            <td>
                <button class="action-btn" style="color: var(--admin-text-muted); padding: 8px; border: none; background: none; cursor: pointer;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </button>
            </td>
        </tr>
    `).join('');
}
