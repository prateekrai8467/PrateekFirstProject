/* frontend/assets/js/utils.js */
const Utils = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    },

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },

    // Check if user is logged in on page load
    checkAuth() {
        if (!localStorage.getItem('token')) {
            window.location.href = '/pages/auth/login.html';
        }
    }
};

// ==========================================
// REAL-TIME NOTIFICATIONS (Socket.IO)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Add socket.io script dynamically
    const script = document.createElement('script');
    script.src = "http://localhost:5000/socket.io/socket.io.js"; 
    script.onload = () => {
        const socket = io('http://localhost:5000');

        // Create toast container
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '9999';
        toastContainer.style.display = 'flex';
        toastContainer.style.flexDirection = 'column';
        toastContainer.style.gap = '10px';
        document.body.appendChild(toastContainer);

        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            
            // Basic styling
            toast.style.padding = '15px 20px';
            toast.style.borderRadius = '8px';
            toast.style.color = '#fff';
            toast.style.fontWeight = '500';
            toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease-out';
            toast.style.display = 'flex';
            toast.style.alignItems = 'center';
            toast.style.minWidth = '250px';

            // Type colors
            if(message.toLowerCase().includes('approved')) {
                toast.style.background = '#10b981'; // Green
            } else if (message.toLowerCase().includes('rejected')) {
                toast.style.background = '#ef4444'; // Red
            } else {
                toast.style.background = '#3b82f6'; // Blue
            }

            toast.innerText = `🔔 ${message}`;
            toastContainer.appendChild(toast);

            // Animate in
            setTimeout(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            }, 10);

            // Animate out and remove
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-10px)';
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        }

        // Listeners
        socket.on('booking_status_updated', (data) => {
            showToast(data.message);
        });

        socket.on('new_booking', (data) => {
            // Only show for admins/staff ideally, but for demo we show it globally
            showToast(data.message);
        });

        socket.on('resource_allocated', (data) => {
            showToast(data.message);
        });
    };
    script.onerror = () => {
        console.log("Socket.IO backend not available");
    }
    document.head.appendChild(script);
});