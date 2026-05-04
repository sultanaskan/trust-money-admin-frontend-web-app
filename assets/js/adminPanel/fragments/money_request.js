// ================= CONFIG =================
const MONEY_API = {
    create: `${BASE_URL}/money_request`,
    getAll: `${BASE_URL}/money_request/all`,
    updateStatus: (id) => `${BASE_URL}/money_request/${id}`,
    delete: (id) => `${BASE_URL}/money_request/${id}`
};

// ================= DOM CACHE =================
const REQ_DOM = {
    tbody: document.getElementById("requestTableBody"),
    formSection: document.getElementById("requestFormSection"),
    form: document.getElementById("moneyRequestForm"),
    toggleBtn: document.getElementById("toggleRequestForm"),
    cancelBtn: document.getElementById("cancelForm"),
    modal: document.getElementById("receiptModal"),
    modalImg: document.getElementById("modalImg"),
    closeModal: document.getElementById("closeModal")
};

// ================= UI FUNCTIONS =================

function renderRequests(data) {
    REQ_DOM.tbody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");

        // Type Badge Styling
        const typeColors = {
            deposit: '#007bff',
            withdraw: '#dc3545',
            recharge: '#17a2b8'
        };

        // Status Badge Styling
        const statusStyles = {
            pending: 'background: #fff3cd; color: #856404;',
            approved: 'background: #d4edda; color: #155724;',
            rejected: 'background: #f8d7da; color: #721c24;'
        };

        row.innerHTML = `
            <td>
                <strong>${item.User?.firstName || 'Unknown'}</strong><br>
                <small>ID: ${item.User?.id || 'N/A'}</small>
            </td>
            <td>
                <span style="color: white; background: ${typeColors[item.type] || '#666'}; padding: 2px 6px; border-radius: 4px; font-size: 11px; text-transform: uppercase;">
                    ${item.type}
                </span>
            </td>
            <td><span class="badge">${item.paymentMethod}</span></td>
            <td><strong>${Number(item.amount).toLocaleString()}</strong></td>
            <td><code>${item.transactionId || 'N/A'}</code></td>
            <td>
                ${item.recitUrl ?
                `<img src="${item.recitUrl}" class="view-receipt" style="width:40px; height:40px; cursor:pointer; border:1px solid #ddd; border-radius:4px;">`
                : '<small style="color:#ccc;">No Image</small>'}
            </td>
            <td>
                <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; ${statusStyles[item.status]}">
                    ${item.status.toUpperCase()}
                </span>
            </td>
            <td>
                ${item.status === 'pending' ? `
                    <button class="approve-btn" data-id="${item.id}" style="background:#28a745; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Approve</button>
                    <button class="reject-btn" data-id="${item.id}" style="background:#dc3545; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Reject</button>
                ` : ''}
                <button class="delete-btn" data-id="${item.id}" style="background:none; border:1px solid #ddd; padding:4px; cursor:pointer;">🗑️</button>
            </td>
        `;
        REQ_DOM.tbody.appendChild(row);
    });
}

// ================= API CALLS =================

// ১. সব রিকোয়েস্ট ফেচ করা
async function fetchAllRequests() {
    try {
        const res = await fetch(MONEY_API.getAll);
        const result = await res.json();
        if (result.success) renderRequests(result.data);
    } catch (err) { console.error("Fetch failed", err); }
}

// ২. নতুন রিকোয়েস্ট তৈরি (Multipart form data)
async function submitNewRequest(e) {
    e.preventDefault();
    const formData = new FormData(REQ_DOM.form); // অটোমেটিক সব ফিল্ড এবং ফাইল নিয়ে নিবে

    try {
        const res = await fetch(MONEY_API.create, {
            method: "POST",
            body: formData // No Headers needed for FormData, Browser sets it
        });
        const result = await res.json();
        if (result.success) {
            alert("Request submitted successfully!");
            REQ_DOM.form.reset();
            REQ_DOM.formSection.style.display = "none";
            fetchAllRequests();
        }
    } catch (err) { alert("Submission failed!"); }
}

// ৩. স্ট্যাটাস আপডেট (Approve/Reject)
async function updateStatus(id, newStatus) {
    if (!confirm(`Are you sure to ${newStatus}?`)) return;

    try {
        const res = await fetch(MONEY_API.updateStatus(id), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
        const result = await res.json();
        if (result.success) {
            alert(result.message);
            fetchAllRequests();
        } else {
            alert(result.message || "Update failed");
        }
    } catch (err) { console.error("Update error", err); }
}

// ৪. ডিলিট
async function deleteRequest(id) {
    if (!confirm("Delete permanently?")) return;
    await fetch(MONEY_API.delete(id), { method: "DELETE" });
    fetchAllRequests();
}

// ================= EVENTS =================

function bindEvents() {
    // Toggle Form
    REQ_DOM.toggleBtn.onclick = () => REQ_DOM.formSection.style.display = "block";
    REQ_DOM.cancelBtn.onclick = () => REQ_DOM.formSection.style.display = "none";

    // Form Submit
    REQ_DOM.form.onsubmit = submitNewRequest;

    // Table Actions
    REQ_DOM.tbody.onclick = (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("approve-btn")) updateStatus(id, "approved");
        if (e.target.classList.contains("reject-btn")) updateStatus(id, "rejected");
        if (e.target.classList.contains("delete-btn")) deleteRequest(id);

        if (e.target.classList.contains("view-receipt")) {
            REQ_DOM.modalImg.src = e.target.src;
            REQ_DOM.modal.style.display = "flex";
        }
    };

    REQ_DOM.closeModal.onclick = () => REQ_DOM.modal.style.display = "none";
}

// ================= INIT =================
function initMoneyRequest() {
    bindEvents();
    fetchAllRequests();
}

initMoneyRequest();