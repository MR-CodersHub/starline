/**
 * Starline Admin - Inquiries Management
 */

document.addEventListener('DOMContentLoaded', () => {
    renderInquiries();
});

function renderInquiries() {
    const tableBody = document.getElementById('inquiries-tbody');
    if (!tableBody) return;

    const inquiries = AdminState.getInquiries();
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
            <td>
                <select onchange="updateInqStatus(${inq.id}, this.value)" style="padding: 6px; border-radius: 8px; border: 1px solid var(--admin-border); outline: none;">
                    <option value="New" ${inq.status === 'New' ? 'selected' : ''}>New</option>
                    <option value="Responded" ${inq.status === 'Responded' ? 'selected' : ''}>Responded</option>
                </select>
            </td>
        </tr>
    `).join('');
}

window.updateInqStatus = (id, status) => {
    AdminState.updateInquiryStatus(id, status);
    renderInquiries();
};
