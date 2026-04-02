/* frontend/assets/js/dashboard.js */
document.addEventListener('DOMContentLoaded', async () => {
    Utils.checkAuth();
    
    try {
        // Assume your backend has an endpoint for dashboard stats
        const stats = await API.request('/admin/stats'); 
        
        document.getElementById('totalResources').innerText = stats.totalResources || 0;
        document.getElementById('activeAllocations').innerText = stats.activeAllocations || 0;
        document.getElementById('pendingFines').innerText = Utils.formatCurrency(stats.totalFines || 0);
        
    } catch (error) {
        console.error('Stats Error:', error);
    }
});