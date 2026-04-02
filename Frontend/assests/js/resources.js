/* frontend/assets/js/resources.js */
async function loadResources() {
    try {
        const resources = await API.request('/resources');
        const tableBody = document.querySelector('#resourceTable tbody');
        
        if (!tableBody) return;

        tableBody.innerHTML = resources.map(res => `
            <tr>
                <td>${res.name}</td>
                <td>${res.type}</td>
                <td><span class="status-pill status-${res.status.toLowerCase()}">${res.status}</span></td>
                <td>
                    <button class="btn-action" onclick="editResource(${res.id})">Edit</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Load Error:', error);
    }
}

// Initial load if on the resources page
if (document.getElementById('resourceTable')) {
    loadResources();
}