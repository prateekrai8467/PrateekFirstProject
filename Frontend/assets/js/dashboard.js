/* frontend/assets/js/dashboard.js */
document.addEventListener('DOMContentLoaded', async function loadDashboardStats() {
    try {
        const stats = await API.request('/admin/stats'); 
        
        const resEl = document.getElementById('totalResources');
        const allocEl = document.getElementById('activeAllocations');
        const userEl = document.getElementById('totalUsers');
        const staffEl = document.getElementById('totalStaff');

        if (resEl) resEl.innerText = stats.totalRooms || 0;
        if (allocEl) allocEl.innerText = stats.activeAllocations || 0;
        if (userEl) userEl.innerText = stats.totalUsers || 0;
        if (staffEl) staffEl.innerText = stats.totalStaff || 0;
        
    } catch (error) {
        console.error('Stats Error:', error);
    }
});