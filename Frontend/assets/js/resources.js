/* frontend/assets/js/resources.js */
async function loadResources() {
    try {
        const resources = await API.request('/resources/items');
        const tableBody = document.querySelector('#resourceTable tbody');
        
        if (!tableBody) return;

        tableBody.innerHTML = resources.map(res => `
            <tr>
                <td>${res.resource_name}</td>
                <td>${res.total_quantity}</td>
                <td>
                    <span class="status-pill status-${res.available_quantity > 0 ? 'approved' : 'rejected'}">
                        ${res.available_quantity > 0 ? res.available_quantity + ' Available' : 'Out of Stock'}
                    </span>
                </td>
                <td>
                    <button class="btn-action" onclick="editResource(${res.resource_id})">Edit</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Load Error:', error);
    }
}

function openAddResourceModal() {
    document.getElementById('addResourceModal').style.display = 'block';
}

function closeAddResourceModal() {
    document.getElementById('addResourceModal').style.display = 'none';
}

// Close when clicking outside modal
window.onclick = function(event) {
    const modal = document.getElementById('addResourceModal');
    if (event.target == modal) {
        closeAddResourceModal();
    }
}

async function submitResource(e) {
    e.preventDefault();
    const name = document.getElementById('resName').value;
    const qty = document.getElementById('resQty').value;
    const desc = document.getElementById('resDesc').value;

    try {
        await API.request('/resources/add-item', 'POST', {
            resource_name: name,
            total_quantity: parseInt(qty),
            description: desc
        });
        closeAddResourceModal();
        document.getElementById('addResourceForm').reset();
        loadResources(); // Refresh table
    } catch (error) {
        alert('Failed to add resource: ' + error.message);
    }
}

async function editResource(id) {
    const newQty = prompt("Enter new total quantity for this resource:");
    if (!newQty || isNaN(newQty)) return;

    try {
        await API.request(`/resources/items/${id}`, 'PUT', {
            total_quantity: parseInt(newQty)
        });
        loadResources(); // Refresh table
    } catch (error) {
        alert('Failed to update resource: ' + error.message);
    }
}

// Initial load if on the resources page
if (document.getElementById('resourceTable')) {
    loadResources();
}