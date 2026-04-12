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
        localStorage.setItem('userId', response.userId);

        // Redirect based on role
        if (response.role === 'admin') window.location.href = 'admin/dashboard.html';
        else if (response.role === 'faculty') window.location.href = 'staff/dashboard.html';
        else window.location.href = 'student/dashboard.html';
        
    } catch (error) {
        alert('Login Failed: ' + error.message);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = '../login.html';
}