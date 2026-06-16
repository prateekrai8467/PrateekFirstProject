// frontend/assets/js/bookings.js

async function fetchUserBookings() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
        const bookings = await API.request(`/bookings/user/${userId}`);
        const tbody = document.getElementById('userBookingList');
        if (!tbody) return;

        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No bookings found.</td></tr>';
            return;
        }

        tbody.innerHTML = bookings.map(b => `
            <tr>
                <td>#${b.booking_id}</td>
                <td>Room ${b.room_number || b.room_id}</td>
                <td>${new Date(b.booking_date).toLocaleDateString()}</td>
                <td>${b.start_time} - ${b.end_time}</td>
                <td><span class="status-pill status-${b.status ? b.status.toLowerCase() : 'pending'}">${b.status || 'Pending'}</span></td>
            </tr>
        `).join('');

        // also update dashboard count if it's there
        const activeCountElem = document.getElementById('activeBookings');
        if (activeCountElem) {
            const activeCount = bookings.filter(b => b.status === 'Approved').length;
            activeCountElem.innerText = activeCount;
        }

    } catch (error) {
        console.error('Failed to fetch bookings:', error);
    }
}

function openBookResourceModal() {
    const modal = document.getElementById('bookResourceModal');
    if (modal) {
        modal.style.display = 'block';
        loadResources();
        loadRooms();
    }
}

async function loadRooms() {
    const select = document.getElementById('bookRoomId');
    if (!select || select.options.length > 1) return; // Already loaded or not present

    try {
        const rooms = await API.request('/resources/rooms');
        rooms.forEach(room => {
            const opt = document.createElement('option');
            opt.value = room.room_id;
            const formattedType = room.type ? room.type.charAt(0).toUpperCase() + room.type.slice(1).replace('_', ' ') : 'Room';
            opt.textContent = `${room.room_number} (${formattedType} - Cap: ${room.capacity})`;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error('Failed to load rooms:', error);
    }
}

function toggleResourceSection() {
    const checkbox = document.getElementById('needResourcesCheckbox');
    const section = document.getElementById('resourceSection');
    if (checkbox && section) {
        if (checkbox.checked) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
            document.getElementById('resourceSelect').value = '';
            document.getElementById('resourceQuantity').value = '';
        }
    }
}

async function loadResources() {
    const select = document.getElementById('resourceSelect');
    if (!select || select.options.length > 1) return; // Already loaded or not present

    try {
        const resources = await API.request('/resources/items');
        resources.forEach(res => {
            if (res.available_quantity > 0) {
                const opt = document.createElement('option');
                opt.value = res.resource_id;
                opt.textContent = `${res.resource_name} (Avail: ${res.available_quantity})`;
                select.appendChild(opt);
            }
        });
    } catch (error) {
        console.error('Failed to load resources:', error);
    }
}

function closeBookResourceModal() {
    const modal = document.getElementById('bookResourceModal');
    if (modal) modal.style.display = 'none';
}

// Close when clicking outside modal
window.addEventListener('click', function(event) {
    const modal = document.getElementById('bookResourceModal');
    if (event.target == modal) {
        closeBookResourceModal();
    }
});

async function submitBooking(e) {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        alert("User ID not found in session. Please login again.");
        return;
    }

    const roomId = document.getElementById('bookRoomId').value;
    const date = document.getElementById('bookDate').value;
    const start = document.getElementById('bookStart').value;
    const end = document.getElementById('bookEnd').value;
    const purpose = document.getElementById('bookPurpose').value;

    let resourcesData = [];
    const needResources = document.getElementById('needResourcesCheckbox');
    if (needResources && needResources.checked) {
        const resId = document.getElementById('resourceSelect').value;
        const resQty = document.getElementById('resourceQuantity').value;
        if (!resId || !resQty || parseInt(resQty) <= 0) {
            alert('Please select a valid resource and quantity, or uncheck the resources option.');
            return;
        }
        resourcesData.push({
            resource_id: parseInt(resId),
            quantity: parseInt(resQty)
        });
    }

    try {
        await API.request('/bookings/new', 'POST', {
            user_id: parseInt(userId),
            room_id: parseInt(roomId),
            booking_date: date,
            start_time: start,
            end_time: end,
            purpose: purpose,
            resources: resourcesData
        });
        
        alert("Booking request submitted successfully.");
        closeBookResourceModal();
        document.getElementById('bookResourceForm').reset();
        fetchUserBookings(); // Refresh the list
    } catch (error) {
        alert('Failed to submit booking: ' + error.message);
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('userBookingList') || document.getElementById('activeBookings')) {
        fetchUserBookings();
    }
});
