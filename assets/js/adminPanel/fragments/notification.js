// ================= CONFIG =================
const NOTIFY_API = {
    getAll: `${BASE_URL}/notification/all`,
    create: `${BASE_URL}/notification`,
    delete: (id) => `${BASE_URL}/notification/${id}`
};

// ================= DOM CACHE =================
const NOTIFY_DOM = {
    tbody: document.getElementById("notifyTableBody"),
    addBtn: document.getElementById("addNotifyBtn"),
    formRow: document.getElementById("notifyFormSection"),
    submitBtn: document.getElementById("submitNotify"),
    cancelBtn: document.getElementById("cancelNotify"),

    inputs: {
        userId: document.getElementById("targetUserId"),
        title: document.getElementById("notifyTitle"),
        message: document.getElementById("notifyMessage")
    }
};

// ================= STATE =================
let notifyState = {
    notifications: []
};

// ================= UI FUNCTIONS =================
function toggleNotifyForm() {
    const isHidden = NOTIFY_DOM.formRow.style.display === "none";
    NOTIFY_DOM.formRow.style.display = isHidden ? "block" : "none";
    NOTIFY_DOM.addBtn.innerText = isHidden ? "❌ Close Form" : "➕ Create New Notification";
}

function renderNotifyTable(data) {
    NOTIFY_DOM.tbody.innerHTML = "";

    if (!data || data.length === 0) {
        NOTIFY_DOM.tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No notifications found.</td></tr>`;
        return;
    }

    data.forEach(item => {
        const row = document.createElement("tr");

        // Target Badge Logic
        const targetLabel = item.userId
            ? `<span style="background:#e3f2fd; color:#0d47a1; padding:2px 6px; border-radius:4px; font-size:12px;">User: ${item.userId}</span>`
            : `<span style="background:#f3e5f5; color:#4a148c; padding:2px 6px; border-radius:4px; font-size:12px;">📢 Public</span>`;

        row.innerHTML = `
            <td>${targetLabel}</td>
            <td style="max-width: 300px;">
                <strong>${item.title}</strong><br>
                <small style="color:#666;">${item.message}</small>
            </td>
            <td>
                <span style="color: ${item.isRead ? '#2e7d32' : '#ed6c02'}; font-size: 13px;">
                    ${item.isRead ? '✅ Read' : '📩 Unread'}
                </span>
            </td>
            <td><small>${new Date(item.createdAt).toLocaleString()}</small></td>
            <td>
                <button class="delete-btn" data-id="${item.id}" style="background:#fff1f0; color:#ff4d4f; border:1px solid #ffccc7; padding:4px 8px; border-radius:4px; cursor:pointer;">
                    🗑️ Delete
                </button>
            </td>
        `;
        NOTIFY_DOM.tbody.appendChild(row);
    });
}

// ================= API CALLS =================

// ১. সব নোটিফিকেশন আনা
async function fetchNotifications() {
    try {
        const res = await fetch(NOTIFY_API.getAll);
        const result = await res.json();
        if (result.success) {
            notifyState.notifications = result.data;
            renderNotifyTable(result.data);
        }
    } catch (err) {
        console.error("Fetch Notifications Failed:", err);
    }
}

// ২. নতুন নোটিফিকেশন তৈরি
async function createNotification() {
    const title = NOTIFY_DOM.inputs.title.value;
    const message = NOTIFY_DOM.inputs.message.value;
    const userId = NOTIFY_DOM.inputs.userId.value || null;

    if (!title || !message) {
        alert("Title and Message are required!");
        return;
    }

    NOTIFY_DOM.submitBtn.innerText = "Sending...";
    NOTIFY_DOM.submitBtn.disabled = true;

    const payload = {
        userId: userId ? parseInt(userId) : null,
        title: title,
        message: message
    };

    try {
        const res = await fetch(NOTIFY_API.create, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
            alert("Notification sent successfully!");
            // Reset Form
            NOTIFY_DOM.inputs.title.value = "";
            NOTIFY_DOM.inputs.message.value = "";
            NOTIFY_DOM.inputs.userId.value = "";
            toggleNotifyForm();
            fetchNotifications();
        }
    } catch (err) {
        console.error("Creation failed:", err);
    } finally {
        NOTIFY_DOM.submitBtn.innerText = "🚀 Send Notification";
        NOTIFY_DOM.submitBtn.disabled = false;
    }
}

// ৩. নোটিফিকেশন ডিলিট
async function deleteNotification(id) {
    if (!confirm("Delete this notification?")) return;

    try {
        const res = await fetch(NOTIFY_API.delete(id), {
            method: "DELETE"
        });
        if (res.ok) fetchNotifications();
    } catch (err) {
        console.error("Delete failed:", err);
    }
}

// ================= EVENTS =================
function bindNotifyEvents() {
    NOTIFY_DOM.addBtn.addEventListener("click", toggleNotifyForm);
    NOTIFY_DOM.cancelBtn.addEventListener("click", toggleNotifyForm);
    NOTIFY_DOM.submitBtn.addEventListener("click", createNotification);

    NOTIFY_DOM.tbody.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            deleteNotification(e.target.dataset.id);
        }
    });
}

// ================= INIT =================
function initNotificationPage() {
    bindNotifyEvents();
    fetchNotifications();
}

initNotificationPage();