// ================= CONFIG =================
const V_API = {
    upload: `${BASE_URL}/verification/upload`,
    getAllPending: `${BASE_URL}/verification/admin/all-pending`,
    updateStatus: (id) => `${BASE_URL}/verification/admin/update-status/${id}`,
    delete: (id) => `${BASE_URL}/verification/admin/delete/${id}`
};

// ================= DOM CACHE =================
const V_DOM = {
    tbody: document.getElementById("verificationTableBody"),
    toggleBtn: document.getElementById("toggleUploadForm"),
    formRow: document.getElementById("verificationForm"),
    submitBtn: document.getElementById("submitVerification"),
    cancelBtn: document.getElementById("cancelVerification"),

    inputs: {
        userId: document.getElementById("vUserId"),
        docType: document.getElementById("vDocType"),
        docNumber: document.getElementById("vDocNumber"),
        frontImg: document.getElementById("vFrontImg"),
        backImg: document.getElementById("vBackImg")
    }
};

// ================= UI FUNCTIONS =================

function toggleVForm() {
    const isHidden = V_DOM.formRow.style.display === "none";
    V_DOM.formRow.style.display = isHidden ? "block" : "none";
    V_DOM.toggleBtn.innerText = isHidden ? "❌ Close Form" : "➕ Upload New Document";
}

function renderVTable(data) {
    V_DOM.tbody.innerHTML = "";

    if (data.length === 0) {
        V_DOM.tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No pending documents found.</td></tr>`;
        return;
    }

    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <strong>${item.User?.firstName} ${item.User?.lastName}</strong><br>
                <small>${item.User?.email}</small>
            </td>
            <td style="text-transform: uppercase;">${item.docType}</td>
            <td><code>${item.docNumber}</code></td>
            <td>
                <img src="${item.frontPartUrl}" width="40" class="preview-img" style="cursor:pointer; border:1px solid #ddd;">
                ${item.backPartUrl ? `<img src="${item.backPartUrl}" width="40" class="preview-img" style="cursor:pointer; border:1px solid #ddd;">` : ''}
            </td>
            <td><span class="badge" style="background:#fff3cd; color:#856404;">${item.status}</span></td>
            <td>
                <button class="approve-v-btn" data-id="${item.id}" style="background:#28a745; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer;">Verify</button>
                <button class="reject-v-btn" data-id="${item.id}" style="background:#dc3545; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer;">Reject</button>
            </td>
            <td>
                <button class="delete-v-btn" data-id="${item.id}" style="border:none; background:none; cursor:pointer;">🗑️</button>
            </td>
        `;

        V_DOM.tbody.appendChild(row);
    });
}

// ================= API CALLS =================

async function fetchPendingDocs() {
    try {
        const res = await fetch(V_API.getAllPending);
        const result = await res.json();
        if (result.success) {
            renderVTable(result.data);
        }
    } catch (err) {
        console.error("Fetch Pending Error:", err);
    }
}

async function uploadDoc() {
    V_DOM.submitBtn.innerText = "Uploading...";

    const formData = new FormData();
    formData.append("userId", V_DOM.inputs.userId.value);
    formData.append("docType", V_DOM.inputs.docType.value);
    formData.append("docNumber", V_DOM.inputs.docNumber.value);
    formData.append("frontPartImage", V_DOM.inputs.frontImg.files[0]);
    if (V_DOM.inputs.backImg.files[0]) {
        formData.append("backPartImage", V_DOM.inputs.backImg.files[0]);
    }

    try {
        const res = await fetch(V_API.upload, {
            method: "POST",
            body: formData
        });
        const result = await res.json();
        if (result.success) {
            alert(result.message);
            toggleVForm();
            fetchPendingDocs();
        }
    } catch (err) {
        console.error("Upload failed:", err);
    }
    V_DOM.submitBtn.innerText = "✅ Upload & Submit";
}

async function updateVStatus(id, status) {
    const comment = prompt(`Enter ${status} comment:`, status === "verified" ? "Matched." : "Invalid Documents.");
    if (comment === null) return;

    try {
        const res = await fetch(V_API.updateStatus(id), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, adminComment: comment })
        });
        const result = await res.json();
        if (result.success) {
            fetchPendingDocs();
        }
    } catch (err) {
        console.error("Status Update Error:", err);
    }
}

async function deleteDoc(id) {
    if (!confirm("Are you sure you want to delete this record permanently?")) return;
    try {
        const res = await fetch(V_API.delete(id), { method: "DELETE" });
        const result = await res.json();
        if (result.success) fetchPendingDocs();
    } catch (err) {
        console.error("Delete Error:", err);
    }
}

// ================= EVENTS =================

function bindVEvents() {
    V_DOM.toggleBtn.onclick = toggleVForm;
    V_DOM.cancelBtn.onclick = toggleVForm;
    V_DOM.submitBtn.onclick = uploadDoc;

    V_DOM.tbody.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("approve-v-btn")) updateVStatus(id, "verified");
        if (e.target.classList.contains("reject-v-btn")) updateVStatus(id, "rejected");
        if (e.target.classList.contains("delete-v-btn")) deleteDoc(id);

        // Image Preview logic
        if (e.target.classList.contains("preview-img")) {
            document.getElementById("modalImg").src = e.target.src;
            document.getElementById("imageModal").style.display = "flex";
        }
    });

    document.getElementById("closeModal").onclick = () => {
        document.getElementById("imageModal").style.display = "none";
    };
}

// ================= INIT =================
function initVerificationPage() {
    bindVEvents();
    fetchPendingDocs();
}

initVerificationPage();