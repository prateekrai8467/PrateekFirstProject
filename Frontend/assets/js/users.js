/* frontend/assets/js/users.js */

async function loadUsers() {
    const isStaffPage = document.title.includes('Staff');
    const roleQuery = isStaffPage ? 'faculty' : 'student';

    try {
        const users = await API.request(`/admin/users?role=${roleQuery}`);
        const tableBody = document.querySelector('#userList');
        
        if (!tableBody) return;

        tableBody.innerHTML = users.map(user => `
            <tr>
                <td>${user.user_id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>
                    <button class="btn-action" onclick="deleteUser(${user.user_id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Load Error:', error);
    }
}

function openAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
}

// Close when clicking outside modal
window.onclick = function(event) {
    const modal = document.getElementById('addUserModal');
    if (event.target == modal) {
        closeAddUserModal();
    }
}

async function submitUser(e, roleType) {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;
    const password = document.getElementById('userPassword').value;

    try {
        await API.request('/auth/register', 'POST', {
            name,
            email,
            phone,
            password,
            role: roleType // 'faculty' or 'student'
        });
        closeAddUserModal();
        document.getElementById('addUserForm').reset();
        loadUsers(); // Refresh table
    } catch (error) {
        alert('Failed to add user: ' + error.message);
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        await API.request(`/admin/users/${id}`, 'DELETE');
        loadUsers(); // Refresh the table
    } catch (error) {
        alert('Failed to delete user: ' + error.message);
    }
}

// Initial load
if (document.getElementById('userList')) {
    loadUsers();
}
