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