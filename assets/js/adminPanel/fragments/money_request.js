/* ================= CONFIG ================= */
const MONEY_API = {
    getAll: `${BASE_URL}/money_request/all`,
    updateStatus: (id) => `${BASE_URL}/money_request/${id}`,
    delete: (id) => `${BASE_URL}/money_request/${id}`
};

/* ================= DOM CACHE ================= */
const REQUEST_DOM = {
    tbody: document.getElementById("requestTableBody"),
    modal: document.getElementById("receiptModal"),
    modalImg: document.getElementById("modalImg"),
    closeModal: document.getElementById("closeModal")
};

/* ================= STATE ================= */
let requestState = {
    requests: []
};

/* ================= UI RENDER ================= */
function renderRequests(data) {
    REQUEST_DOM.tbody.innerHTML = "";

    if (!data || data.length === 0) {
        REQUEST_DOM.tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px;">No money requests found.</td></tr>`;
        return;
    }

    data.forEach(item => {
        const row = document.createElement("tr");

        // Status Color Logic
        const statusColors = {
            pending: { bg: '#fff3cd', color: '#856404' },
            approved: { bg: '#d4edda', color: '#155724' },
            rejected: { bg: '#f8d7da', color: '#721c24' }
        };
        const currentStyle = statusColors[item.status] || { bg: '#eee', color: '#333' };

        row.innerHTML = `
            <td style="padding: 10px;">
                <strong>${item.User?.firstName} ${item.User?.lastName}</strong><br>
                <small>${item.User?.email}</small>
            </td>
            <td><span class="badge">${item.paymentMethod}</span></td>
            <td><strong>${Number(item.amount).toLocaleString()}</strong></td>
            <td><code>${item.transactionId || 'N/A'}</code></td>
            <td>
                ${item.recitUrl ?
                `<img src="${item.recitUrl}" class="view-receipt" style="width:50px; height:50px; cursor:pointer; border-radius:4px; border:1px solid #ddd;">`
                : 'No Receipt'}
            </td>
            <td>
                <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; background: ${currentStyle.bg}; color: ${currentStyle.color};">
                    ${item.status.toUpperCase()}
                </span>
            </td>
            <td>
                ${item.status === 'pending' ? `
                    <button class="action-btn approve" data-id="${item.id}" style="background:#28a745; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">Approve</button>
                    <button class="action-btn reject" data-id="${item.id}" style="background:#dc3545; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">Reject</button>
                ` : ''}
                <button class="delete-btn" data-id="${item.id}" style="background:none; border:1px solid #ddd; padding:5px; cursor:pointer; margin-left:5px;">🗑️</button>
            </td>
        `;
        REQUEST_DOM.tbody.appendChild(row);
    });
}

/* ================= API ACTIONS ================= */

// Fetch All Requests
async function fetchAllRequests() {
    try {
        const res = await fetch(MONEY_API.getAll, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } // Admin Auth
        });
        const result = await res.json();
        if (result.success) {
            requestState.requests = result.data;
            renderRequests(result.data);
        }
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

// Update Status (Approve/Reject)
async function updateRequestStatus(id, newStatus) {
    if (!confirm(`Are you sure you want to ${newStatus} this request?`)) return;

    try {
        const res = await fetch(MONEY_API.updateStatus(id), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        const result = await res.json();
        if (result.success) {
            alert(`Request ${newStatus} successfully!`);
            fetchAllRequests(); // Refresh list
        }
    } catch (err) {
        console.error("Update failed:", err);
    }
}

// Delete Request
async function deleteRequest(id) {
    if (!confirm("Permanent delete this request?")) return;

    try {
        const res = await fetch(MONEY_API.delete(id), {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) fetchAllRequests();
    } catch (err) {
        console.error("Delete Error:", err);
    }
}

/* ================= EVENTS ================= */
function bindRequestEvents() {
    // Action Delegation (Approve, Reject, Delete, View Image)
    REQUEST_DOM.tbody.addEventListener("click", (e) => {
        const id = e.target.dataset.id;

        if (e.target.classList.contains("approve")) updateRequestStatus(id, "approved");
        if (e.target.classList.contains("reject")) updateRequestStatus(id, "rejected");
        if (e.target.classList.contains("delete-btn")) deleteRequest(id);

        // Image Modal Logic
        if (e.target.classList.contains("view-receipt")) {
            REQUEST_DOM.modalImg.src = e.target.src;
            REQUEST_DOM.modal.style.display = "flex";
        }
    });

    // Close Modal
    REQUEST_DOM.closeModal.onclick = () => REQUEST_DOM.modal.style.display = "none";
}

/* ================= INIT ================= */
function initRequestPage() {
    bindRequestEvents();
    fetchAllRequests();
}

initRequestPage();