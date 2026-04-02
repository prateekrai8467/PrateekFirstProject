/* frontend/assets/js/auth.js */
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await API.request('/auth/login', 'POST', { email, password });
        
        // Save session data
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('userName', response.name);

        // Redirect based on role
        if (response.role === 'admin') window.location.href = '../admin/dashboard.html';
        else if (response.role === 'staff') window.location.href = '../staff/dashboard.html';
        else window.location.href = '../user/dashboard.html';
        
    } catch (error) {
        alert('Login Failed: ' + error.message);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = '/pages/auth/login.html';
}