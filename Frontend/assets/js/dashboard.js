/* frontend/assets/js/dashboard.js */
document.addEventListener('DOMContentLoaded', async function loadDashboardStats() {
    try {
        const stats = await API.request('/admin/stats'); 
        
        // Helper to safely update DOM elements
        const updateEl = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.innerText = value;
        };

        // Update KPIs
        updateEl('totalRooms', stats.totalRooms || 0);
        updateEl('totalResources', stats.totalResources || 0);
        updateEl('utilizationPercent', (stats.utilizationPercent || 0) + '%');
        updateEl('activeAllocations', stats.totalAllocations || 0);
        updateEl('mostUsedRoom', stats.mostUsedRoom || 'N/A');
        updateEl('mostUsedResource', stats.mostUsedResource || 'N/A');
        
        // Fallbacks for other dashboards (if they use the same script)
        updateEl('totalUsers', stats.totalUsers || 0);
        updateEl('totalStaff', stats.totalStaff || 0);

        // Render Chart.js Visualization
        const ctx = document.getElementById('monthlyBookingsChart');
        if (ctx && stats.monthlyBookings) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dataCounts = new Array(12).fill(0);

            // Populate data counts based on SQL month (1-indexed)
            stats.monthlyBookings.forEach(item => {
                if (item.month >= 1 && item.month <= 12) {
                    dataCounts[item.month - 1] = item.count;
                }
            });

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Bookings',
                        data: dataCounts,
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { precision: 0 } // Integer ticks
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Stats Error:', error);
    }
});