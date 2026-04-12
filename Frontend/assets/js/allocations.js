/* frontend/assets/js/allocations.js */

async function loadAllocations() {
    try {
        const allocations = await API.request('/admin/allocations');
        const tableBody = document.querySelector('#allocationList');
        
        if (!tableBody) return;

        tableBody.innerHTML = allocations.map(a => `
            <tr>
                <td>#${a.booking_id}</td>
                <td>${a.user_name}</td>
                <td>Room ${a.room_number}</td>
                <td>${new Date(a.booking_date).toLocaleDateString()}</td>
                <td>${a.start_time} - ${a.end_time}</td>
                <td>
                    <span class="status-pill status-${a.status.toLowerCase()}">${a.status}</span>
                </td>
                <td>
                    ${a.status.toLowerCase() === 'pending' ? `
                        <button class="btn-edit" style="padding: 5px 10px; font-size: 12px; margin-right: 5px; background: #2ecc71;" onclick="updateAllocationStatus(${a.booking_id}, 'Approved')">Approve</button>
                        <button class="btn-delete" style="padding: 5px 10px; font-size: 12px;" onclick="updateAllocationStatus(${a.booking_id}, 'Rejected')">Reject</button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Load Error:', error);
    }
}

function openAddAllocationModal() {
    document.getElementById('addAllocationModal').style.display = 'block';
}

function closeAddAllocationModal() {
    document.getElementById('addAllocationModal').style.display = 'none';
}

// Close when clicking outside modal
window.onclick = function(event) {
    const modal = document.getElementById('addAllocationModal');
    if (event.target == modal) {
        closeAddAllocationModal();
    }
}

async function updateAllocationStatus(bookingId, status) {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this booking?`)) return;

    try {
        const adminId = localStorage.getItem('userId') || 1; // Fallback to 1 if not set
        await API.request('/allocations/action', 'POST', {
            booking_id: bookingId,
            approved_by: parseInt(adminId),
            status: status,
            remarks: `${status} by admin`
        });
        
        alert(`Booking ${status} successfully`);
        loadAllocations(); // Refresh the list
    } catch (error) {
        alert('Failed to update booking status: ' + error.message);
    }
}

async function submitAllocation(e) {
    e.preventDefault();
    const userId = document.getElementById('allocUserId').value;
    const roomId = document.getElementById('allocRoomId').value;
    const date = document.getElementById('allocDate').value;
    const start = document.getElementById('allocStart').value;
    const end = document.getElementById('allocEnd').value;
    const purpose = document.getElementById('allocPurpose').value;

    try {
        await API.request('/bookings/new', 'POST', {
            user_id: parseInt(userId),
            room_id: parseInt(roomId),
            booking_date: date,
            start_time: start,
            end_time: end,
            purpose: purpose,
            resources: [] // Optional based on current backend constraints
        });
        closeAddAllocationModal();
        document.getElementById('addAllocationForm').reset();
        loadAllocations(); // Refresh table
    } catch (error) {
        alert('Failed to add allocation: ' + error.message);
    }
}

// Initial load
if (document.getElementById('allocationList')) {
    loadAllocations();
}
